'use client';

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowBigLeftIcon } from "lucide-react";
import Link from "next/link";
import { createSampleService, getProjectById } from "../actions/actions";
import React from "react";
import { Project } from '@/src/graphql/graphql';

export default function ProjectPage() {
  const [project, setProject] = React.useState<Project | null>(null)
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
  }, [])

  // Render a loading state
  if (isLoading) {
    return <div>Loading your Railway project...</div>;
  }

  // Render an error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  console.log('response', project)


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
          {project?.name}
          {project?.services.edges.map(item => (
            <div>{item.node.name}</div>
          ))}
        </div>
        <div className="items-center justify-center flex h-full">
          <Button onClick={createSampleService}>Trigger a service creation</Button>
        </div>
      </div>
    </div>
  )
}
