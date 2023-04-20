import { UserProfile } from "@clerk/nextjs/app-beta";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default function ProfilePage() {
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 overflow-hidden sm:w-[350px]">
      <UserProfile />
    </div>
  );
}
