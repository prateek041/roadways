import ProjectCreationDialog from "@/components/project-creation";
import { getMe } from "@/app/actions/actions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default async function Home() {
  const meResult = await getMe();

  if (!meResult?.success) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-red-500 font-semibold">
          {meResult?.error || "Failed to load user info."}
        </div>
      </div>
    );
  }

  const workspaces = meResult.data?.workspaces || [];
  const projects =
    workspaces.length > 0
      ? workspaces[0].team.projects.edges.map((edge: any) => edge.node)
      : [];

  if (projects.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-y-8">
        <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
          Get your projects ready
        </h1>
        <ProjectCreationDialog>
          <Button size="lg" className="mt-4 flex items-center gap-x-2">
            <Plus className="w-5 h-5" />
            New Project
          </Button>
        </ProjectCreationDialog>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center gap-y-8">
      <div className="w-full max-w-xl mt-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Your Projects</h2>
        <ul className="space-y-2">
          {projects.map((project: any) => (
            <Link
              href={`/projects/${project.id}`}
              className="p-4"
              key={project.id}
            >
              <Card>
                <CardContent className="flex flex-col gap-y-2">
                  <span className="font-medium">{project.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({project.id})
                  </span>
                  <div className="flex items-center gap-x-2">
                    <span className="text-sm font-medium">Services: </span>
                    <span>{project.services.edges.length} </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </ul>
        <div className="flex justify-center mt-6">
          <ProjectCreationDialog>
            <Button size="lg" className="flex items-center gap-x-2">
              <Plus className="w-5 h-5" />
              New Project
            </Button>
          </ProjectCreationDialog>
        </div>
      </div>
    </div>
  );
}
