/**
 * Default Journeys for CampusCommerce
 */

export const defaultJourneys = [
  {
    id: "journey-campus-commerce",
    name: "Campus Commerce",
    description: "Main student marketplace journey with discovery, flash deals, cart & checkout.",
    icon: "🎓",
    foundationId: "foundation-default",
    currentBranchId: "main",
    pages: ["page_home", "page_product", "page_categories", "page_deals", "page_cart"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default defaultJourneys;
