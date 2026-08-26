import app from "../server/index.js";
import http from "http";
import fs from "fs/promises";
import path from "path";

async function runEndToEndVerification() {
  console.log("🚀 Starting End-to-End Express + Redux + Local JSON Architecture Verification...\n");

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(4006, resolve));
  const baseUrl = "http://localhost:4006/api";

  try {
    // 1. Test GET /api/pages
    console.log("1️⃣ Testing GET /api/pages...");
    const pagesRes = await fetch(`${baseUrl}/pages`);
    const pagesData = await pagesRes.json();
    if (!pagesData.success || !Array.isArray(pagesData.data)) {
      throw new Error("GET /api/pages failed");
    }
    const homePage = pagesData.data.find((p) => p.id === "page_home");
    console.log(`   ✓ Found ${pagesData.data.length} pages. Main home page: "${homePage.name}"`);

    // 2. Test Branch Creation: POST /api/branches
    console.log("\n2️⃣ Testing Branch Creation (POST /api/branches)...");
    const branchRes = await fetch(`${baseUrl}/branches`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        journeyId: "journey-campus-commerce",
        sourceBranchId: "main",
        name: "test-redesign-branch",
        description: "Test feature branch for SDUI layout changes",
      }),
    });
    const branchData = await branchRes.json();
    if (!branchData.success || !branchData.data.id) {
      throw new Error(`Branch creation failed: ${JSON.stringify(branchData)}`);
    }
    const createdBranch = branchData.data;
    console.log(`   ✓ Created branch "${createdBranch.name}" (ID: ${createdBranch.id})`);

    // 3. Test Branch Editing: PUT /api/branches/:id/snapshots/:pageId
    console.log("\n3️⃣ Testing Branch Snapshot Save (Main MUST remain unchanged)...");
    const modifiedSchema = JSON.parse(JSON.stringify(homePage.schema));
    modifiedSchema.containerStyle = { ...modifiedSchema.containerStyle, testTag: "MERGE_VERIFICATION_TEST" };

    const saveBranchRes = await fetch(`${baseUrl}/branches/${createdBranch.id}/snapshots/page_home`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ schema: modifiedSchema }),
    });
    const saveBranchData = await saveBranchRes.json();
    if (!saveBranchData.success) {
      throw new Error("Saving branch snapshot failed");
    }
    console.log("   ✓ Saved modified schema into branch snapshot");

    // Verify Mainline in pages.json is UNCHANGED
    const verifyMainRes = await fetch(`${baseUrl}/pages/page_home`);
    const verifyMainData = await verifyMainRes.json();
    if (verifyMainData.data.schema.containerStyle?.testTag === "MERGE_VERIFICATION_TEST") {
      throw new Error("❌ FAILURE: Mainline was mutated before PR merge!");
    }
    console.log("   ✓ Verified main pages.json remains untouched");

    // 4. Test Pull Request Creation: POST /api/pull-requests
    console.log("\n4️⃣ Testing Pull Request Creation (POST /api/pull-requests)...");
    const prRes = await fetch(`${baseUrl}/pull-requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        journeyId: "journey-campus-commerce",
        sourceBranchId: createdBranch.id,
        targetBranchId: "main",
        title: "Merge test redesign branch",
        description: "Adding testTag styling changes to home page",
      }),
    });
    const prData = await prRes.json();
    if (!prData.success || !prData.data.id) {
      throw new Error(`PR creation failed: ${JSON.stringify(prData)}`);
    }
    const createdPr = prData.data;
    console.log(`   ✓ Created PR "${createdPr.title}" with ${createdPr.changes.length} detected changes`);

    // 5. Test PR Approval: PATCH /api/pull-requests/:id/approve
    console.log("\n5️⃣ Testing PR Approval (PATCH /api/pull-requests/:id/approve)...");
    const approveRes = await fetch(`${baseUrl}/pull-requests/${createdPr.id}/approve`, {
      method: "PATCH",
    });
    const approveData = await approveRes.json();
    if (!approveData.success || !approveData.data.isApproved) {
      throw new Error("PR approval failed");
    }
    console.log("   ✓ PR marked as approved");

    // 6. Test PR Merge: PATCH /api/pull-requests/:id/merge
    console.log("\n6️⃣ Testing PR Merge / Push (PATCH /api/pull-requests/:id/merge)...");
    const mergeRes = await fetch(`${baseUrl}/pull-requests/${createdPr.id}/merge`, {
      method: "PATCH",
    });
    const mergeData = await mergeRes.json();
    if (!mergeData.success || mergeData.data.pullRequest.status !== "merged") {
      throw new Error(`PR merge failed: ${JSON.stringify(mergeData)}`);
    }
    console.log("   ✓ PR successfully merged");

    // 7. Verify Mainline JSON on Disk was Updated!
    console.log("\n7️⃣ Verifying Mainline pages.json on Disk...");
    const pagesFile = await fs.readFile(path.resolve("./server/data/pages.json"), "utf-8");
    const parsedPages = JSON.parse(pagesFile);
    const updatedHome = parsedPages.find((p) => p.id === "page_home");

    if (updatedHome.schema.containerStyle?.testTag !== "MERGE_VERIFICATION_TEST") {
      throw new Error("❌ FAILURE: Merged changes did not write to pages.json on disk!");
    }
    console.log("   ✓ pages.json on disk contains the merged changes!");

    // Clean up test branch & test tag
    delete updatedHome.schema.containerStyle.testTag;
    await fs.writeFile(path.resolve("./server/data/pages.json"), JSON.stringify(parsedPages, null, 2), "utf-8");
    await fetch(`${baseUrl}/branches/${createdBranch.id}`, { method: "DELETE" });

    console.log("\n=======================================================");
    console.log("🎉 ALL ARCHITECTURAL TESTS PASSED SUCCESSFULLY! 🎉");
    console.log("=======================================================\n");
  } finally {
    server.close();
  }
}

runEndToEndVerification().catch((err) => {
  console.error("❌ Test run error:", err);
  process.exit(1);
});
