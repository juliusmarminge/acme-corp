import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Balancer } from "react-wrap-balancer";

import { CreateApiKeyForm } from "../[workspaceId]/_components/create-api-key-form";

export function CreateApiKey() {
  const router = useRouter();
  const projectId = useSearchParams().get("projectId");

  useEffect(() => {
    if (!projectId) {
      router.push(`/onboarding`);
    }
  }, [projectId, router]);

  return (
    <motion.div
      className="flex h-full w-full flex-col items-center justify-center"
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, type: "spring" }}
    >
      <motion.div
        variants={{
          show: {
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
        initial="hidden"
        animate="show"
        className="flex flex-col rounded-xl bg-background/60 p-8"
      >
        <motion.h1
          className="mb-4 font-cal text-2xl font-bold transition-colors sm:text-3xl"
          variants={{
            hidden: { opacity: 0, x: 250 },
            show: {
              opacity: 1,
              x: 0,
              transition: { duration: 0.4, type: "spring" },
            },
          }}
        >
          <Balancer>
            {`Next, let's create an API key for your project`}
          </Balancer>
        </motion.h1>
        <motion.div
          variants={{
            hidden: { opacity: 0, x: 100 },
            show: {
              opacity: 1,
              x: 0,
              transition: { duration: 0.4, type: "spring" },
            },
          }}
        >
          <CreateApiKeyForm
            projectId={projectId!}
            onSuccess={(apiKey) => {
              const searchParams = new URLSearchParams(window.location.search);
              searchParams.set("step", "done");
              searchParams.set("apiKey", apiKey);
              router.push(`/onboarding?${searchParams.toString()}`);
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
