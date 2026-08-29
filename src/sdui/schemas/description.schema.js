/**
 * Description Component Schema (Interface)
 * 
 * Defines the contract for the Description typography atom component.
 */

export const DescriptionSchema = {
  type: 'Description',
  displayName: 'Description',
  category: 'Typography',
  allowedChildren: [], // Leaf component
  defaultData: {
    text: 'Product description goes here...',
    maxLines: 2
  },
  defaultStyle: {
    fontSize: "13px",
    color: "#555",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden"
  }
};
