import { UserProfile } from "@clerk/nextjs/app-beta";

import { InterceptingModal } from "~/app/@modal/intercepting-modal";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default function ProfilePageModal() {
  return (
    <InterceptingModal className="h-[80vh] overflow-hidden">
      <UserProfile />
    </InterceptingModal>
  );
}
