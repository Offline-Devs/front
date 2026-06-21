// Majors and subjects are backend-managed reference data. Forms consume these contracts instead of duplicating academic configuration in the UI.
export type SubjectConfig = { major: string; subjects: string[] };
