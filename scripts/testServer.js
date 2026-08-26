import app from "../server/index.js";
import http from "http";

async function testApi() {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(4005, resolve));
  console.log("Test server listening on port 4005");

  const baseUrl = "http://localhost:4005/api";

  // Test journeys
  const jRes = await fetch(`${baseUrl}/journeys`);
  const jData = await jRes.json();
  console.log("GET /api/journeys status:", jRes.status, "count:", jData.data?.length);

  // Test pages
  const pRes = await fetch(`${baseUrl}/pages`);
  const pData = await pRes.json();
  console.log("GET /api/pages status:", pRes.status, "count:", pData.data?.length);

  // Test branches
  const bRes = await fetch(`${baseUrl}/branches`);
  const bData = await bRes.json();
  console.log("GET /api/branches status:", bRes.status, "count:", bData.data?.length);

  // Test themes
  const tRes = await fetch(`${baseUrl}/themes`);
  const tData = await tRes.json();
  console.log("GET /api/themes status:", tRes.status, "count:", tData.data?.length);

  server.close();
  console.log("✅ All Phase 1 server endpoints validated successfully!");
}

testApi().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
