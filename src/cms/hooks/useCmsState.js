import { useState, useCallback, useEffect } from "react";
import { useHistory } from "./useHistory";
import { PageRepository } from "../services/pageRepository";
import { InterfaceRepository } from "../services/interfaceRepository";
import {
  findNodeById,
  findParentById,
  updateNode,
  insertNode,
  removeNode,
  moveNode,
  duplicateNode,
  cloneTree,
} from "../utils/treeUtils";
import { createComponent } from "../utils/componentFactory";
import { validateSchema } from "../utils/validation";
import { ensureStableIds } from "../utils/idUtils";
import { ComponentRegistry } from "../../registry/componentRegistry";

export function useCmsState() {
  const initialPages = PageRepository.getAll();
  const initialPage = initialPages[0] || null;

  const [activePage, setActivePage] = useState(initialPage);
  const [activeInterfaceId, setActiveInterfaceId] = useState(
    initialPage?.interfaceId || "ecommerce-home"
  );
  const [selectedComponentId, setSelectedComponentId] = useState(null);
  const [activeDevice, setActiveDevice] = useState("desktop");
  const [isDirty, setIsDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle"); // 'idle' | 'saving' | 'saved' | 'error'
  const [activeTab, setActiveTab] = useState("inspector"); // 'inspector' | 'layers' | 'library' | 'json'

  const {
    state: schema,
    setState: setSchemaWithHistory,
    setDirectState: setDirectSchema,
    undo,
    redo,
    canUndo,
    canRedo,
    resetHistory,
  } = useHistory(initialPage?.schema ? ensureStableIds(initialPage.schema) : {});

  // Update dirty state whenever schema changes
  const setSchema = useCallback(
    (newSchema) => {
      setSchemaWithHistory(newSchema);
      setIsDirty(true);
      setSaveStatus("idle");
    },
    [setSchemaWithHistory]
  );

  // Selection handlers
  const selectComponent = useCallback((id) => {
    setSelectedComponentId(id);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedComponentId(null);
  }, []);

  // Tree mutation operations
  const updateComponent = useCallback(
    (id, updater) => {
      if (!id) return;
      // Support full-node replacement (from JsonTab)
      // If updater is a complete node object with an `id` field and no function signature,
      // we replace the entire node instead of merging.
      if (typeof updater === "object" && updater !== null && updater.id && updater.type) {
        const replaced = updateNode(schema, id, () => updater);
        setSchema(replaced);
        return;
      }
      const updated = updateNode(schema, id, updater);
      setSchema(updated);
    },
    [schema, setSchema]
  );

  const addComponent = useCallback(
    (type, targetId = null, position = null) => {
      const newNode = createComponent(type);
      const effectiveTargetId = targetId || selectedComponentId;

      // Find selected node to decide insertion strategy
      const targetNode = effectiveTargetId ? findNodeById(schema, effectiveTargetId) : null;
      const targetDef = targetNode ? ComponentRegistry[targetNode.type] : null;

      let insertTargetId;
      let insertPosition;

      if (!effectiveTargetId || !targetNode) {
        // No selection — insert at root Page level
        const rootChildren = schema.children || [];
        const pageNode = rootChildren.find((c) => c.type === "Page");
        insertTargetId = pageNode?.id || schema.id;
        insertPosition = "inside";
      } else if (targetDef && targetDef.canHaveChildren !== false) {
        // Selected node can have children — insert inside it
        insertTargetId = effectiveTargetId;
        insertPosition = "inside";
      } else {
        // Selected node is a leaf — insert after it (as a sibling)
        insertTargetId = effectiveTargetId;
        insertPosition = "after";
      }

      const updated = insertNode(schema, insertTargetId, newNode, insertPosition);
      setSchema(updated);
      setSelectedComponentId(newNode.id);
      return newNode;
    },
    [schema, selectedComponentId, setSchema]
  );

  const deleteComponent = useCallback(
    (id) => {
      const targetId = id || selectedComponentId;
      if (!targetId || targetId === schema.id) {
        console.warn("Cannot delete the root Home container");
        return;
      }
      const updated = removeNode(schema, targetId);
      if (updated) {
        setSchema(updated);
        if (selectedComponentId === targetId) {
          setSelectedComponentId(null);
        }
      }
    },
    [schema, selectedComponentId, setSchema]
  );

  const duplicateCurrentComponent = useCallback(
    (id) => {
      const targetId = id || selectedComponentId;
      if (!targetId || targetId === schema.id) return;
      const updated = duplicateNode(schema, targetId);
      setSchema(updated);
    },
    [schema, selectedComponentId, setSchema]
  );

  const moveCurrentComponent = useCallback(
    (id, direction) => {
      const targetId = id || selectedComponentId;
      if (!targetId) return;
      const updated = moveNode(schema, targetId, direction);
      setSchema(updated);
    },
    [schema, selectedComponentId, setSchema]
  );

  // Apply JSON Schema
  const applyJsonSchema = useCallback(
    (jsonInput) => {
      const validation = validateSchema(jsonInput);
      if (!validation.isValid) {
        throw new Error(validation.errors[0] || "Schema validation failed.");
      }
      const normalized = ensureStableIds(validation.parsedSchema);
      setSchema(normalized);
      setSelectedComponentId(null);
    },
    [setSchema]
  );

  // Page management
  const switchPage = useCallback(
    (pageId) => {
      const page = PageRepository.getById(pageId);
      if (page) {
        setActivePage(page);
        setActiveInterfaceId(page.interfaceId || "ecommerce-home");
        const normalized = ensureStableIds(cloneTree(page.schema));
        resetHistory(normalized);
        setSelectedComponentId(null);
        setIsDirty(false);
        setSaveStatus("idle");
      }
    },
    [resetHistory]
  );

  const saveCurrentPage = useCallback(() => {
    if (!activePage) return;
    setSaveStatus("saving");
    try {
      const updatedPage = {
        ...activePage,
        schema: cloneTree(schema),
      };
      PageRepository.save(updatedPage);
      setActivePage(updatedPage);
      setIsDirty(false);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch (e) {
      console.error("[useCmsState] Failed to save page:", e);
      setSaveStatus("error");
    }
  }, [activePage, schema]);

  // Interface management
  const loadInterface = useCallback(
    (interfaceId) => {
      const blueprint = InterfaceRepository.getById(interfaceId);
      if (blueprint) {
        setActiveInterfaceId(blueprint.id);
        const normalized = ensureStableIds(cloneTree(blueprint.schema));
        setSchema(normalized);
        setSelectedComponentId(null);
      }
    },
    [setSchema]
  );

  // Get currently selected node object
  const selectedNode = selectedComponentId
    ? findNodeById(schema, selectedComponentId)
    : null;

  return {
    schema,
    selectedComponentId,
    selectedNode,
    activeDevice,
    activePage,
    activeInterfaceId,
    isDirty,
    saveStatus,
    activeTab,
    canUndo,
    canRedo,
    setActiveDevice,
    setActiveTab,
    selectComponent,
    clearSelection,
    updateComponent,
    addComponent,
    deleteComponent,
    duplicateComponent: duplicateCurrentComponent,
    moveComponent: moveCurrentComponent,
    applyJsonSchema,
    switchPage,
    saveCurrentPage,
    loadInterface,
    undo,
    redo,
    resetHistory,
  };
}
