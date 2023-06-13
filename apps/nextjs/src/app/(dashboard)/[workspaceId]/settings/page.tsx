import { notFound } from "next/navigation";
import { auth, clerkClient, UserProfile } from "@clerk/nextjs";

import { OrganizationImage } from "./_components/organization-image";
import { OrganizationName } from "./_components/organization-name";

export default function WorkspaceSettingsPage(props: {
  params: { workspaceId: string };
}) {
  const { workspaceId } = props.params;
  const isOrg = workspaceId.startsWith("org_");

  if (isOrg) return <OrganizationSettingsPage />;

  return <UserSettingsPage />;
}

async function OrganizationSettingsPage() {
  const { orgId } = auth();
  if (!orgId) notFound();

  const org = await clerkClient.organizations.getOrganization({
    organizationId: orgId,
  });

  return (
    <div className="flex flex-col space-y-4">
      <div>
        <h1 className="text-xl font-semibold leading-none tracking-tight">
          {org.name}
        </h1>
        <h2 className="text-base text-muted-foreground">
          Manage your organization
        </h2>
      </div>

      <OrganizationName orgId={org.id} name={org.name} />
      <OrganizationImage orgId={org.id} name={org.name} image={org.imageUrl} />
    </div>
  );
}

function UserSettingsPage() {
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
