import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";
import {
  MoreHorizontal,
  PlusCircle,
  ArrowUpDown,
  Trash2,
  Edit,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster, toast } from "@/components/ui/sonner";
import { Project, ProjectPriority, ProjectStatus } from "@shared/types";
import { api } from "@/lib/api-client";
import { ProjectForm } from "@/components/project-form";
const fetchProjects = async (): Promise<Project[]> => {
  return api<Project[]>("/api/projects");
};
const createProject = async (
  newProject: Omit<Project, "id">
): Promise<Project> => {
  return api<Project>("/api/projects", {
    method: "POST",
    body: JSON.stringify(newProject),
  });
};
const updateProject = async (
  updatedProject: Project
): Promise<Project> => {
  return api<Project>(`/api/projects/${updatedProject.id}`, {
    method: "PUT",
    body: JSON.stringify(updatedProject),
  });
};
const deleteProject = async (id: string): Promise<{ id: string }> => {
  return api<{ id: string }>(`/api/projects/${id}`, {
    method: "DELETE",
  });
};
const getStatusBadgeVariant = (status: ProjectStatus) => {
  switch (status) {
    case "Active":
      return "default";
    case "Completed":
      return "secondary";
    case "On Hold":
      return "outline";
    default:
      return "default";
  }
};
const getPriorityBadgeVariant = (priority: ProjectPriority) => {
  switch (priority) {
    case "High":
      return "destructive";
    case "Medium":
      return "default";
    case "Low":
      return "secondary";
    default:
      return "default";
  }
};
export function ProjectsPage() {
  const queryClient = useQueryClient();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>(
    undefined
  );
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(
    null
  );
  const {
    data: projects,
    isLoading,
    error,
  } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });
  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setIsFormOpen(false);
      setEditingProject(undefined);
    },
    onError: (error: Error) => {
      toast.error("An error occurred", { description: error.message });
    },
  };
  const createMutation = useMutation({
    mutationFn: createProject,
    ...mutationOptions,
    onSuccess: (...args) => {
      toast.success("Project created successfully!");
      mutationOptions.onSuccess(...args);
    },
  });
  const updateMutation = useMutation({
    mutationFn: updateProject,
    ...mutationOptions,
    onSuccess: (...args) => {
      toast.success("Project updated successfully!");
      mutationOptions.onSuccess(...args);
    },
  });
  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      toast.success("Project deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setIsAlertOpen(false);
      setDeletingProjectId(null);
    },
    onError: (error: Error) => {
      toast.error("Failed to delete project", { description: error.message });
    },
  });
  const handleFormSubmit = (values: Omit<Project, "id">) => {
    if (editingProject) {
      updateMutation.mutate({ ...values, id: editingProject.id });
    } else {
      createMutation.mutate(values);
    }
  };
  const openDeleteDialog = (id: string) => {
    setDeletingProjectId(id);
    setIsAlertOpen(true);
  };
  const columns: ColumnDef<Project>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("name")}</div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge variant={getStatusBadgeVariant(row.getValue("status"))}>
            {row.getValue("status")}
          </Badge>
        ),
      },
      {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => (
          <Badge variant={getPriorityBadgeVariant(row.getValue("priority"))}>
            {row.getValue("priority")}
          </Badge>
        ),
      },
      {
        accessorKey: "budget",
        header: ({ column }) => (
          <div className="text-right">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Budget
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ),
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue("budget"));
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(amount);
          return <div className="text-right font-mono">{formatted}</div>;
        },
      },
      {
        accessorKey: "dueDate",
        header: "Due Date",
        cell: ({ row }) => (
          <div>{format(parseISO(row.getValue("dueDate")), "MMM d, yyyy")}</div>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const project = row.original;
          return (
            <div className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      setEditingProject(project);
                      setIsFormOpen(true);
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => openDeleteDialog(project.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    []
  );
  const table = useReactTable({
    data: projects ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter,
    },
  });
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Projects Manager
              </h1>
              <p className="text-muted-foreground">
                Manage all your projects in one place.
              </p>
            </div>
            <Button
              onClick={() => {
                setEditingProject(undefined);
                setIsFormOpen(true);
              }}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> New Project
            </Button>
          </div>
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter projects..."
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={columns.length}>
                        <Skeleton className="h-8 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <ProjectForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        defaultValues={editingProject}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingProjectId) {
                  deleteMutation.mutate(deletingProjectId);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Toaster richColors />
    </AppLayout>
  );
}