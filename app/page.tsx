import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Home() {
  return (
    <div className="h-full flex mt-20 justify-between">
      <div className="">
        <h1 className="">Get your projects ready</h1>
      </div>
      <div>
        <Button><Plus />New</Button>
      </div>
    </div>
  );
}
