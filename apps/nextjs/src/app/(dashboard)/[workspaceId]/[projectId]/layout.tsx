import { notFound } from "next/navigation";

import { api } from "~/trpc/server";

export default async function ProjectLayout(props: {
  children: React.ReactNode;
  params: { projectId: string };
}) {
  const projectId = props.params.projectId;

  await api.project.byId.query({ id: projectId }).catch(() => {
    notFound();
  });

  return <>{props.children}</>;
}
