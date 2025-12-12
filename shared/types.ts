export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export const projectStatuses = ["On Hold", "Active", "Completed"] as const;
export type ProjectStatus = (typeof projectStatuses)[number];
export const projectPriorities = ["Low", "Medium", "High"] as const;
export type ProjectPriority = (typeof projectPriorities)[number];
export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  budget: number;
  dueDate: string; // ISO 8601 string
}