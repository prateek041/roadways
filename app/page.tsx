import ProjectList from "@/components/project-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Home() {
  return (
    <div className="h-full mt-20">
      <div className="flex justify-between">
        <div >
          <h1>Get your projects ready</h1>
        </div>
        <div>
          <Button><Plus />New</Button>
        </div>
      </div>
      <div>
        <ProjectList />
      </div>
    </div>
  );
}
