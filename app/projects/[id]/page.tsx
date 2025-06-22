"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowBigLeftIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { Project } from "@/src/graphql/graphql";
import { Card, CardContent } from "@/components/ui/card";
import {
  createDeployment,
  createNewService,
  getProjectById,
} from "@/app/actions/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProjectPage() {
  const params = useParams();
  const projectId = params?.id as string | undefined;

  const [project, setProject] = React.useState<Project | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedEnvId, setSelectedEnvId] = React.useState<string | undefined>(
    undefined
  );
  const [serviceId, setServiceId] = React.useState<string | undefined>();

  // Fetch project data
  const fetchProject = React.useCallback(async () => {
    if (!projectId) {
      setError("No project ID found in URL.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const result = await getProjectById(projectId);
    if (result.success) {
      setProject(result.data as Project);
      setServiceId((result.data as Project)?.services?.edges[0]?.node.id);
      // Set default environment to the first one if available
      const envEdges = (result.data as Project)?.environments?.edges;
      if (envEdges && envEdges.length > 0) {
        setSelectedEnvId(envEdges[0].node.id);
      }
    } else {
      setError(result.error as string);
    }
    setIsLoading(false);
  }, [projectId]);

  React.useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  // Handler for creating a new service and refreshing the project data
  const handleCreateNewService = async () => {
    if (!projectId) return;
    const response = await createNewService(projectId);
    console.log("Service creation response:", response);
    await fetchProject(); // Refresh the project data after creating a new service
  };

  // Handler for creating a deployment
  const handleCreateDeployment = async () => {
    if (!projectId || !serviceId || !selectedEnvId) return;
    await createDeployment(projectId, serviceId, selectedEnvId);
  };

  // Render a loading state
  if (isLoading) {
    return <div>Loading your Railway project...</div>;
  }

  // Render an error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  console.log("Project data:", project);

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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-x-4">
              <h1 className="text-xl font-semibold mb-2">{project?.name}</h1>
              <Select
                value={selectedEnvId}
                onValueChange={(value) => setSelectedEnvId(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Environment" />
                </SelectTrigger>
                <SelectContent>
                  {project?.environments.edges.map((env) => (
                    <SelectItem key={env.node.id} value={env.node.id}>
                      {env.node.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleCreateNewService}>Create New Service</Button>
          </div>
          {project?.services.edges.map((item) => (
            <div key={item.node.id}>
              <Card>
                <CardContent>
                  <div className="flex flex-col">
                    <h1 className="font-semibold">{item.node.name}</h1>
                    <h2>{item.node.id}</h2>
                  </div>
                  {item.node.deployments ? (
                    <div className="mt-2">
                      <h2 className="text-sm font-medium">Service ID:</h2>
                      <p className="text-sm">{item.node.id}</p>
                    </div>
                  ) : (
                    <div className="mt-2 justify-self-end">
                      <Button
                        variant={"outline"}
                        onClick={handleCreateDeployment}
                        disabled={!selectedEnvId}
                      >
                        Trigger a deployment
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        <div className="items-center justify-center flex h-full">
          <Button onClick={handleCreateNewService}>
            Trigger a service creation
          </Button>
        </div>
      </div>
    </div>
  );
}
