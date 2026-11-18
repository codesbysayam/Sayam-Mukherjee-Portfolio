import { initializeApp, getApps, getApp } from "firebase-admin/app";
import { getAuth, DecodedIdToken } from "firebase-admin/auth";
import firebaseConfig from "../../firebase-applet-config.json" with { type: "json" };

const adminApp =
  getApps().length > 0
    ? getApp()
    : initializeApp({ projectId: firebaseConfig.projectId });

const adminAuth = getAuth(adminApp);

export type VerifiedTokenClaims = {
  uid: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
};

type TokenVerifier = (idToken: string) => Promise<VerifiedTokenClaims>;

const defaultVerifier: TokenVerifier = async (idToken: string) => {
  const decoded: DecodedIdToken = await adminAuth.verifyIdToken(idToken);
  return {
    uid: decoded.uid,
    email: decoded.email,
    email_verified: decoded.email_verified,
    name: decoded.name,
  };
};

let activeVerifier: TokenVerifier = defaultVerifier;

export function setTokenVerifierForTesting(verifier: TokenVerifier | null): void {
  if (process.env.NODE_ENV !== "test" && !process.env.VITEST) {
    throw new Error("Token verifier override is restricted to test environments.");
  }
  activeVerifier = verifier ?? defaultVerifier;
}

export async function verifyFirebaseToken(
  idToken: string
): Promise<VerifiedTokenClaims> {
  return activeVerifier(idToken);
}
