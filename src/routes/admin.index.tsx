import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy /admin entry point — redirect to the public home page. */
export const Route = createFileRoute("/admin/")({
  beforeLoad: () => {
    throw redirect({ to: "/", replace: true });
  },
});
