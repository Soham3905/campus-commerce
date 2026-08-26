# CampusCommerce SDUI CMS — Layered Application Architecture

## 1. System Overview

CampusCommerce SDUI CMS is designed with a strict, decoupled full-stack architecture that separates **client-side presentation**, **working state management**, **REST API orchestration**, **business service rules**, and **local JSON file persistence**.

```text
                 CAMPUSCOMMERCE ARCHITECTURE
                             │
                             ▼
                      React CMS (UI)
                             │
                             ▼
                    Redux Toolkit Store
       (journeys, pages, branches, prs, themes, editor, ui)
                             │
                             ▼
                        API Client
       (client.js, pagesApi, branchesApi, pullRequestsApi)
                             │
                         HTTP REST
                             │
                             ▼
                       Express Server
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
       Routes & Middleware         Validation & Error Handler
              │
              ▼
         Controllers
              │
              ▼
          Services (Business rules, validation, PR diffs)
              │
              ▼
        Repositories (Atomic JSON read/write abstraction)
              │
              ▼
       Local JSON "Database" (server/data/*.json)
```

---

## 2. Core Architectural Roles & Responsibilities

| Layer | Technology | Primary Role | What it DOES NOT do |
| :--- | :--- | :--- | :--- |
| **UI** | React (Vite) | Renders SDUI grid, visual canvas, modals, and inspector. Dispatches user intent. | Does NOT write to disk or execute direct persistence. |
| **Working State** | Redux Toolkit | Holds in-memory working copy, active journey/page/branch, unsaved edits (`isDirty`), undo/redo history. | Is NOT permanent storage or the server source of truth. |
| **API Client** | Fetch wrapper | Encapsulates HTTP methods, base URLs, JSON headers, and error normalization. | Does NOT manage React state or business logic. |
| **API Server** | Express | Validates request payloads, routes HTTP requests, error handling. | Does NOT contain file read/write code directly in routes. |
| **Service Layer** | ES Modules | Encapsulates business logic: merge validation, branch snapshot cloning, structured diffs. | Does NOT handle HTTP req/res objects or write JSON directly. |
| **Repository Layer** | `JsonRepository` | Executes atomic read/write file transactions with temporary-file swap safety. | Does NOT enforce UI or business logic rules. |
| **Persistence Database** | JSON Files (`server/data/`) | Local database acting as the persistent server-side source of truth. | - |

---

## 3. Database Schema & Data Models (`server/data/`)

The local JSON persistence acts as our local database. Records are organized into separate files and connected via foreign keys:

### 1. `journeys.json`
```json
{
  "id": "journey-campus-commerce",
  "name": "Campus Commerce",
  "description": "Main student marketplace journey",
  "icon": "🎓",
  "foundationId": "foundation-default",
  "currentBranchId": "main",
  "pages": ["page_home", "page_product", "page_categories", "page_deals", "page_cart"],
  "createdAt": "2026-08-26T07:00:00.000Z",
  "updatedAt": "2026-08-26T07:00:00.000Z"
}
```

### 2. `pages.json`
```json
{
  "id": "page_home",
  "journeyId": "journey-campus-commerce",
  "name": "Home Storefront",
  "route": "home",
  "interfaceId": "ecommerce-home",
  "schema": {
    "type": "Home",
    "containerStyle": { "backgroundColor": "#F6F6F4" },
    "children": [...]
  },
  "createdAt": "2026-08-26T07:00:00.000Z",
  "updatedAt": "2026-08-26T07:00:00.000Z"
}
```

### 3. `branches.json`
```json
{
  "id": "branch-101",
  "journeyId": "journey-campus-commerce",
  "name": "product-card-redesign",
  "sourceBranchId": "main",
  "description": "Redesigned product card layout",
  "pageSnapshots": {
    "page_home": { ... }
  },
  "status": "active",
  "createdAt": "2026-08-26T07:00:00.000Z",
  "updatedAt": "2026-08-26T07:00:00.000Z"
}
```

### 4. `pullRequests.json`
```json
{
  "id": "pr-201",
  "journeyId": "journey-campus-commerce",
  "sourceBranchId": "branch-101",
  "sourceBranchName": "product-card-redesign",
  "targetBranchId": "main",
  "title": "Merge product card redesign into main",
  "description": "Updated rating & badge styling",
  "changes": [
    {
      "type": "MODIFIED",
      "componentType": "ProductCard",
      "summary": "Modified ProductCard (product_card_01)",
      "details": "Styling updated"
    }
  ],
  "status": "open",
  "createdAt": "2026-08-26T07:00:00.000Z",
  "updatedAt": "2026-08-26T07:00:00.000Z",
  "mergedAt": null
}
```

---

## 4. End-to-End Execution Flows

