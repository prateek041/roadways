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
import { createNewProject } from "@/app/actions/actions";

export default function ProjectCreationDialog() {
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
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const projectName = formData.get("project-name") as string;
                if (projectName) {
                  console.log("Creating project:", projectName);
                  createNewProject(projectName);
                } else {
                  console.error("Project name is required.");
                }
              }}
            >
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
                />
              </div>
              <div className="mt-4">
                <Button type="submit" className="w-full">
                  Create Project
                </Button>
              </div>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
