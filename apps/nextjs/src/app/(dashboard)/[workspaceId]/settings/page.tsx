import { notFound } from "next/navigation";
import { auth, clerkClient, UserProfile } from "@clerk/nextjs";

import { DashboardShell } from "../../_components/dashboard-shell";
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
    <DashboardShell
      title="Organization"
      description="Manage your organization"
      className="space-y-4"
    >
      <OrganizationName orgId={org.id} name={org.name} />
      <OrganizationImage orgId={org.id} name={org.name} image={org.imageUrl} />
    </DashboardShell>
  );
}

function UserSettingsPage() {
  return (
    <DashboardShell title="Account" description="Manage your account details">
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
    </DashboardShell>
  );
}
