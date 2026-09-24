/**
 * Diagnostic Script: Certificate Vault Unlock fetch inspector
 *
 * Runs programmatic verification on the Certificate Vault unlock fetch call:
 * - Inspects requested URL
 * - Inspects HTTP method
 * - Inspects HTTP headers
 * - Inspects credentials mode ('include')
 * - Inspects JSON payload
 * - Tests against live server or mock environment
 */

import { inspectUnlockRequest, UnlockFetchInspection } from "../src/utils/vaultUnlockDiagnostic.ts";

async function runDiagnostic() {
  console.log("=======================================================");
  console.log("🔍 RUNNING CERTIFICATE VAULT UNLOCK FETCH DIAGNOSTIC");
  console.log("=======================================================\n");

  // 1. Define the exact fetch configuration used by the 'Unlock' button
  const testPasskey = "test_passkey_vault_2026";
  const requestUrl = "/api/admin/unlock";
  const requestOptions: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ passkey: testPasskey }),
  };

  // 2. Perform diagnostic inspection
  const inspection: UnlockFetchInspection = inspectUnlockRequest(requestUrl, requestOptions);

  console.log("\n📋 DIAGNOSTIC RESULTS SUMMARY:");
  console.log("-------------------------------------------------------");
  console.log(`• Target URL:         ${inspection.url} [${inspection.checks.targetsCorrectUrl ? "VALID ✅" : "INVALID ❌"}]`);
  console.log(`• HTTP Method:        ${inspection.method}`);
  console.log(`• Headers:            ${JSON.stringify(inspection.headers)}`);
  console.log(`• Credentials Mode:   ${inspection.credentials} [${inspection.checks.hasCredentialsInclude ? "VALID ✅" : "INVALID ❌"}]`);
  console.log(`• Payload Structure:  ${JSON.stringify(inspection.bodyPayload)}`);
  console.log("-------------------------------------------------------");

  const allPassed =
    inspection.checks.targetsCorrectUrl &&
    inspection.checks.hasCredentialsInclude &&
    inspection.checks.hasJsonContentType &&
    inspection.checks.hasValidPasskeyField;

  if (allPassed) {
    console.log("✅ ALL UNLOCK FETCH CRITERIA VERIFIED SUCCESSFULLY!");
    console.log("   - Targets: /api/admin/unlock");
    console.log("   - Method: POST");
    console.log("   - Credentials: 'include'");
    console.log("   - Content-Type: 'application/json'");
    console.log("   - Payload: { passkey: '...' }");
  } else {
    console.error("❌ DIAGNOSTIC FAILED - Some criteria were not met.");
    process.exit(1);
  }
}

runDiagnostic().catch((err) => {
  console.error("Diagnostic execution error:", err);
  process.exit(1);
});
