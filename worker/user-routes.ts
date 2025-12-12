import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import type { Env } from "./core-utils";
import { ProjectEntity } from "./entities";
import { ok, bad, notFound } from "./core-utils";
import { projectStatuses, projectPriorities } from "@shared/types";
const projectSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  status: z.enum(projectStatuses),
  priority: z.enum(projectPriorities),
  budget: z.number().positive("Budget must be a positive number"),
  dueDate: z.string().datetime("Invalid due date format"),
});
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // Ensure seed data is present on first load
  app.use("/api/projects/*", async (c, next) => {
    await ProjectEntity.ensureSeed(c.env);
    await next();
  });
  // GET /api/projects - List all projects
  app.get("/api/projects", async (c) => {
    const page = await ProjectEntity.list(c.env);
    return ok(c, page.items);
  });
  // POST /api/projects - Create a new project
  app.post("/api/projects", zValidator("json", projectSchema), async (c) => {
    const newProjectData = c.req.valid("json");
    const project = await ProjectEntity.create(c.env, {
      id: crypto.randomUUID(),
      ...newProjectData,
    });
    return ok(c, project);
  });
  // GET /api/projects/:id - Get a single project
  app.get("/api/projects/:id", async (c) => {
    const { id } = c.req.param();
    const project = new ProjectEntity(c.env, id);
    if (!(await project.exists())) {
      return notFound(c, "Project not found");
    }
    return ok(c, await project.getState());
  });
  // PUT /api/projects/:id - Update a project
  app.put(
    "/api/projects/:id",
    zValidator("json", projectSchema),
    async (c) => {
      const { id } = c.req.param();
      const updatedData = c.req.valid("json");
      const project = new ProjectEntity(c.env, id);
      if (!(await project.exists())) {
        return notFound(c, "Project not found");
      }
      const updatedProject = await project.mutate((s) => ({ ...s, ...updatedData }));
      return ok(c, updatedProject);
    }
  );
  // DELETE /api/projects/:id - Delete a project
  app.delete("/api/projects/:id", async (c) => {
    const { id } = c.req.param();
    const deleted = await ProjectEntity.delete(c.env, id);
    if (!deleted) {
      return notFound(c, "Project not found");
    }
    return ok(c, { id, deleted: true });
  });
}