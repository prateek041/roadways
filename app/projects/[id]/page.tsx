"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowBigLeftIcon } from "lucide-react";
import Link from "next/link";

import React from "react";
import { Project } from "@/src/graphql/graphql";
import { Card, CardContent } from "@/components/ui/card";
import {
  createDeployment,
  createNewService,
  getProjectById,
} from "@/app/actions/actions";

export default function ProjectPage() {
  const [project, setProject] = React.useState<Project | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadProjectData = async () => {
      const result = await getProjectById();

      if (result.success) {
        setProject(result.data as Project);
      } else {
        setError(result.error as string);
      }

      setIsLoading(false);
    };

    loadProjectData();
  }, []);

  // Render a loading state
  if (isLoading) {
    return <div>Loading your Railway project...</div>;
  }

  // Render an error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  console.log(
    "final",
    project?.services.edges[0].node.deployments.edges[0].node.environmentId
  );

  return (
    <div className="h-screen">
      <Link href={"/"}>
        <div className="flex items-center gap-x-5">
          <ArrowBigLeftIcon />
          Go back
        </div>
      </Link>
      <Separator className="my-2" />

      <div className="mt-20 h-full">
        <div>
          <h1 className="text-xl font-semibold mb-2">{project?.name}</h1>
          {project?.services.edges.map((item) => (
            <div key={item.node.id}>
              <Card>
                <CardContent>
                  {item.node.name}
                  {item.node.deployments.edges.map((item) => (
                    <div key={item.node.id}>{item.node.environmentId}</div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        <div className="items-center justify-center flex h-full">
          <Button onClick={createNewService}>Trigger a service creation</Button>
          <Button onClick={createDeployment}>Trigger a deployment</Button>
        </div>
      </div>
    </div>
  );
}
