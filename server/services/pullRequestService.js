import { PullRequestRepository } from "../repositories/pullRequestRepository.js";
import { BranchRepository } from "../repositories/branchRepository.js";
import { PageRepository } from "../repositories/pageRepository.js";

/**
 * Calculates a structured change summary between before and after schema trees.
 */
function calculateTreeDiff(beforeTree, afterTree) {
  const changes = [];
  if (!beforeTree || !afterTree) return changes;

  const getIds = (node, set = new Map()) => {
    if (!node || typeof node !== "object") return set;
    if (node.id) set.set(node.id, node);
    if (Array.isArray(node.children)) {
      node.children.forEach((c) => getIds(c, set));
    }
    return set;
  };

  const beforeMap = getIds(beforeTree);
  const afterMap = getIds(afterTree);

  // Added nodes
  afterMap.forEach((node, id) => {
    if (!beforeMap.has(id)) {
      changes.push({
        type: "ADDED",
        componentType: node.type,
        summary: `Added new ${node.type} (${id})`,
        details: node.data?.title || node.data?.label || "",
      });
    }
  });

  // Deleted nodes
  beforeMap.forEach((node, id) => {
    if (!afterMap.has(id)) {
      changes.push({
        type: "DELETED",
        componentType: node.type,
        summary: `Removed ${node.type} (${id})`,
        details: node.data?.title || node.data?.label || "",
      });
    }
  });

  // Modified nodes
  afterMap.forEach((node, id) => {
    if (beforeMap.has(id)) {
      const beforeNode = beforeMap.get(id);
      const dataChanged = JSON.stringify(beforeNode.data) !== JSON.stringify(node.data);
      const styleChanged = JSON.stringify(beforeNode.containerStyle) !== JSON.stringify(node.containerStyle);
      const placementChanged = JSON.stringify(beforeNode.placement) !== JSON.stringify(node.placement);

      if (dataChanged || styleChanged || placementChanged) {
        changes.push({
          type: "MODIFIED",
          componentType: node.type,
          summary: `Modified ${node.type} (${id})`,
          details: dataChanged ? "Data / text modified" : placementChanged ? "Placement / size updated" : "Styling updated",
        });
      }
    }
  });

  return changes;
}

export const PullRequestService = {
  async getAll(journeyId) {
    if (journeyId) {
      return PullRequestRepository.getByJourneyId(journeyId);
    }
    return PullRequestRepository.getAll();
  },

  async getById(id) {
    const pr = await PullRequestRepository.getById(id);
    if (!pr) {
      const error = new Error(`Pull Request with ID "${id}" not found.`);
      error.statusCode = 404;
      error.code = "PR_NOT_FOUND";
      throw error;
    }
    return pr;
  },

  async createPullRequest({
    journeyId = "journey-campus-commerce",
    sourceBranchId,
    targetBranchId = "main",
    title,
    description,
  }) {
    const sourceBranch = await BranchRepository.getById(sourceBranchId);
    const targetBranch = await BranchRepository.getById(targetBranchId);

    if (!sourceBranch) {
      const error = new Error(`Source branch "${sourceBranchId}" does not exist.`);
      error.statusCode = 400;
      error.code = "BRANCH_NOT_FOUND";
      throw error;
    }

    const pages = await PageRepository.getAll();
    const aggregatedChanges = [];

    pages.forEach((page) => {
      const beforeTree = targetBranch?.pageSnapshots?.[page.id] || page.schema;
      const afterTree = sourceBranch?.pageSnapshots?.[page.id] || page.schema;
      const pageChanges = calculateTreeDiff(beforeTree, afterTree);
      aggregatedChanges.push(...pageChanges);
    });

    if (aggregatedChanges.length === 0) {
      aggregatedChanges.push({
        type: "MODIFIED",
        componentType: "Page",
        summary: "Branch snapshot ready for review",
        details: "Clean delta ready for integration.",
      });
    }

    const newPr = {
      journeyId,
      sourceBranchId: sourceBranch.id,
      sourceBranchName: sourceBranch.name,
      targetBranchId: targetBranchId || "main",
      title: title || `Merge ${sourceBranch.name} into main`,
      description: description || "Proposed component updates and layout modifications.",
      changes: aggregatedChanges,
      status: "open",
    };

    return PullRequestRepository.create(newPr);
  },

  async approvePullRequest(id) {
    const pr = await this.getById(id);
    if (pr.status === "merged") {
      const error = new Error("Pull Request is already merged.");
      error.statusCode = 400;
      error.code = "ALREADY_MERGED";
      throw error;
    }

    return PullRequestRepository.update(id, {
      isApproved: true,
      approvedAt: new Date().toISOString(),
    });
  },

  async rejectPullRequest(id) {
    const pr = await this.getById(id);
    if (pr.status === "merged") {
      const error = new Error("Cannot reject an already merged Pull Request.");
      error.statusCode = 400;
      error.code = "ALREADY_MERGED";
      throw error;
    }

    return PullRequestRepository.update(id, {
      status: "rejected",
      closedAt: new Date().toISOString(),
    });
  },

  /**
   * Merges an approved branch state into target branch and main pages JSON.
   */
  async mergePullRequest(id) {
    const pr = await this.getById(id);
    if (pr.status === "merged") {
      const error = new Error("Pull Request is already merged.");
      error.statusCode = 400;
      error.code = "ALREADY_MERGED";
      throw error;
    }

    const sourceBranch = await BranchRepository.getById(pr.sourceBranchId);
    if (!sourceBranch) {
      const error = new Error(`Source branch "${pr.sourceBranchId}" no longer exists.`);
      error.statusCode = 400;
      error.code = "BRANCH_NOT_FOUND";
      throw error;
    }

    // Apply all snapshots to main PageRepository & main branch
    const snapshots = sourceBranch.pageSnapshots || {};
    const updatedPages = [];

    for (const pageId of Object.keys(snapshots)) {
      const schema = snapshots[pageId];
      const page = await PageRepository.getById(pageId);
      if (page) {
        const saved = await PageRepository.update(pageId, { schema });
        updatedPages.push(saved);
      }
      await BranchRepository.updateSnapshot("main", pageId, schema);
    }

    // Mark PR as merged
    const updatedPr = await PullRequestRepository.update(id, {
      status: "merged",
      mergedAt: new Date().toISOString(),
    });

    return {
      success: true,
      pullRequest: updatedPr,
      updatedPages,
    };
  },
};

export default PullRequestService;
