import { PageRepository } from "../repositories/pageRepository.js";

export const PageService = {
  async getAllPages(journeyId) {
    if (journeyId) {
      return PageRepository.getByJourneyId(journeyId);
    }
    return PageRepository.getAll();
  },

  async getPageById(id) {
    const page = await PageRepository.getById(id);
    if (!page) {
      const error = new Error(`Page with ID "${id}" not found.`);
      error.statusCode = 404;
      error.code = "PAGE_NOT_FOUND";
      throw error;
    }
    return page;
  },

  async createPage(data) {
    if (!data.name) {
      const error = new Error("Page name is required.");
      error.statusCode = 400;
      error.code = "VALIDATION_ERROR";
      throw error;
    }

    return PageRepository.create(data);
  },

  async updatePage(id, data) {
    const existing = await PageRepository.getById(id);
    if (!existing) {
      const error = new Error(`Page with ID "${id}" not found.`);
      error.statusCode = 404;
      error.code = "PAGE_NOT_FOUND";
      throw error;
    }

    return PageRepository.update(id, data);
  },

  async deletePage(id) {
    const existing = await PageRepository.getById(id);
    if (!existing) {
      const error = new Error(`Page with ID "${id}" not found.`);
      error.statusCode = 404;
      error.code = "PAGE_NOT_FOUND";
      throw error;
    }

    await PageRepository.delete(id);
    return { deletedId: id };
  },
};

export default PageService;
