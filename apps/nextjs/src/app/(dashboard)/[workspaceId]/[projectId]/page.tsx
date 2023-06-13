export default function SettingsOverview(props: {
  params: { workspaceId: string; projectId: string };
}) {
  return (
    <div>
      Project ${props.params.projectId} owner by {props.params.workspaceId}
    </div>
  );
}
