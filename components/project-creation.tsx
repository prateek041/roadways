"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { Input } from "./ui/input";
import { createNewProject, Response } from "@/app/actions/actions";
import { Project } from "@/src/graphql/graphql";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProjectCreationDialog(
  children: React.PropsWithChildren
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const projectName = formData.get("project-name") as string;

    if (!projectName) {
      setError("Project name is required.");
      setLoading(false);
      return;
    }

    try {
      const response: Response<Project> = await createNewProject(projectName);

      if (response?.data?.id) {
        router.push(`/projects/${response.data.id}`);
      } else if (response?.error) {
        setError(response.error);
      } else {
        setError("Unknown error occurred.");
      }
    } catch (err) {
      setError("Failed to create project.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button>
          <Plus />
          New
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new project</DialogTitle>
          <DialogDescription>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <label
                  htmlFor="project-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Project Name
                </label>
                <Input
                  type="text"
                  id="project-name"
                  name="project-name"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter project name"
                  disabled={loading}
                  required
                />
                {error && (
                  <div className="text-red-500 text-sm mt-2">{error}</div>
                )}
              </div>
              <div className="mt-4">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating..." : "Create Project"}
                </Button>
              </div>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
