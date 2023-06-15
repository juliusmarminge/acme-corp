import { SidebarNav } from "./_components/sidebar";
import { SyncActiveOrgFromUrl } from "./sync-active-org-from-url";

export default function WorkspaceLayout(props: {
  children: React.ReactNode;
  params: { workspaceId: string };
}) {
  return (
    <>
      {/* TODO: Nuke it when we can do it serverside in Clerk! */}
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
