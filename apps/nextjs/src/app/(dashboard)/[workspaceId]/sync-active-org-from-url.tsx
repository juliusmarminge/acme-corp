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
  const { workspaceId } = useParams();
  const { setActive, organizationList, isLoaded } = useOrganizationList();

  React.useEffect(() => {
    if (!isLoaded) return;

    if (!workspaceId?.startsWith("org_")) {
      void setActive({ organization: null });
      return;
    }

    const org = organizationList?.find(
      ({ organization }) => organization.id === workspaceId,
    );

    if (org) {
      void setActive(org);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId, isLoaded]);

  return null;
}
