import { useState, useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "./useHistory";
import {
  fetchPages,
  savePage,
  setActivePageId,
  updateLocalPageSchema,
  createPage,
  deletePage as deletePageAction,
} from "../../store/slices/pageSlice";
import {
  fetchJourneys,
  setActiveJourneyId,
} from "../../store/slices/journeySlice";
import { FoundationRepository } from "../services/foundationRepository";
import { applyFoundationTheme } from "../utils/themeApply";
import {
  fetchBranches,
  setActiveBranch,
  saveBranchSnapshot,
} from "../../store/slices/branchSlice";
import {
  fetchPullRequests,
} from "../../store/slices/pullRequestSlice";
import {
  fetchThemes,
} from "../../store/slices/themeSlice";
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
import { defaultPages } from "../../schema/defaultPages";
import { GridEngine } from "../layout/gridEngine";

export function useCmsState() {
  const dispatch = useDispatch();

  // Redux store selectors
  const journeys = useSelector((state) => state.journeys.list);
  const activeJourneyId = useSelector((state) => state.journeys.activeJourneyId);
  const pages = useSelector((state) => state.pages.list);
  const activePageId = useSelector((state) => state.pages.activePageId);
  const branches = useSelector((state) => state.branches.list);
  const activeBranchName = useSelector((state) => state.branches.activeBranchName);
  const activeBranchId = useSelector((state) => state.branches.activeBranchId);
  const pullRequests = useSelector((state) => state.pullRequests.list);

  const activeJourney = journeys.find((j) => j.id === activeJourneyId) || journeys[0] || null;
  const activePage = pages.find((p) => p.id === activePageId) || pages[0] || defaultPages[0];

  // Local working & editor UI state
  const [editingContext, setEditingContext] = useState(null); // null (Page) | string (e.g. 'ProductCard')
  const [activeInterfaceId, setActiveInterfaceId] = useState("ecommerce-home");
  const [selectedComponentId, setSelectedComponentId] = useState(null);
  const [activeDevice, setActiveDevice] = useState("desktop");
  const [isDirty, setIsDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle"); // 'idle' | 'saving' | 'saved' | 'error'

  const initialSchema = activePage?.schema
    ? ensureStableIds(cloneTree(applyFoundationTheme(activePage.schema, FoundationRepository.get())))
    : defaultPages[0].schema;

  // Undo / Redo history
  const {
    state: schema,
    setState: setSchemaWithHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    resetHistory,
  } = useHistory(initialSchema);

  const initializedRef = useRef(false);

  // Initial data loading from Express API into Redux
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      dispatch(fetchJourneys());
      dispatch(fetchPages());
      dispatch(fetchBranches());
      dispatch(fetchPullRequests());
      dispatch(fetchThemes());
    }
  }, [dispatch]);

  // Sync schema when active page or active branch changes
  useEffect(() => {
    if (activePage && !editingContext) {
      const currentBranch = branches.find(
        (b) => b.name === activeBranchName || b.id === activeBranchId
      );
      const branchSchema = currentBranch?.pageSnapshots?.[activePage.id];
      const targetSchema = branchSchema || activePage.schema;

      if (targetSchema) {
        const themedSchema = applyFoundationTheme(targetSchema, FoundationRepository.get());
        resetHistory(ensureStableIds(cloneTree(themedSchema)));
        setIsDirty(false);
        setSaveStatus("idle");
      }
    }
  }, [activePageId, activeBranchName, activeBranchId, branches, resetHistory, editingContext]);

  // Update dirty state whenever schema changes
  const setSchema = useCallback(
    (newSchema) => {
      setSchemaWithHistory(newSchema);
      setIsDirty(true);
      setSaveStatus("idle");
      if (activePage?.id) {
        dispatch(updateLocalPageSchema({ pageId: activePage.id, schema: newSchema }));
      }
    },
    [setSchemaWithHistory, activePage?.id, dispatch]
  );

  const applyJsonSchema = useCallback(
    (newSchema) => {
      let parsed = newSchema;
      if (typeof newSchema === "string") {
        try {
          parsed = JSON.parse(newSchema);
        } catch (e) {
          console.error("Invalid JSON input:", e);
          return;
        }
      }
      if (!parsed || typeof parsed !== "object") return;
      const prepared = ensureStableIds(cloneTree(parsed));
      setSchema(prepared);
      setSelectedComponentId(null);
    },
    [setSchema]
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
      const rootChildren = schema.children || [];
      const pageNode = rootChildren.find((c) => c.type === "Page");
      const targetParent = pageNode || schema;
      const targetParentId = targetParent.id;

      let insertIndex = 0;
      if (Array.isArray(targetParent?.children) && targetParent.children.length > 0) {
        if (targetParent.children[0]?.type === "Header" && type !== "Header") {
          insertIndex = 1;
        } else {
          insertIndex = 0;
        }
      }

      const updated = insertNodeAtIndex(schema, targetParentId, newNode, insertIndex);
      setSchema(updated);
      setSelectedComponentId(newNode.id);
      return newNode;
    },
    [schema, setSchema]
  );

  const addComponentAtSlot = useCallback(
    (type, slot) => {
      if (!slot?.parentId) {
        return { ok: false, reason: "Drop target is missing." };
      }

      let targetParent = findNodeById(schema, slot.parentId);
      if (!targetParent) {
        return { ok: false, reason: `Target node not found.` };
      }

      let insertIndex = Math.max(0, slot.afterIndex >= 0 ? slot.afterIndex + 1 : 0);

      // If targetParent cannot directly accept type, bubble up to nearest valid ancestor
      if (!canAddChild(targetParent, type).valid) {
        let parentInfo = findParentById(schema, targetParent.id);
        while (parentInfo && !canAddChild(parentInfo.parent, type).valid) {
          parentInfo = findParentById(schema, parentInfo.parent.id);
        }
        if (parentInfo && canAddChild(parentInfo.parent, type).valid) {
          insertIndex = parentInfo.index + 1;
          targetParent = parentInfo.parent;
        } else {
          const check = canAddChild(targetParent, type);
          return { ok: false, reason: check.reason };
        }
      }

      const newNode = createComponent(type);
      const updated = insertNodeAtIndex(schema, targetParent.id, newNode, insertIndex);

      setSchema(updated);
      setSelectedComponentId(newNode.id);
      return { ok: true, node: newNode };
    },
    [schema, setSchema]
  );

  const moveComponentToSlot = useCallback(
    (nodeId, slot) => {
      if (!slot?.parentId) {
        return { ok: false, reason: "Target parent is missing." };
      }

      const insertIndex = Math.max(0, slot.afterIndex >= 0 ? slot.afterIndex + 1 : 0);
      const updated = moveNodeToSlot(schema, nodeId, slot.parentId, insertIndex);

      if (!updated) {
        return { ok: false, reason: "Move operation rejected by contract validator." };
      }

      setSchema(updated);
      setSelectedComponentId(nodeId);
      return { ok: true };
    },
    [schema, setSchema]
  );

  const insertBlockAtSlot = useCallback(
    (blockTree, slot) => {
      if (!slot?.parentId || !blockTree) return { ok: false };
      const prepared = ensureStableIds(cloneTree(blockTree));
      const insertIndex = Math.max(0, slot.afterIndex >= 0 ? slot.afterIndex + 1 : 0);
      const updated = insertNodeAtIndex(schema, slot.parentId, prepared, insertIndex);
      setSchema(updated);
      setSelectedComponentId(prepared.id);
      return { ok: true, node: prepared };
    },
    [schema, setSchema]
  );

  const insertNodesAtSlot = useCallback(
    (nodes, slot) => {
      if (!slot?.parentId || !Array.isArray(nodes) || nodes.length === 0) return { ok: false };
      let currentTree = cloneTree(schema);
      let startIndex = Math.max(0, slot.afterIndex >= 0 ? slot.afterIndex + 1 : 0);

      nodes.forEach((node, idx) => {
        const prepared = ensureStableIds(cloneTree(node));
        currentTree = insertNodeAtIndex(currentTree, slot.parentId, prepared, startIndex + idx);
      });

      setSchema(currentTree);
      return { ok: true };
    },
    [schema, setSchema]
  );

  const deleteComponent = useCallback(
    (id) => {
      if (!id || id === schema.id) return;
      const updated = removeNode(schema, id);
      setSchema(updated);
      if (selectedComponentId === id) {
        setSelectedComponentId(null);
      }
    },
    [schema, selectedComponentId, setSchema]
  );

  const duplicateComponentInstance = useCallback(
    (id) => {
      if (!id) return;
      const updated = duplicateNode(schema, id);
      setSchema(updated);
    },
    [schema, setSchema]
  );

  const moveComponent = useCallback(
    (id, direction, options = {}) => {
      if (!id) return;
      const updated = moveNode(schema, id, direction, {
        device: options.device || activeDevice,
        step: options.step || 5,
        ...options,
      });
      setSchema(updated);
    },
    [schema, setSchema, activeDevice]
  );

  const applyWidthPreset = useCallback(
    (id, preset) => {
      if (!id) return;
      updateComponent(id, (node) => {
        const currentDevice = activeDevice;
        const oldPlacement = node.placement?.[currentDevice] || {
          colStart: 1,
          colEnd: 101,
          rowStart: 1,
          rowEnd: 10,
        };
        let newColStart = 1;
        let newColEnd = 101;

        if (preset === "full") {
          newColStart = 1;
          newColEnd = 101;
        } else if (preset === "half-left") {
          newColStart = 1;
          newColEnd = 51;
        } else if (preset === "half-right") {
          newColStart = 51;
          newColEnd = 101;
        } else if (preset === "third-left") {
          newColStart = 1;
          newColEnd = 34;
        } else if (preset === "third-mid") {
          newColStart = 34;
          newColEnd = 68;
        } else if (preset === "third-right") {
          newColStart = 68;
          newColEnd = 101;
        }

        return {
          ...node,
          placement: {
            ...node.placement,
            [currentDevice]: {
              ...oldPlacement,
              colStart: newColStart,
              colEnd: newColEnd,
            },
          },
        };
      });
    },
    [activeDevice, updateComponent]
  );

  const wrapInContainer = useCallback(
    (id, containerType = "Box") => {
      if (!id) return;
      const targetNode = findNodeById(schema, id);
      if (!targetNode) return;

      const container = createComponent(containerType, {
        containerStyle: {
          padding: "16px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        },
        children: [cloneTree(targetNode)],
      });

      const updated = updateNode(schema, id, () => container);
      setSchema(updated);
      setSelectedComponentId(container.id);
    },
    [schema, setSchema]
  );

  const resizePlacement = useCallback(
    (id, { deltaCol = 0, deltaRow = 0, activeDevice = "desktop" }) => {
      if (!id) return;
      updateComponent(id, (node) => {
        const current = node.placement?.[activeDevice] || {
          colStart: 1,
          colEnd: 101,
          rowStart: 1,
          rowEnd: 10,
        };
        const newColEnd = Math.max(
          current.colStart + 5,
          Math.min(101, (current.colEnd || 101) + deltaCol)
        );
        const newRowEnd = Math.max(
          current.rowStart + 1,
          (current.rowEnd || current.rowStart + 5) + deltaRow
        );

        return {
          ...node,
          placement: {
            ...node.placement,
            [activeDevice]: {
              ...current,
              colEnd: newColEnd,
              rowEnd: newRowEnd,
            },
          },
        };
      });
    },
    [updateComponent]
  );

  // Standalone Component Editor Mode
  const openComponentEditor = useCallback(
    (compType) => {
      setEditingContext(compType);
      const sampleComponent = createComponent(compType);
      const standaloneSchema = ensureStableIds({
        id: `editor_root_${compType}`,
        type: "Home",
        containerStyle: {
          backgroundColor: "#ffffff",
          minHeight: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "16px",
          boxSizing: "border-box",
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

  const exitComponentEditor = useCallback(() => {
    setEditingContext(null);
    if (activePage?.schema) {
      resetHistory(ensureStableIds(cloneTree(activePage.schema)));
    }
  }, [activePage, resetHistory]);

  // Save current working state to Express Backend API
  const saveCurrentPage = useCallback(async () => {
    if (!activePage) return;
    setSaveStatus("saving");

    try {
      if (editingContext) {
        // Component studio save feedback
        setTimeout(() => {
          setIsDirty(false);
          setSaveStatus("saved");
          setTimeout(() => setSaveStatus("idle"), 2500);
        }, 300);
        return;
      }

      if (activeBranchName !== "main") {
        // Persist to branch snapshot via API
        await dispatch(
          saveBranchSnapshot({
            branchId: activeBranchId,
            pageId: activePage.id,
            schema: cloneTree(schema),
          })
        ).unwrap();
      } else {
        // Persist to main page schema via API
        await dispatch(
          savePage({
            id: activePage.id,
            pageData: {
              ...activePage,
              schema: cloneTree(schema),
            },
          })
        ).unwrap();
      }

      setIsDirty(false);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch (e) {
      console.error("[useCmsState] Failed to save page via API:", e);
      setSaveStatus("error");
    }
  }, [activePage, activeBranchName, activeBranchId, editingContext, schema, dispatch]);

  // Branch switcher
  const switchBranch = useCallback(
    (branchName) => {
      dispatch(setActiveBranch(branchName));
    },
    [dispatch]
  );

  // Page switcher
  const switchPage = useCallback(
    (pageId) => {
      dispatch(setActivePageId(pageId));
      setSelectedComponentId(null);
    },
    [dispatch]
  );

  // Applies a reusable interface blueprint's schema to the current canvas
  const applyInterface = useCallback(
    (interfaceId, interfaceSchema) => {
      if (interfaceSchema) {
        applyJsonSchema(interfaceSchema);
      }
      setActiveInterfaceId(interfaceId);
    },
    [applyJsonSchema]
  );

  // Journey switcher
  const switchJourney = useCallback(
    (journeyOrId) => {
      const id = typeof journeyOrId === "string" ? journeyOrId : journeyOrId?.id;
      if (id) dispatch(setActiveJourneyId(id));
    },
    [dispatch]
  );

  // Page management (create / duplicate / rename / delete) via the real API
  const createPageInstance = useCallback(
    async (pageData) => {
      const result = await dispatch(createPage(pageData)).unwrap();
      setSelectedComponentId(null);
      return result;
    },
    [dispatch]
  );

  const duplicatePageInstance = useCallback(
    async (page) => {
      const result = await dispatch(
        createPage({
          name: `${page.name} (Copy)`,
          route: `${page.route || "page"}-copy-${Date.now()}`,
          interfaceId: page.interfaceId,
          schema: ensureStableIds(cloneTree(page.schema)),
        })
      ).unwrap();
      return result;
    },
    [dispatch]
  );

  const renamePageInstance = useCallback(
    async (page, newName) => {
      const result = await dispatch(
        savePage({ id: page.id, pageData: { ...page, name: newName } })
      ).unwrap();
      return result;
    },
    [dispatch]
  );

  const deletePageInstance = useCallback(
    async (id) => {
      await dispatch(deletePageAction(id)).unwrap();
    },
    [dispatch]
  );

  const selectedNode = selectedComponentId
    ? findNodeById(schema, selectedComponentId)
    : null;

  return {
    // State
    schema,
    activeJourney,
    activePage,
    activeBranch: activeBranchName,
    activeBranchId,
    activeInterfaceId,
    selectedComponentId,
    selectedNode,
    activeDevice,
    isDirty,
    saveStatus,
    editingContext,

    // Lists
    journeys,
    pages,
    branches,
    pullRequests,

    // History
    undo,
    redo,
    canUndo,
    canRedo,
    resetHistory,

    // Actions
    setSchema,
    selectComponent,
    clearSelection,
    updateComponent,
    addComponent,
    addComponentAtSlot,
    moveComponentToSlot,
    insertBlockAtSlot,
    insertNodesAtSlot,
    deleteComponent,
    duplicateComponent: duplicateComponentInstance,
    moveComponent,
    applyWidthPreset,
    wrapInContainer,
    resizePlacement,
    saveCurrentPage,
    switchBranch,
    switchPage,
    switchJourney,
    applyInterface,
    createPageInstance,
    duplicatePageInstance,
    renamePageInstance,
    deletePageInstance,
    setActiveDevice,
    openComponentEditor,
    exitComponentEditor,
    applyJsonSchema,
  };
}

export default useCmsState;
