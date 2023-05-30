import { SettingsSidebar } from "./settings-sidebar";

export default function SettingsLayout(props: { children: React.ReactNode }) {
  return (
    <div className="container flex flex-1 gap-12">
      <aside className="hidden w-52 flex-col md:flex">
        <SettingsSidebar />
      </aside>
      <main className="flex flex-1 flex-col overflow-hidden">
        {props.children}
      </main>
    </div>
  );
}
