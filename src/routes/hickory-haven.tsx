import { createFileRoute } from "@tanstack/react-router";
import { HavenApp } from "@/components/HavenApp";

/** Same app as `/`, so http://localhost:8081/hickory-haven opens the home screen. */
export const Route = createFileRoute("/hickory-haven")({
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
