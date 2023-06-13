import { notFound } from "next/navigation";
import { auth, clerkClient } from "@clerk/nextjs";

import { SidebarNav } from "./_components/sidebar";
import { SyncActiveOrgFromUrl } from "./sync-active-org-from-url";

export default async function WorkspaceLayout(props: {
  children: React.ReactNode;
  params: { workspaceId: string };
}) {
  const { workspaceId } = props.params;
  const isOrg = workspaceId.startsWith("org_");
  const isUser = workspaceId.startsWith("user_");
  if (!isOrg && !isUser) {
    notFound();
  }

  const { orgId, userId } = auth();
  if (!userId) notFound();

  // If the org is already the active one we don't need to fetch external data
  // to validate the user is part of the org
  if (isOrg && orgId !== workspaceId) {
    const orgs = await clerkClient.users.getOrganizationMembershipList({
      userId: userId,
    });
    const org = orgs.find((org) => org.organization.id === workspaceId);
    if (!org) {
      notFound();
    }

    // TODO: Set active org when support is added to Clerk
    // await clerkClient.organization.setActive({ userId, organization: org })
  }

  if (isUser && userId !== workspaceId) {
    notFound();
  }

  return (
    <>
      {/* TODO: Nuke it! */}
      <SyncActiveOrgFromUrl />
      <div className="container flex flex-1 gap-12">
        <aside className="hidden w-52 flex-col md:flex">
          <SidebarNav />
        </aside>
        <main className="flex flex-1 flex-col overflow-hidden">
          {props.children}
        </main>
      </div>
    </>
  );
}
