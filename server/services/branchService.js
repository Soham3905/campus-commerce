import { BranchRepository } from "../repositories/branchRepository.js";
import { PageRepository } from "../repositories/pageRepository.js";

export const BranchService = {
  async getAllBranches(journeyId) {
    if (journeyId) {
      return BranchRepository.getByJourneyId(journeyId);
    }
    return BranchRepository.getAll();
  },

  async getBranchById(id) {
    const branch = await BranchRepository.getById(id);
    if (!branch) {
      const error = new Error(`Branch with ID "${id}" not found.`);
      error.statusCode = 404;
      error.code = "BRANCH_NOT_FOUND";
      throw error;
    }
    return branch;
  },

  async createBranch({ journeyId = "journey-campus-commerce", sourceBranchId = "main", name, description }) {
    if (!name || !name.trim()) {
      const error = new Error("Branch name is required.");
      error.statusCode = 400;
      error.code = "VALIDATION_ERROR";
      throw error;
    }

    const all = await BranchRepository.getAll();
    const cleanName = name.trim().toLowerCase().replace(/\s+/g, "-");

    const existingName = all.find((b) => b.name === cleanName && b.journeyId === journeyId);
    if (existingName) {
      const error = new Error(`A branch named "${cleanName}" already exists.`);
      error.statusCode = 409;
      error.code = "BRANCH_ALREADY_EXISTS";
      throw error;
    }

    const sourceBranch = await BranchRepository.getById(sourceBranchId) || all.find((b) => b.id === "main");
    const pages = await PageRepository.getAll();

    // Initialize page snapshots from source branch or live pages
    const initialSnapshots = {};
    pages.forEach((p) => {
      if (sourceBranch?.pageSnapshots?.[p.id]) {
        initialSnapshots[p.id] = JSON.parse(JSON.stringify(sourceBranch.pageSnapshots[p.id]));
      } else if (p.schema) {
        initialSnapshots[p.id] = JSON.parse(JSON.stringify(p.schema));
      }
    });

    const newBranch = {
      id: `branch-${Date.now()}`,
      journeyId,
      name: cleanName,
      sourceBranchId: sourceBranch?.id || "main",
      description: description || `Working branch created from ${sourceBranch?.name || "main"}`,
      pageSnapshots: initialSnapshots,
      status: "active",
    };

    return BranchRepository.create(newBranch);
  },

  async updateBranchSnapshot(branchId, pageId, schema) {
    const branch = await BranchRepository.getById(branchId);
    if (!branch) {
      const error = new Error(`Branch with ID "${branchId}" not found.`);
      error.statusCode = 404;
      error.code = "BRANCH_NOT_FOUND";
      throw error;
    }

    return BranchRepository.updateSnapshot(branchId, pageId, schema);
  },

  async deleteBranch(id) {
    if (id === "main") {
      const error = new Error("Cannot delete main branch.");
      error.statusCode = 400;
      error.code = "CANNOT_DELETE_MAIN";
      throw error;
    }

    const branch = await BranchRepository.getById(id);
    if (!branch) {
      const error = new Error(`Branch with ID "${id}" not found.`);
      error.statusCode = 404;
      error.code = "BRANCH_NOT_FOUND";
      throw error;
    }

    await BranchRepository.delete(id);
    return { deletedId: id };
  },
};

export default BranchService;
