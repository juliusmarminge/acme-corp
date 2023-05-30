import { UserProfile } from "@clerk/nextjs";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default function ProfilePage() {
  return (
    <div>
      <h1 className="text-xl font-semibold leading-none tracking-tight">
        Account
      </h1>
      <h2 className="text-base text-muted-foreground">
        Manage your account details
      </h2>
      <UserProfile
        appearance={{
          variables: {
            borderRadius: "var(--radius)",
            // colorBackground: "var(--background)",
          },
          elements: {
            // Main card element
            card: "shadow-none bg-background text-foreground",
            navbar: "hidden",
            navbarMobileMenuButton: "hidden",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
          },
        }}
      />
    </div>
  );
}
