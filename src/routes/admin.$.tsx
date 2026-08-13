import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy admin URLs are gone — send visitors to the public home page. */
export const Route = createFileRoute("/admin/$")({
  beforeLoad: () => {
    throw redirect({ to: "/", replace: true });
  },
});
