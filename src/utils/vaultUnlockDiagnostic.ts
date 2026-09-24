/**
 * Diagnostic script to inspect the `fetch` call in the Certificate Vault's 'Unlock' button.
 * Logs the request URL, headers, and payload to the console to ensure it targets
 * `/api/admin/unlock` and includes `credentials: 'include'`.
 */

export interface UnlockFetchInspection {
  url: string;
  method: string;
  headers: Record<string, string>;
  credentials?: RequestCredentials;
  bodyPayload: any;
  timestamp: string;
  checks: {
    targetsCorrectUrl: boolean;
    hasCredentialsInclude: boolean;
    hasJsonContentType: boolean;
    hasValidPasskeyField: boolean;
  };
}

export function inspectUnlockRequest(
  url: string,
  options: RequestInit
): UnlockFetchInspection {
  const method = options.method || "GET";
  const headers = (options.headers as Record<string, string>) || {};
  let bodyPayload: any = null;

  try {
    if (typeof options.body === "string") {
      bodyPayload = JSON.parse(options.body);
    } else {
      bodyPayload = options.body;
    }
  } catch {
    bodyPayload = options.body;
  }

  const checks = {
    targetsCorrectUrl: url === "/api/admin/unlock",
    hasCredentialsInclude: options.credentials === "include",
    hasJsonContentType:
      headers["Content-Type"] === "application/json" ||
      headers["content-type"] === "application/json",
    hasValidPasskeyField: Boolean(
      bodyPayload && typeof bodyPayload.passkey === "string"
    ),
  };

  const inspection: UnlockFetchInspection = {
    url,
    method,
    headers,
    credentials: options.credentials,
    bodyPayload: bodyPayload
      ? {
          ...bodyPayload,
          // Mask passkey characters for privacy while indicating length
          passkey: `*** (${bodyPayload.passkey?.length || 0} chars)`,
        }
      : null,
    timestamp: new Date().toISOString(),
    checks,
  };

  // Structured diagnostic logging to console
  console.groupCollapsed(
    "%c[Certificate Vault Diagnostic] %cUnlock Request Inspection",
    "color: #8b5cf6; font-weight: bold;",
    "color: #10b981; font-weight: normal;"
  );
  console.log("%cRequest URL:%c " + url, "font-weight: bold;", "color: #3b82f6;");
  console.log("%cHTTP Method:%c " + method, "font-weight: bold;", "color: #10b981;");
  console.log("%cRequest Headers:", "font-weight: bold;", headers);
  console.log(
    "%cCredentials Mode:%c " + options.credentials,
    "font-weight: bold;",
    options.credentials === "include" ? "color: #10b981;" : "color: #ef4444;"
  );
  console.log("%cRequest Payload:", "font-weight: bold;", inspection.bodyPayload);

  // Table summary of verification criteria
  if (console.table) {
    console.table([
      {
        Requirement: "Target URL is /api/admin/unlock",
        Status: checks.targetsCorrectUrl ? "✅ PASS" : "❌ FAIL",
        Value: url,
      },
      {
        Requirement: "credentials: 'include'",
        Status: checks.hasCredentialsInclude ? "✅ PASS" : "❌ FAIL",
        Value: String(options.credentials),
      },
      {
        Requirement: "Content-Type: application/json",
        Status: checks.hasJsonContentType ? "✅ PASS" : "❌ FAIL",
        Value: headers["Content-Type"] || headers["content-type"] || "missing",
      },
      {
        Requirement: "Passkey payload exists",
        Status: checks.hasValidPasskeyField ? "✅ PASS" : "❌ FAIL",
        Value: bodyPayload?.passkey ? "Valid string" : "Missing",
      },
    ]);
  }
  console.groupEnd();

  // Attach diagnostic data to window for inspection in browser devtools
  if (typeof window !== "undefined") {
    const w = window as any;
    w.__CERTIFICATE_VAULT_LAST_UNLOCK_REQUEST__ = inspection;
    if (!w.__CERTIFICATE_VAULT_UNLOCK_LOG__) {
      w.__CERTIFICATE_VAULT_UNLOCK_LOG__ = [];
    }
    w.__CERTIFICATE_VAULT_UNLOCK_LOG__.push(inspection);
  }

  return inspection;
}

export function logUnlockResponse(
  status: number,
  ok: boolean,
  data?: any
): void {
  console.groupCollapsed(
    `%c[Certificate Vault Diagnostic] %cUnlock Response (${status} ${ok ? "OK" : "ERROR"})`,
    "color: #8b5cf6; font-weight: bold;",
    ok ? "color: #10b981;" : "color: #ef4444;"
  );
  console.log("Status Code:", status);
  console.log("Response OK:", ok);
  console.log("Response Data:", data);
  console.groupEnd();
}
