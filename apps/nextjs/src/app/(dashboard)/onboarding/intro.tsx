"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Balancer } from "react-wrap-balancer";

import { Button } from "@acme/ui/button";

import { useDebounce } from "~/lib/use-debounce";

export default function Intro() {
  const router = useRouter();

  const showText = useDebounce(true, 800);

  return (
    <motion.div
      className="flex h-full w-full flex-col items-center justify-center"
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, type: "spring" }}
    >
      {showText && (
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
          className="mx-5 flex flex-col items-center space-y-6 text-center sm:mx-auto"
        >
          <motion.h1
            className="font-cal text-4xl font-bold transition-colors sm:text-5xl"
            variants={{
              hidden: { opacity: 0, y: 50 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.4, type: "spring" },
              },
            }}
          >
            <Balancer>Welcome to Acme Corp</Balancer>
          </motion.h1>
          <motion.p
            className="max-w-md text-muted-foreground transition-colors sm:text-lg"
            variants={{
              hidden: { opacity: 0, y: 50 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.4, type: "spring" },
              },
            }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt.
          </motion.p>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 50 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.4, type: "spring" },
              },
            }}
          >
            <Button
              size="lg"
              onClick={() => router.push("/onboarding?step=create-project")}
            >
              Get Started
            </Button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
