import unlockHandler from "../api/admin/unlock.ts";
import sessionHandler from "../api/admin/session.ts";
import logoutHandler from "../api/admin/logout.ts";
import { EventEmitter } from "events";

function createMockReq(method: string, url: string, headers: Record<string, string> = {}, body?: any) {
  const req: any = new EventEmitter();
  req.method = method;
  req.url = url;
  req.headers = { ...headers };
  req.body = body;
  req.socket = { remoteAddress: "127.0.0.1" };
  return req;
}

function createMockRes() {
  const res: any = {
    statusCode: 200,
    headers: {} as Record<string, string>,
    body: "",
    setHeader(key: string, val: string) {
      this.headers[key.toLowerCase()] = val;
    },
    getHeader(key: string) {
      return this.headers[key.toLowerCase()];
    },
    end(data?: string) {
      if (data) this.body = data;
    },
  };
  return res;
}

async function testAll() {
  console.log("Testing standalone API serverless functions...");

  // 1. Invalid Unlock
  {
    const req = createMockReq("POST", "/api/admin/unlock", { "content-type": "application/json" }, { passkey: "wrong" });
    const res = createMockRes();
    await unlockHandler(req, res);
    console.log("Unlock (wrong passkey): status =", res.statusCode, "body =", res.body);
    if (res.statusCode !== 401) throw new Error("Expected 401 on wrong passkey");
  }

  // Set passkey for test
  process.env.ADMIN_PASSKEY = "adminwrick@1506";

  // 2. Valid Unlock
  let sessionCookie = "";
  {
    const req = createMockReq("POST", "/api/admin/unlock", { "content-type": "application/json" }, { passkey: "adminwrick@1506" });
    const res = createMockRes();
    await unlockHandler(req, res);
    console.log("Unlock (correct passkey): status =", res.statusCode, "body =", res.body);
    if (res.statusCode !== 200) throw new Error("Expected 200 on correct passkey");
    sessionCookie = res.headers["set-cookie"];
    console.log("Set-Cookie header:", sessionCookie);
    if (!sessionCookie || !sessionCookie.includes("vault_session=")) throw new Error("Expected vault_session in cookie");
  }

  // 3. Session Check (Unauthenticated)
  {
    const req = createMockReq("GET", "/api/admin/session", {});
    const res = createMockRes();
    await sessionHandler(req, res);
    console.log("Session (no cookie): status =", res.statusCode, "body =", res.body);
    const parsed = JSON.parse(res.body);
    if (parsed.authenticated !== false) throw new Error("Expected authenticated: false");
  }

  // 4. Session Check (Authenticated)
  {
    const cookieVal = sessionCookie.split(";")[0];
    const req = createMockReq("GET", "/api/admin/session", { cookie: cookieVal });
    const res = createMockRes();
    await sessionHandler(req, res);
    console.log("Session (with cookie): status =", res.statusCode, "body =", res.body);
    const parsed = JSON.parse(res.body);
    if (parsed.authenticated !== true) throw new Error("Expected authenticated: true");
  }

  // 5. Logout
  {
    const req = createMockReq("POST", "/api/admin/logout", {});
    const res = createMockRes();
    await logoutHandler(req, res);
    console.log("Logout: status =", res.statusCode, "body =", res.body);
    if (res.statusCode !== 200) throw new Error("Expected 200 on logout");
    const clearCookie = res.headers["set-cookie"];
    console.log("Clear-Cookie header:", clearCookie);
    if (!clearCookie || !clearCookie.includes("Max-Age=0")) throw new Error("Expected Max-Age=0 in clear cookie");
  }

  console.log("\n✅ ALL STANDALONE SERVERLESS HANDLERS PASSED ZERO-DEPENDENCY VERIFICATION!");
}

testAll().catch((e) => {
  console.error("Test failed:", e);
  process.exit(1);
});
