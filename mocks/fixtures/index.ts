/**
 * @file mocks/fixtures/index.ts
 * @description Re-exports all test fixture objects from a single entry point.
 *
 * Import from "@/mocks/fixtures" in test files rather than from the specific
 * fixture module to keep imports stable as the fixture set grows.
 */
// Single fixture entry point used by automated tests. Production code never imports this module.
export * from "./api.fixtures";
