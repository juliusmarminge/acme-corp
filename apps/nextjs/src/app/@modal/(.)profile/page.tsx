"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { UserProfile } from "@clerk/nextjs/app-beta/client";

import { Dialog, DialogContent } from "@acme/ui/dialog";

export default function ProfilePageModal() {
  const [mounted, setMounted] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return (
    <Dialog open={mounted} onOpenChange={() => router.back()}>
      <DialogContent>
        <div className="h-[80vh] overflow-hidden">
          <UserProfile />
        </div>
      </DialogContent>
    </Dialog>
  );
}
