import { UserProfile } from "@clerk/nextjs/app-beta";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default function ProfilePage() {
  return (
    <div className="w- mx-auto flex w-full max-w-xl flex-col justify-center overflow-hidden">
      <UserProfile
        appearance={{
          elements: {
            // Main card element
            card: "w-fit h-[80vh]",
            navbar: "hidden",
            navbarMobileMenuButton: "hidden",
          },
        }}
      />
    </div>
  );
}
