import { IndexedEntity } from "./core-utils";
import type { Project } from "@shared/types";
import { MOCK_PROJECTS } from "@shared/mock-data";
export class ProjectEntity extends IndexedEntity<Project> {
  static readonly entityName = "project";
  static readonly indexName = "projects";
  static readonly initialState: Project = {
    id: "",
    name: "",
    status: "On Hold",
    priority: "Low",
    budget: 0,
    dueDate: new Date().toISOString(),
  };
  static seedData = MOCK_PROJECTS;
}