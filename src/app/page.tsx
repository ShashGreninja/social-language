import CreatePost from "@/components/CreatePost";
import WhoToFollow from "@/components/WhoToFollow";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();
  return (
    <div className = "grid grid-cols-1 lg:grid-cols-10 gap-6">
      <div className = "lg:col-span-6">
        {user ? <CreatePost/> : null} 
      </div>

      <div className = "hidden lg:block lg:col-span-4 sticky top-20">
        {/* hidden in small screen block and visible in large ones */}
        <WhoToFollow />
      </div>      
      
    </div>
  );
}
