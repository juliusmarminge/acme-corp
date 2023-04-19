"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Dialog, DialogContent } from "@acme/ui/dialog";

export function InterceptingModal(props: {
  children: React.ReactNode;
  className?: string;
}) {
  const [mounted, setMounted] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return (
    <Dialog open={mounted} onOpenChange={() => router.back()}>
      <DialogContent className={props.className}>
        {props.children}
      </DialogContent>
    </Dialog>
  );
}
