import { StorageService } from "./storage";
import { generateId } from "../utils/idUtils";
import { BranchRepository } from "./branchRepository";
import { PageRepository } from "./pageRepository";
import { calculateStructuredDiff } from "../utils/diffUtils";
import { validateSchema } from "../utils/validation";
import { cloneTree } from "../utils/treeUtils";

const PR_STORAGE_KEY = "campus_sdui_pull_requests";

export const PullRequestRepository = {
  getAll() {
    const list = StorageService.get(PR_STORAGE_KEY, []);
    return Array.isArray(list) ? list : [];
  },

  getByJourney(journeyId) {
    const all = this.getAll();
    return all.filter((pr) => !pr.journeyId || pr.journeyId === journeyId);
  },

  getById(id) {
    const all = this.getAll();
    return all.find((pr) => pr.id === id) || null;
  },

  createPullRequest({ journeyId = "journey-campus-commerce", sourceBranchId, targetBranchId = "main", title, description }) {
    const sourceBranch = BranchRepository.getById(sourceBranchId);
    const targetBranch = BranchRepository.getById(targetBranchId);

    if (!sourceBranch) {
      throw new Error(`Source branch "${sourceBranchId}" does not exist.`);
    }

    // Compute structured diff across all page snapshots
    const allPages = PageRepository.getAll();
    let aggregatedChanges = [];

    allPages.forEach((page) => {
      const beforeTree = targetBranch?.pageSnapshots?.[page.id] || page.schema;
      const afterTree = sourceBranch?.pageSnapshots?.[page.id] || page.schema;

      const pageDiff = calculateStructuredDiff(beforeTree, afterTree);
      if (pageDiff.length > 0) {
        aggregatedChanges.push(...pageDiff);
      }
    });

    if (aggregatedChanges.length === 0) {
      aggregatedChanges.push({
        type: "MODIFIED",
        componentType: "Page",
        summary: "Branch snapshot ready for review",
        details: "No conflicting delta detected.",
      });
    }

    const newPR = {
      id: `pr-${generateId()}`,
      journeyId,
      sourceBranchId: sourceBranch.id,
      sourceBranchName: sourceBranch.name,
      targetBranchId: targetBranchId || "main",
      title: title || `Merge ${sourceBranch.name} into main`,
      description: description || "Proposed component updates and layout modifications.",
      changes: aggregatedChanges,
      status: "open", // 'open' | 'merged' | 'rejected'
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const all = this.getAll();
    const updated = [newPR, ...all];
    StorageService.set(PR_STORAGE_KEY, updated);
    return newPR;
  },

  /**
   * Pre-merge validation check.
   * @param {string} prId
   * @returns {{ canMerge: boolean, errors: Array<string> }}
   */
  validateMerge(prId) {
    const pr = this.getById(prId);
    if (!pr) return { canMerge: false, errors: ["Pull Request not found."] };

    const sourceBranch = BranchRepository.getById(pr.sourceBranchId);
    if (!sourceBranch) {
      return { canMerge: false, errors: ["Source branch no longer exists."] };
    }

    const errors = [];
    Object.keys(sourceBranch.pageSnapshots || {}).forEach((pageId) => {
      const schema = sourceBranch.pageSnapshots[pageId];
      const check = validateSchema(schema);
      if (!check.isValid) {
        errors.push(`Page [${pageId}]: ${check.errors.join(", ")}`);
      }
    });

    return {
      canMerge: errors.length === 0,
      errors,
    };
  },

  /**
   * Merges a Pull Request into target branch and live pages.
   * @param {string} prId
   * @returns {{ success: boolean, reason?: string }}
   */
  mergePullRequest(prId) {
    const pr = this.getById(prId);
    if (!pr) return { success: false, reason: "Pull Request not found." };
    if (pr.status === "merged") return { success: false, reason: "PR is already merged." };

    const validation = this.validateMerge(prId);
    if (!validation.canMerge) {
      return {
        success: false,
        reason: `Merge blocked due to schema errors:\n${validation.errors.join("\n")}`,
      };
    }

    const sourceBranch = BranchRepository.getById(pr.sourceBranchId);

    // Apply snapshots to target branch & live PageRepository
    Object.keys(sourceBranch.pageSnapshots || {}).forEach((pageId) => {
      const schema = cloneTree(sourceBranch.pageSnapshots[pageId]);
      const existingPage = PageRepository.getById(pageId);
      if (existingPage) {
        PageRepository.save({
          ...existingPage,
          schema,
        });
      }
      BranchRepository.updateBranchSnapshot("main", pageId, schema);
    });

    // Update PR status
    const all = this.getAll();
    const updated = all.map((item) =>
      item.id === prId ? { ...item, status: "merged", mergedAt: new Date().toISOString() } : item
    );
    StorageService.set(PR_STORAGE_KEY, updated);

    return { success: true };
  },

  rejectPullRequest(prId) {
    const all = this.getAll();
    const updated = all.map((item) =>
      item.id === prId ? { ...item, status: "rejected", closedAt: new Date().toISOString() } : item
    );
    StorageService.set(PR_STORAGE_KEY, updated);
    return true;
  },
};

export default PullRequestRepository;
