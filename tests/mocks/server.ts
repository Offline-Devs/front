/**
 * @file tests/mocks/server.ts
 * @description MSW (Mock Service Worker) server instance for Node.js test environments.
 *
 * Exports a single setupServer() instance shared across all unit and component
 * tests. Individual test files or describe blocks add handlers via mockServer.use()
 * and they are automatically reset after each test by the global setup in
 * tests/setup.ts.
 */
import { setupServer } from "msw/node";
export const mockServer = setupServer();
