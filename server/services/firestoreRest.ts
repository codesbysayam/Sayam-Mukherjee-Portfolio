import { env } from "../config/env.ts";

export interface FirestoreValue {
  nullValue?: null;
  booleanValue?: boolean;
  integerValue?: string;
  doubleValue?: number;
  timestampValue?: string;
  stringValue?: string;
  arrayValue?: { values?: FirestoreValue[] };
  mapValue?: { fields?: Record<string, FirestoreValue> };
}

export interface FirestoreDocument {
  name: string;
  fields?: Record<string, FirestoreValue>;
  createTime?: string;
  updateTime?: string;
}

export function toFirestoreValue(val: unknown): FirestoreValue {
  if (val === null || val === undefined) {
    return { nullValue: null };
  }
  if (typeof val === "boolean") {
    return { booleanValue: val };
  }
  if (typeof val === "number") {
    if (Number.isInteger(val)) {
      return { integerValue: String(val) };
    }
    return { doubleValue: val };
  }
  if (val instanceof Date) {
    return { timestampValue: val.toISOString() };
  }
  if (typeof val === "string") {
    return { stringValue: val };
  }
  if (Array.isArray(val)) {
    return {
      arrayValue: {
        values: val.filter((v) => v !== undefined).map((v) => toFirestoreValue(v)),
      },
    };
  }
  if (typeof val === "object") {
    return {
      mapValue: {
        fields: toFirestoreFields(val as Record<string, unknown>),
      },
    };
  }
  return { stringValue: String(val) };
}

export function toFirestoreFields(
  obj: Record<string, unknown>
): Record<string, FirestoreValue> {
  const fields: Record<string, FirestoreValue> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val === undefined) continue;
    fields[key] = toFirestoreValue(val);
  }
  return fields;
}

export function fromFirestoreValue(val: FirestoreValue): unknown {
  if ("nullValue" in val) return null;
  if ("booleanValue" in val) return Boolean(val.booleanValue);
  if ("integerValue" in val) return Number(val.integerValue);
  if ("doubleValue" in val) return Number(val.doubleValue);
  if ("timestampValue" in val) return val.timestampValue;
  if ("stringValue" in val) return val.stringValue;
  if ("arrayValue" in val) {
    return (val.arrayValue?.values || []).map((v) => fromFirestoreValue(v));
  }
  if ("mapValue" in val) {
    return fromFirestoreFields(val.mapValue?.fields || {});
  }
  return null;
}

export function fromFirestoreFields(
  fields: Record<string, FirestoreValue>
): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, val] of Object.entries(fields)) {
    result[key] = fromFirestoreValue(val);
  }
  return result;
}

function getBaseDocumentsUrl(): string {
  const { projectId, firestoreDatabaseId } = env.firebase;
  return `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(
    projectId
  )}/databases/${encodeURIComponent(firestoreDatabaseId)}/documents`;
}

function getDocumentResourcePath(collection: string, docId: string): string {
  const { projectId, firestoreDatabaseId } = env.firebase;
  return `projects/${projectId}/databases/${firestoreDatabaseId}/documents/${collection}/${docId}`;
}

function buildAuth(url: string, bearerToken?: string): {
  targetUrl: string;
  headers: Record<string, string>;
} {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (bearerToken) {
    headers["Authorization"] = `Bearer ${bearerToken}`;
    return { targetUrl: url, headers };
  }
  const sep = url.includes("?") ? "&" : "?";
  return {
    targetUrl: `${url}${sep}key=${encodeURIComponent(env.firebase.apiKey)}`,
    headers,
  };
}

// In-memory store strictly for Vitest unit/integration tests without hitting live Firestore
const memoryStore = new Map<string, Map<string, Record<string, any>>>();

export function resetInMemoryStoreForTests(): void {
  if (!env.isTest) return;
  memoryStore.clear();
}

function getTestCollection(collection: string): Map<string, Record<string, any>> {
  let map = memoryStore.get(collection);
  if (!map) {
    map = new Map<string, Record<string, any>>();
    memoryStore.set(collection, map);
  }
  return map;
}

