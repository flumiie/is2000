import React, { useState, useMemo } from "react";
import { ProjectDataTable } from "@/components/ui/project-data-table";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ListFilter, Columns } from "lucide-react";

// --- MOCK DATA ---
const mockProjects = [
    { id: "proj-01", name: "ShadCN Clone", repository: "https://github.com/ruixenui/ruixen-buttons", team: "UI Guild", tech: "Next.js", createdAt: "2024-06-01", contributors: [{ src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80", alt: "User 1", fallback: "U1" }, { src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80", alt: "User 2", fallback: "U2" }], status: { text: "Active", variant: "active" } },
    { id: "proj-02", name: "RUIXEN Components", repository: "https://github.com/ruixenui/ruixen-buttons", team: "Component Devs", tech: "React", createdAt: "2024-05-22", contributors: [{ src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80", alt: "User 3", fallback: "U3" }, { src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80", alt: "User 4", fallback: "U4" }, { src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80", alt: "User 5", fallback: "U5" }], status: { text: "Progress", variant: "inProgress" } },
    { id: "proj-03", name: "CV Jobs Platform", repository: "https://github.com/ruixenui/ruixen-buttons", team: "CV Core", tech: "Spring Boot", createdAt: "2024-06-05", contributors: [{ src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80", alt: "User 6", fallback: "U6" }], status: { text: "Active", variant: "active" } },
    { id: "proj-04", name: "Ruixen UI Docs", repository: "https://github.com/ruixenui/ruixen-buttons", team: "Tech Writers", tech: "Markdown", createdAt: "2024-04-19", contributors: [{ src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80", alt: "User 7", fallback: "U7" }, { src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80", alt: "User 8", fallback: "U8" }], status: { text: "Active", variant: "active" } },
    { id: "proj-05", name: "Job Portal Analytics", repository: "https://github.com/ruixenui/ruixen-buttons", team: "Data Squad", tech: "Python", createdAt: "2024-03-30", contributors: [{ src: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80", alt: "User 9", fallback: "U9" }], status: { text: "Active", variant: "active" } },
    { id: "proj-06", name: "Ui Ux Design", repository: "https://github.com/ruixenui/ruixen-buttons", team: "Infra", tech: "Socket.io", createdAt: "2024-06-03", contributors: [{ src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80", alt: "User 10", fallback: "U10" }, { src: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80", alt: "User 11", fallback: "U11" }], status: { text: "Active", variant: "active" } },
];

const allColumns = ["name", "repository", "team", "tech", "createdAt", "contributors", "status"];

export const Demo = () => {
  const [techFilter, setTechFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [visibleColumns, setVisibleColumns] = useState(new Set(allColumns));

  const filteredProjects = useMemo(() => {
    return mockProjects.filter((project) => {
      const techMatch = techFilter === "" || project.tech.toLowerCase().includes(techFilter.toLowerCase());
      const statusMatch = statusFilter === "all" || project.status.variant === statusFilter;
      return techMatch && statusMatch;
    });
  }, [techFilter, statusFilter]);

  const toggleColumn = (column) => {
    setVisibleColumns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(column)) {
        newSet.delete(column);
      } else {
        newSet.add(column);
      }
      return newSet;
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center">
        <div className="flex flex-1 gap-4">
          <Input
            placeholder="Filter by technology..."
            value={techFilter}
            onChange={(e) => setTechFilter(e.target.value)}
            className="max-w-xs"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <ListFilter className="h-4 w-4" />
                <span>Status</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked={statusFilter === "all"} onCheckedChange={() => setStatusFilter("all")}>All</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={statusFilter === "active"} onCheckedChange={() => setStatusFilter("active")}>Active</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={statusFilter === "inProgress"} onCheckedChange={() => setStatusFilter("inProgress")}>In Progress</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={statusFilter === "onHold"} onCheckedChange={() => setStatusFilter("onHold")}>On Hold</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Columns className="h-4 w-4" />
              <span>Columns</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {allColumns.map((column) => (
              <DropdownMenuCheckboxItem
                key={column}
                className="capitalize"
                checked={visibleColumns.has(column)}
                onCheckedChange={() => toggleColumn(column)}
              >
                {column}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ProjectDataTable projects={filteredProjects} visibleColumns={visibleColumns} />
    </div>
  );
};

export default Demo;
