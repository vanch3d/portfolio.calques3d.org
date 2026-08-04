import { beforeAll, afterEach, afterAll } from "vitest";
import { server } from "../mocks/server";

// Start MSW node server before all tests.
// Handles mocking of external HTTP calls (e.g. Zotero API).
beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
