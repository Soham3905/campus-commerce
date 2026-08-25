import { StorageService } from "./storage";
import { generateId } from "../utils/idUtils";
import { cloneTree } from "../utils/treeUtils";
import { PageRepository } from "./pageRepository";

const BRANCHES_STORAGE_KEY = "campus_sdui_branches";

const defaultBranches = [
  {
    id: "main",
    journeyId: "journey-campus-commerce",
    name: "main",
    sourceBranchId: null,
    description: "Production mainline branch",
    pageSnapshots: {},
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const BranchRepository = {
  getAll() {
    const list = StorageService.get(BRANCHES_STORAGE_KEY, null);
    if (!list || !Array.isArray(list) || list.length === 0) {
      StorageService.set(BRANCHES_STORAGE_KEY, defaultBranches);
      return defaultBranches;
    }
    return list;
  },

  getByJourney(journeyId) {
    const all = this.getAll();
    return all.filter((b) => !b.journeyId || b.journeyId === journeyId);
  },

  getById(id) {
    const all = this.getAll();
    return all.find((b) => b.id === id) || null;
  },

  createBranch({ journeyId = "journey-campus-commerce", sourceBranchId = "main", name, description }) {
    const all = this.getAll();
    const sourceBranch = this.getById(sourceBranchId) || all.find((b) => b.id === "main");

    // Initialize snapshots from current live pages if source is main and has no snapshots
    const initialSnapshots = {};
    const currentPages = PageRepository.getAll();
    currentPages.forEach((p) => {
      if (sourceBranch?.pageSnapshots?.[p.id]) {
        initialSnapshots[p.id] = cloneTree(sourceBranch.pageSnapshots[p.id]);
      } else {
        initialSnapshots[p.id] = cloneTree(p.schema);
      }
    });

    const newBranch = {
      id: `branch-${generateId()}`,
      journeyId,
      name: name.trim().toLowerCase().replace(/\s+/g, "-"),
      sourceBranchId: sourceBranch?.id || "main",
      description: description || "Feature working branch",
      pageSnapshots: initialSnapshots,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [...all, newBranch];
    StorageService.set(BRANCHES_STORAGE_KEY, updated);
    return newBranch;
  },

  updateBranchSnapshot(branchId, pageId, schema) {
    const all = this.getAll();
    const index = all.findIndex((b) => b.id === branchId);
    if (index === -1) return null;

    const branch = all[index];
    const updatedBranch = {
      ...branch,
      pageSnapshots: {
        ...(branch.pageSnapshots || {}),
        [pageId]: cloneTree(schema),
      },
      updatedAt: new Date().toISOString(),
    };

    const updated = [...all];
    updated[index] = updatedBranch;
    StorageService.set(BRANCHES_STORAGE_KEY, updated);
    return updatedBranch;
  },

  deleteBranch(branchId) {
    if (branchId === "main") {
      console.warn("Cannot delete main branch");
      return false;
    }
    const all = this.getAll();
    const filtered = all.filter((b) => b.id !== branchId);
    StorageService.set(BRANCHES_STORAGE_KEY, filtered);
    return true;
  },
};

export default BranchRepository;
