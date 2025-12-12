import { addDays, formatISO } from "date-fns";
import type { Project } from "./types";
const now = new Date();
export const MOCK_PROJECTS: Project[] = [
  {
    id: "proj_1",
    name: "Nexus Dashboard UI Revamp",
    status: "Active",
    priority: "High",
    budget: 120000,
    dueDate: formatISO(addDays(now, 30)),
  },
  {
    id: "proj_2",
    name: "Edge API Gateway Integration",
    status: "Active",
    priority: "High",
    budget: 75000,
    dueDate: formatISO(addDays(now, 60)),
  },
  {
    id: "proj_3",
    name: "Durable Object Storage Layer",
    status: "Completed",
    priority: "Medium",
    budget: 95000,
    dueDate: formatISO(addDays(now, -15)),
  },
  {
    id: "proj_4",
    name: "Q3 Marketing Campaign Assets",
    status: "On Hold",
    priority: "Low",
    budget: 30000,
    dueDate: formatISO(addDays(now, 90)),
  },
  {
    id: "proj_5",
    name: "Internal Tooling CLI",
    status: "Active",
    priority: "Medium",
    budget: 45000,
    dueDate: formatISO(addDays(now, 45)),
  },
  {
    id: "proj_6",
    name: "Customer Onboarding Flow",
    status: "Completed",
    priority: "High",
    budget: 82000,
    dueDate: formatISO(addDays(now, -5)),
  },
  {
    id: "proj_7",
    name: "Security Audit & Compliance",
    status: "Active",
    priority: "High",
    budget: 150000,
    dueDate: formatISO(addDays(now, 120)),
  },
];