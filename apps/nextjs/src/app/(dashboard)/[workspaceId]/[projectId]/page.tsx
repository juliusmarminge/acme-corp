import { redirect } from "next/navigation";

/**
 * Suboptimal, would be better off doing this in middleware
 */
export default function ProjectPage(props: {
  params: { workspaceId: string; projectId: string };
}) {
  redirect(`/${props.params.workspaceId}/${props.params.projectId}/overview`);
}
