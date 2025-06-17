import Image from "next/image";
import { SignInButton, SignedOut, SignedIn, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import ModeToggle from "@/components/ModeToggle";

export default function Home() {
  return (
    <div>
      <SignedOut>
        <SignInButton mode="modal">
          <Button className = "m-4">
            Sign In
          </Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <ModeToggle />
      <Button variant={"secondary"}>Click Me</Button>
    </div>
  );
}
