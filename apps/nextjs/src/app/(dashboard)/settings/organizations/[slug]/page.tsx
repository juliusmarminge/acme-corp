import { redirect } from "next/navigation";
import { auth, clerkClient } from "@clerk/nextjs";

import { OrganizationImage } from "./organization-image";
import { OrganizationName } from "./organization-name";
import { SyncActiveOrgFromSlug } from "./sync-active-from-slug";

export default async function OrganizationSettingsPage(props: {
  params: { slug: string };
  searchParams: { new: boolean };
}) {
  if (!props.params.slug) redirect("/");

  const authed = auth();
  if (!authed.orgId) redirect("/settings/account");

  const org = await clerkClient.organizations.getOrganization({
    organizationId: authed.orgId,
  });

  return (
    <>
      <SyncActiveOrgFromSlug />

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
        <OrganizationImage
          orgId={org.id}
          name={org.name}
          image={org.imageUrl}
        />
      </div>
    </>
  );
}
