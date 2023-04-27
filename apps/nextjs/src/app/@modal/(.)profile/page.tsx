import { UserProfile } from "@clerk/nextjs/app-beta";

import { InterceptingModal } from "~/app/@modal/intercepting-modal";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default function ProfilePageModal() {
  return (
    <InterceptingModal className="h-[80vh] overflow-hidden">
      <UserProfile
        appearance={
          {
            elements: {
              // Main card element
              card: "w-full md:w-fit h-[75vh]",
              navbar: "hidden",
              navbarMobileMenuButton: "hidden",
            },
          }
          // set the routing to virtual, so that the modal can intercept the routing
        }
        routing="virtual"
      />
    </InterceptingModal>
  );
}
