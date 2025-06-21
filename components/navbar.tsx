import { ModeToggle } from "./mode-toggle";

export default function Navbar() {
  return (
    <div className="flex justify-between">
      <h1 className="text-2xl font-bold">Roadways</h1>
      <ModeToggle />
    </div>
  )
}
