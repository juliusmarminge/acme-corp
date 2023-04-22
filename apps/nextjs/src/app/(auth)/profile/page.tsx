import { UserProfile } from "@clerk/nextjs/app-beta";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default function ProfilePage() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col justify-center space-y-6 overflow-hidden">
      <UserProfile appearance={{
        elements: {
          // Main card element
          card: "w-[500px] w-fit, h-[75vh]",
          navbar: "hidden",
          navbarMobileMenuButton: "hidden",
        }
      }
      } />
    </div>
  );
}
