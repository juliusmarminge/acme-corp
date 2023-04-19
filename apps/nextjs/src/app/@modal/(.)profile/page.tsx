import { UserProfile } from "@clerk/nextjs/app-beta";

import { InterceptingModal } from "~/app/@modal/intercepting-modal";

export default function ProfilePageModal() {
  return (
    <InterceptingModal className="h-[80vh] overflow-hidden">
      <UserProfile />
    </InterceptingModal>
  );
}
