import { useQuery } from "@tanstack/react-query";
import {
  DollarSign,
  Activity,
  CheckCircle,
  FolderKanban,
  ArrowUpRight,
} from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { format, parseISO } from "date-fns";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api-client";
import { Project } from "@shared/types";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
const fetchProjects = async (): Promise<Project[]> => {
  return api<Project[]>("/api/projects");
};
const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  description: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);
export function HomePage() {
  const {
    data: projects,
    isLoading,
    error,
  } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });
  const stats = {
    totalBudget:
      projects?.reduce((acc, project) => acc + project.budget, 0) ?? 0,
    activeProjects:
      projects?.filter((p) => p.status === "Active").length ?? 0,
    completedProjects:
      projects?.filter((p) => p.status === "Completed").length ?? 0,
    totalProjects: projects?.length ?? 0,
  };
  const chartData = [
    { name: "Active", count: stats.activeProjects, fill: "hsl(var(--primary))" },
    { name: "Completed", count: stats.completedProjects, fill: "hsl(var(--chart-2))" },
    { name: "On Hold", count: projects?.filter(p => p.status === 'On Hold').length ?? 0, fill: "hsl(var(--muted-foreground))" },
  ];
  const recentProjects = projects
    ?.slice()
    .sort((a, b) => parseISO(b.dueDate).getTime() - parseISO(a.dueDate).getTime())
    .slice(0, 5);
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Dashboard
              </h1>
            </div>
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))
              ) : (
                <>
                  <StatCard
                    title="Total Budget"
                    value={new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(stats.totalBudget)}
                    icon={DollarSign}
                    description="Sum of all project budgets"
                  />
                  <StatCard
                    title="Active Projects"
                    value={`+${stats.activeProjects}`}
                    icon={Activity}
                    description="Projects currently in progress"
                  />
                  <StatCard
                    title="Completed Projects"
                    value={`+${stats.completedProjects}`}
                    icon={CheckCircle}
                    description="Projects successfully finished"
                  />
                  <StatCard
                    title="Total Projects"
                    value={stats.totalProjects.toString()}
                    icon={FolderKanban}
                    description="Total number of projects"
                  />
                </>
              )}
            </div>
            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
              <Card className="xl:col-span-2">
                <CardHeader>
                  <CardTitle>Projects Overview</CardTitle>
                  <CardDescription>
                    A summary of projects by status.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  {isLoading ? (
                    <Skeleton className="h-[350px] w-full" />
                  ) : (
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={chartData}>
                        <XAxis
                          dataKey="name"
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip
                          cursor={{ fill: "hsl(var(--muted))" }}
                          contentStyle={{
                            backgroundColor: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                          }}
                        />
                        <Legend />
                        <Bar
                          dataKey="count"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center">
                  <div className="grid gap-2">
                    <CardTitle>Recent Projects</CardTitle>
                    <CardDescription>
                      The latest projects that have been updated.
                    </CardDescription>
                  </div>
                  <Button asChild size="sm" className="ml-auto gap-1">
                    <Link to="/projects">
                      View All
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full" />
                      ))}
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead className="text-right">Due Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentProjects?.map((project) => (
                          <TableRow key={project.id}>
                            <TableCell>
                              <div className="font-medium">{project.name}</div>
                              <div className="text-sm text-muted-foreground">
                                <Badge
                                  variant={
                                    project.priority === "High"
                                      ? "destructive"
                                      : project.priority === "Medium"
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {project.priority}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              {format(parseISO(project.dueDate), "MMM d, yyyy")}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </AppLayout>
  );
}