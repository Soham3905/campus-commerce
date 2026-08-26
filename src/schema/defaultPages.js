import { defaultInterfaces } from "./defaultInterfaces";
import { fullPageJSON } from "./landingSchema";
import { ensureStableIds } from "../cms/utils/idUtils";
import { createComponent } from "../cms/utils/componentFactory";
import { GridEngine } from "../cms/layout/gridEngine";

function preparePageSchema(schema) {
  if (!schema) return schema;
  const clone = ensureStableIds(JSON.parse(JSON.stringify(schema)));
  if (Array.isArray(clone.children)) {
    clone.children = clone.children.map((child) => {
      if (child.type === "Page" && Array.isArray(child.children)) {
        return {
          ...child,
          children: GridEngine.reflowChildren(child.children, "all", { parentType: "Page" }),
        };
      }
      return child;
    });
  }
  return clone;
}

export const defaultPages = [
  {
    id: "page_home",
    name: "Home Storefront",
    route: "home",
    interfaceId: "ecommerce-home",
    schema: preparePageSchema(fullPageJSON),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "page_product",
    name: "AudioPro Headphones",
    route: "product",
    interfaceId: "product-details",
    schema: preparePageSchema(defaultInterfaces.find((i) => i.id === "product-details")?.schema || fullPageJSON),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "page_categories",
    name: "Categories Discovery",
    route: "categories",
    interfaceId: "category-showcase",
    schema: preparePageSchema(defaultInterfaces.find((i) => i.id === "category-showcase")?.schema || fullPageJSON),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "page_deals",
    name: "Mega Flash Deals",
    route: "deals",
    interfaceId: "marketing-landing",
    schema: preparePageSchema(defaultInterfaces.find((i) => i.id === "marketing-landing")?.schema || fullPageJSON),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "page_cart",
    name: "Shopping Cart",
    route: "cart",
    interfaceId: "blank-page",
    schema: preparePageSchema({
      type: "Home",
      containerStyle: { backgroundColor: "#F6F6F4" },
      children: [
        {
          type: "Page",
          children: [
            createComponent("Header", {
              placement: {
                mobile: { colStart: 1, colEnd: 100, rowStart: 1, rowEnd: 6 },
                tablet: { colStart: 1, colEnd: 100, rowStart: 1, rowEnd: 6 },
                desktop: { colStart: 1, colEnd: 100, rowStart: 1, rowEnd: 6 },
              },
              children: [
                createComponent("HeaderButton", {
                  data: { label: "← Back", icon: "", id: "back_cart" },
                  actions: { onTap: { type: "NAVIGATE", route: "home" } },
                }),
                createComponent("HeaderButton", {
                  data: { label: "My Shopping Cart 🛒", icon: "", id: "cart_title" },
                }),
              ],
            }),
            createComponent("Title", {
              placement: {
                mobile: { colStart: 1, colEnd: 100, rowStart: 8, rowEnd: 14 },
                tablet: { colStart: 1, colEnd: 100, rowStart: 8, rowEnd: 14 },
                desktop: { colStart: 1, colEnd: 100, rowStart: 8, rowEnd: 14 },
              },
              data: { text: "Items in your cart (3)" },
            }),
            createComponent("CouponCode", {
              placement: {
                mobile: { colStart: 1, colEnd: 100, rowStart: 15, rowEnd: 25 },
                tablet: { colStart: 1, colEnd: 100, rowStart: 15, rowEnd: 25 },
                desktop: { colStart: 1, colEnd: 100, rowStart: 15, rowEnd: 25 },
              },
              data: {
                title: "SAVE100",
                description: "Flat ₹100 instant discount on checkout",
                copyLabel: "Apply",
              },
            }),
          ],
        },
      ],
    }),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default defaultPages;
