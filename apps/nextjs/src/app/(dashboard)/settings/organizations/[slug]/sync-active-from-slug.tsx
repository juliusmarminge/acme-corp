"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useOrganizationList } from "@clerk/nextjs";

/**
 * I couldn't find a way to do this on the server :thinking:
 * If I go to /settings/organizations/acme, I want to set the active organization to acme
 */
export function SyncActiveOrgFromSlug() {
  const { slug } = useParams();
  const { setActive, organizationList, isLoaded } = useOrganizationList();

  React.useEffect(() => {
    if (!isLoaded) return;
    const org = organizationList?.find(
      ({ organization }) => organization.slug === slug,
    );

    if (org) void setActive?.(org);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, isLoaded]);

  return null;
}
