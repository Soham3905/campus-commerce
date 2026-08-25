import { useState, useCallback } from "react";
import { useHistory } from "./useHistory";
import { PageRepository } from "../services/pageRepository";
import { InterfaceRepository } from "../services/interfaceRepository";
import { JourneyRepository } from "../services/journeyRepository";
import { BranchRepository } from "../services/branchRepository";
import {
  findNodeById,
  updateNode,
  insertNode,
  insertNodeAtIndex,
  removeNode,
  moveNode,
  duplicateNode,
  cloneTree,
  canMoveNodeToSlot,
  moveNodeToSlot,
} from "../utils/treeUtils";
import { createComponent } from "../utils/componentFactory";
import { validateSchema, canAddChild } from "../utils/validation";
import { ensureStableIds } from "../utils/idUtils";
import { ComponentRegistry } from "../../registry/componentRegistry";

export function useCmsState() {
  const journeys = JourneyRepository.getAll();
  const initialJourney = journeys[0] || null;

  const [activeJourney, setActiveJourney] = useState(initialJourney);
  const [activeBranch, setActiveBranch] = useState("main");
  const [editingContext, setEditingContext] = useState(null); // null (Page) | string (e.g. 'ProductCard')

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

  const {
    state: schema,
    setState: setSchemaWithHistory,
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

      // Find target node to decide insertion strategy
      const targetNode = effectiveTargetId ? findNodeById(schema, effectiveTargetId) : null;
      const targetDef = targetNode ? ComponentRegistry[targetNode.type] : null;

      let insertTargetId;
      let insertPosition;

      if (!effectiveTargetId || !targetNode) {
        // No selection — insert into root Page level
        const rootChildren = schema.children || [];
        const pageNode = rootChildren.find((c) => c.type === "Page");
        insertTargetId = pageNode?.id || schema.id;
        insertPosition = "inside";
      } else if (targetDef && targetDef.canHaveChildren !== false) {
        // Check if allowed child
        const check = canAddChild(targetNode.type, type);
        if (check.valid) {
          insertTargetId = effectiveTargetId;
          insertPosition = "inside";
        } else {
          insertTargetId = effectiveTargetId;
          insertPosition = "after";
        }
      } else {
        insertTargetId = effectiveTargetId;
        insertPosition = "after";
      }

      if (position === "inside" || position === "before" || position === "after") {
        insertPosition = position;
      }

      const updated = insertNode(schema, insertTargetId, newNode, insertPosition);
      setSchema(updated);
      setSelectedComponentId(newNode.id);
      return newNode;
    },
    [schema, selectedComponentId, setSchema]
  );

  const addComponentAtSlot = useCallback(
    (type, slot) => {
      if (!slot?.parentId) {
        return { ok: false, reason: "Drop target is missing." };
      }

      const parentNode = findNodeById(schema, slot.parentId);
      if (!parentNode) {
        return { ok: false, reason: "Unable to find the target container." };
      }

      const check = canAddChild(parentNode, type);
      if (!check.valid) {
        return { ok: false, reason: check.reason };
      }

      const insertIndex = slot.afterIndex >= 0 ? slot.afterIndex + 1 : 0;
      const newNode = createComponent(type);
      const updated = insertNodeAtIndex(schema, slot.parentId, newNode, insertIndex);
      setSchema(updated);
      setSelectedComponentId(newNode.id);
      return { ok: true, node: newNode };
    },
    [schema, setSchema]
  );

  const moveComponentToSlot = useCallback(
    (id, slot) => {
      if (!id || !slot?.parentId) {
        return { ok: false, reason: "Drop target is missing." };
      }

      const check = canMoveNodeToSlot(schema, id, slot.parentId);
      if (!check.valid) {
        return { ok: false, reason: check.reason };
      }

      const insertIndex = slot.afterIndex >= 0 ? slot.afterIndex + 1 : 0;
      const updated = moveNodeToSlot(schema, id, slot.parentId, insertIndex);
      if (updated === schema) {
        return { ok: true, moved: false };
      }

      setSchema(updated);
      setSelectedComponentId(id);
      return { ok: true, moved: true };
    },
    [schema, setSchema]
  );

  const deleteComponent = useCallback(
    (id) => {
      const targetId = id || selectedComponentId;
      if (!targetId || targetId === schema.id) {
        console.warn("Cannot delete root container");
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

  // Apply JSON Schema with validation
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
        setEditingContext(null);
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

  // Switch to component-only editing mode
  const openComponentEditor = useCallback(
    (compType) => {
      setEditingContext(compType);

      // Create a standalone component instance inside a clean wrapper for visual editing
      const sampleComponent = createComponent(compType);
      const standaloneSchema = ensureStableIds({
        id: `editor_root_${compType}`,
        type: "Home",
        containerStyle: {
          backgroundColor: "#f8fafc",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "24px",
        },
        children: [
          {
            id: `editor_page_${compType}`,
            type: "Page",
            children: [sampleComponent],
          },
        ],
      });

      resetHistory(standaloneSchema);
      setSelectedComponentId(sampleComponent.id);
      setIsDirty(false);
      setSaveStatus("idle");
    },
    [resetHistory]
  );

  const saveCurrentPage = useCallback(() => {
    if (!activePage) return;
    setSaveStatus("saving");
    try {
      if (editingContext) {
        // Component-only save feedback
        setTimeout(() => {
          setIsDirty(false);
          setSaveStatus("saved");
          setTimeout(() => setSaveStatus("idle"), 2500);
        }, 300);
        return;
      }

      const updatedPage = {
        ...activePage,
        schema: cloneTree(schema),
      };
      PageRepository.save(updatedPage);
      if (activeBranch !== "main") {
        BranchRepository.updateBranchSnapshot(activeBranch, activePage.id, schema);
      }
      setActivePage(updatedPage);
      setIsDirty(false);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch (e) {
      console.error("[useCmsState] Failed to save page:", e);
      setSaveStatus("error");
    }
  }, [activePage, activeBranch, editingContext, schema]);

  // Branch switcher
  const switchBranch = useCallback(
    (branchName) => {
      setActiveBranch(branchName);
      const branches = BranchRepository.getAll();
      const branch = branches.find((b) => b.name === branchName);

      if (branch && branch.pageSnapshots?.[activePage?.id]) {
        const snapshot = ensureStableIds(cloneTree(branch.pageSnapshots[activePage.id]));
        resetHistory(snapshot);
      } else if (activePage?.schema) {
        const normalized = ensureStableIds(cloneTree(activePage.schema));
        resetHistory(normalized);
      }

      setIsDirty(false);
      setSaveStatus("idle");
    },
    [activePage, resetHistory]
  );

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

  const selectedNode = selectedComponentId
    ? findNodeById(schema, selectedComponentId)
    : null;

  return {
    schema,
    selectedComponentId,
    selectedNode,
    activeDevice,
    activePage,
    activeJourney,
    activeBranch,
    editingContext,
    activeInterfaceId,
    isDirty,
    saveStatus,
    canUndo,
    canRedo,
    setActiveDevice,
    setActiveJourney,
    setActiveBranch,
    setEditingContext,
    selectComponent,
    clearSelection,
    updateComponent,
    addComponent,
    addComponentAtSlot,
    deleteComponent,
    duplicateComponent: duplicateCurrentComponent,
    moveComponent: moveCurrentComponent,
    moveComponentToSlot,
    applyJsonSchema,
    switchPage,
    openComponentEditor,
    switchBranch,
    saveCurrentPage,
    loadInterface,
    undo,
    redo,
    resetHistory,
  };
}
