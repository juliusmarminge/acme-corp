"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useOrganizationList } from "@clerk/nextjs";

/**
 * I couldn't find a way to do this on the server :thinking: Clerk is adding support for this soon.
 * If I go to /[workspaceId]/**, I want to set the active organization to the workspaceId,
 * If it's a personal worksapce, set the organization to null, else find the organization by id
 * and set it to that.
 */
export function SyncActiveOrgFromUrl() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { setActive, userMemberships, isLoaded } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  React.useEffect(() => {
    if (!isLoaded || userMemberships.isLoading) return;

    if (!workspaceId?.startsWith("org_")) {
      void setActive({ organization: null });
      return;
    }

    const org = userMemberships?.data?.find(
      ({ organization }) => organization.id === workspaceId,
    );

    if (org) {
      void setActive(org);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId, isLoaded]);

  return null;
}
