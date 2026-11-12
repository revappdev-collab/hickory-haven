import { createFileRoute } from "@tanstack/react-router";
import { HavenApp } from "@/components/HavenApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hickory & Haven" },
      {
        name: "description",
        content: "Your home away from home. Book The Cozy Olive direct.",
      },
    ],
  }),
  component: HavenApp,
});
