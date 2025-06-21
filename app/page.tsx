import ProjectList from "@/components/project-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-full mt-20">
      <div className="flex justify-between">
        <div >
          <h1>Get your projects ready</h1>
        </div>
        <div className="flex items-center gap-x-2">
          <div>
            <Button><Plus />New</Button>
          </div>
          <div>
            <Link href={"/projects"}>
              <Button variant={"outline"}>Project</Button>
            </Link>
          </div>
        </div>
      </div>
      <div>
        <ProjectList />
      </div>
    </div>
  );
}