### A. Load Flow (Initial Page Open)
1. React component mounts.
2. `useCmsState` dispatches `fetchPages()`, `fetchJourneys()`, `fetchBranches()`, `fetchPullRequests()`.
3. `apiClient` sends `GET /api/pages` over HTTP.
4. Express route directs request to `PageController.getAll()`.
5. `PageService` calls `PageRepository.getAll()`.
6. `JsonRepository.read('pages.json')` parses and returns persisted records.
7. Redux stores cached data and sets `activePage`.
8. Visual editor initializes canvas with `activePage.schema`.

### B. Edit Flow (Working State in Redux)
1. User drags a component, alters text, changes placement on canvas.
2. `useCmsState` updates local working schema tree.
3. `isDirty` is flagged `true`, `saveStatus` becomes `"idle"`.
4. User sees instant, responsive visual feedback. **No disk I/O occurs during dragging**.

### C. Save Flow (Persisting to Server)
1. User clicks the **Save** button.
2. `useCmsState` dispatches `savePage({ id, pageData })` or `saveBranchSnapshot(...)`.
3. `apiClient` sends `PUT /api/pages/:id` with schema payload.
4. Express route forwards to `PageController.update()`.
5. `PageService.updatePage()` validates schema contracts and IDs.
6. `PageRepository.update()` invokes `JsonRepository.write('pages.json', updatedList)`.
7. `JsonRepository` writes to a `.tmp` file and atomically renames to `pages.json` preventing file corruption.
8. Express returns `{ success: true, data: savedPage }`.
9. Redux updates cached state, sets `isDirty: false` and `saveStatus: "saved"`.

---

## 5. Branching & Pull Request Lifecycle

```text
                     MAINLINE (main in pages.json)
                                  │
                          Create Branch
                                  │
                                  ▼
                        BRANCH SNAPSHOT
                       (in branches.json)
                                  │
                           Edit in Redux
                                  │
                             Save API
                                  │
                                  ▼
                        BRANCH UPDATED
                     (Main remains untouched)
                                  │
                         Create Pull Request
                                  │
                                  ▼
                         PULL REQUEST RECORD
                       (Calculates Tree Diff)
                                  │
                               Approve
                                  │
                                  ▼
                          MERGE / PUBLISH
               ┌──────────────────┴──────────────────┐
               ▼                                     ▼
        Validate Schemas                     Apply to pages.json
               │                                     │
               ▼                                     ▼
        Mark PR "merged"                    MAIN JSON UPDATED
```

### What "Push / Publish" Means in this System
In this architecture, **Push** or **Merge** means:
> *The validated and approved branch snapshot is written into the mainline `pages.json` database dataset and synchronized with the production schema.*

---

## 6. REST API Reference

| Domain | Method | Path | Description |
| :--- | :--- | :--- | :--- |
| **Journeys** | `GET` | `/api/journeys` | Retrieve all journeys |
| | `GET` | `/api/journeys/:id` | Retrieve single journey |
| | `POST` | `/api/journeys` | Create new journey |
| | `PUT` | `/api/journeys/:id` | Update journey |
| | `DELETE` | `/api/journeys/:id` | Delete journey |
| **Pages** | `GET` | `/api/pages` | List pages (filter by `?journeyId=...`) |
| | `GET` | `/api/pages/:id` | Get page by ID |
| | `POST` | `/api/pages` | Create new page |
| | `PUT` | `/api/pages/:id` | Save & persist page schema |
| | `DELETE` | `/api/pages/:id` | Delete page |
| **Branches** | `GET` | `/api/branches` | List branches |
| | `GET` | `/api/branches/:id` | Get branch by ID |
| | `POST` | `/api/branches` | Create new working branch with initial snapshots |
| | `PUT` | `/api/branches/:id/snapshots/:pageId` | Save branch-scoped snapshot |
| | `DELETE` | `/api/branches/:id` | Delete branch |
| **Pull Requests** | `GET` | `/api/pull-requests` | List pull requests |
| | `GET` | `/api/pull-requests/:id` | Get PR with change diffs |
| | `POST` | `/api/pull-requests` | Create PR with automatic diff calculation |
| | `PATCH` | `/api/pull-requests/:id/approve` | Approve PR |
| | `PATCH` | `/api/pull-requests/:id/reject` | Reject / Close PR |
| | `PATCH` | `/api/pull-requests/:id/merge` | Merge PR changes into main `pages.json` |
| **Themes** | `GET` | `/api/themes` | List all component themes & blueprints |
| | `POST` | `/api/themes` | Create/save custom theme blueprint |
| | `DELETE` | `/api/themes/:id` | Delete custom theme |

---

## 7. Future Database Extensibility

Because domain logic is partitioned behind `Repository` interfaces, this local JSON repository can be replaced with **PostgreSQL**, **MongoDB**, or **Prisma** simply by updating the `Repository` implementations without rewriting any React UI components or Redux slices.