export async function getFirestoreDoc<T = Record<string, any>>(
  collection: string,
  docId: string,
  bearerToken?: string
): Promise<T | null> {
  if (env.isTest) {
    const doc = getTestCollection(collection).get(docId);
    return doc ? (structuredClone(doc) as T) : null;
  }

  const { targetUrl, headers } = buildAuth(
    `${getBaseDocumentsUrl()}/${encodeURIComponent(collection)}/${encodeURIComponent(
      docId
    )}`,
    bearerToken
  );

  const res = await fetch(targetUrl, { method: "GET", headers });
  if (res.status === 404) return null;
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Firestore GET ${collection}/${docId} failed (${res.status}): ${text}`);
  }
  const json = (await res.json()) as FirestoreDocument;
  return fromFirestoreFields(json.fields || {}) as T;
}

export async function createFirestoreDocStrict(
  collection: string,
  docId: string,
  data: Record<string, unknown>,
  options: {
    useServerTimestampCreatedAt?: boolean;
    bearerToken?: string;
  } = {}
): Promise<{ created: boolean; alreadyExists: boolean; createdAtIso: string }> {
  const nowIso = new Date().toISOString();

  if (env.isTest) {
    const col = getTestCollection(collection);
    if (col.has(docId)) {
      return { created: false, alreadyExists: true, createdAtIso: nowIso };
    }
    const payload = structuredClone(data) as Record<string, any>;
    if (options.useServerTimestampCreatedAt && !payload.createdAt) {
      payload.createdAt = nowIso;
    }
    col.set(docId, payload);
    return { created: true, alreadyExists: false, createdAtIso: nowIso };
  }

  const { targetUrl, headers } = buildAuth(
    `${getBaseDocumentsUrl()}:commit`,
    options.bearerToken
  );

  const writePayload: Record<string, unknown> = {
    update: {
      name: getDocumentResourcePath(collection, docId),
      fields: toFirestoreFields(data),
    },
    currentDocument: { exists: false },
  };

  if (options.useServerTimestampCreatedAt) {
    writePayload.updateTransforms = [
      { fieldPath: "createdAt", setToServerValue: "REQUEST_TIME" },
    ];
  }

  const res = await fetch(targetUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({ writes: [writePayload] }),
  });

  if (res.status === 409) {
    return { created: false, alreadyExists: true, createdAtIso: nowIso };
  }

  const text = await res.text();
  if (!res.ok) {
    if (text.includes("ALREADY_EXISTS") || text.includes("already exists")) {
      return { created: false, alreadyExists: true, createdAtIso: nowIso };
    }
    throw new Error(`Firestore CREATE ${collection}/${docId} failed (${res.status}): ${text}`);
  }

  return { created: true, alreadyExists: false, createdAtIso: nowIso };
}

export async function upsertFirestoreDoc(
  collection: string,
  docId: string,
  data: Record<string, unknown>,
  bearerToken: string
): Promise<void> {
  if (env.isTest) {
    getTestCollection(collection).set(docId, structuredClone(data) as Record<string, any>);
    return;
  }

  const { targetUrl, headers } = buildAuth(
    `${getBaseDocumentsUrl()}:commit`,
    bearerToken
  );

  const res = await fetch(targetUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({
      writes: [
        {
          update: {
            name: getDocumentResourcePath(collection, docId),
            fields: toFirestoreFields(data),
          },
        },
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Firestore UPSERT ${collection}/${docId} failed (${res.status}): ${text}`);
  }
}

export async function patchFirestoreDoc(
  collection: string,
  docId: string,
  updates: Record<string, unknown>,
  bearerToken: string
): Promise<void> {
  if (env.isTest) {
    const col = getTestCollection(collection);
    const existing = col.get(docId);
    if (!existing) {
      throw new Error(`Document ${collection}/${docId} not found`);
    }
    col.set(docId, { ...existing, ...structuredClone(updates) });
    return;
  }

  const fieldPaths = Object.keys(updates).filter((k) => updates[k] !== undefined);
  if (fieldPaths.length === 0) return;

  const maskParams = fieldPaths
    .map((fp) => `updateMask.fieldPaths=${encodeURIComponent(fp)}`)
    .join("&");

  const { targetUrl, headers } = buildAuth(
    `${getBaseDocumentsUrl()}/${encodeURIComponent(collection)}/${encodeURIComponent(
      docId
    )}?${maskParams}`,
    bearerToken
  );

  const res = await fetch(targetUrl, {
    method: "PATCH",
    headers,
    body: JSON.stringify({
      fields: toFirestoreFields(updates),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Firestore PATCH ${collection}/${docId} failed (${res.status}): ${text}`);
  }
}

export async function deleteFirestoreDoc(
  collection: string,
  docId: string,
  bearerToken: string
): Promise<boolean> {
  if (env.isTest) {
    return getTestCollection(collection).delete(docId);
  }

  const { targetUrl, headers } = buildAuth(
    `${getBaseDocumentsUrl()}/${encodeURIComponent(collection)}/${encodeURIComponent(
      docId
    )}`,
    bearerToken
  );

  const res = await fetch(targetUrl, { method: "DELETE", headers });
  if (res.status === 404) return false;
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Firestore DELETE ${collection}/${docId} failed (${res.status}): ${text}`);
  }
  return true;
}

export async function queryFirestoreCollection<T = Record<string, any>>(
  collection: string,
  options: {
    whereEquals?: { field: string; value: string | boolean | number };
    limit?: number;
    bearerToken?: string;
  } = {}
): Promise<T[]> {
  if (env.isTest) {
    const docs = Array.from(getTestCollection(collection).values());
    const filtered = options.whereEquals
      ? docs.filter((d) => d[options.whereEquals!.field] === options.whereEquals!.value)
      : docs;
    return filtered
      .slice(0, options.limit ?? filtered.length)
      .map((d) => structuredClone(d) as T);
  }

  const structuredQuery: Record<string, unknown> = {
    from: [{ collectionId: collection }],
  };

  if (options.whereEquals) {
    structuredQuery.where = {
      fieldFilter: {
        field: { fieldPath: options.whereEquals.field },
        op: "EQUAL",
        value: toFirestoreValue(options.whereEquals.value),
      },
    };
  }

  if (options.limit) {
    structuredQuery.limit = options.limit;
  }

  const { targetUrl, headers } = buildAuth(
    `${getBaseDocumentsUrl()}:runQuery`,
    options.bearerToken
  );

  const res = await fetch(targetUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({ structuredQuery }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Firestore QUERY ${collection} failed (${res.status}): ${text}`);
  }

  const rows = (await res.json()) as Array<{ document?: FirestoreDocument }>;
  const docs: T[] = [];
  for (const row of rows) {
    if (row.document?.fields) {
      docs.push(fromFirestoreFields(row.document.fields) as T);
    }
  }
  return docs;
}
