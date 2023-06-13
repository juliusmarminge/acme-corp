export function DashboardShell(props: {
  title: string;
  description: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={props.className}>
      <div className="mb-4 flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold leading-none tracking-tight">
            {props.title}
          </h1>
          <h2 className="text-base text-muted-foreground">
            {props.description}
          </h2>
        </div>
        {props.headerAction}
      </div>
      {props.children}
    </div>
  );
}
