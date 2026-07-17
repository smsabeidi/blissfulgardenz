import type { Metadata } from "next";
import { SiteHeader } from "@/components/garden/site-header";
import { SiteFooter } from "@/components/garden/site-footer";
import { EmptyState } from "@/components/garden/primitives";
import { BloomButton } from "@/components/garden/buttons";

// The designed 404 (considered emptiness, DESIGN.md). Lives outside (public),
// so the header and footer are composed directly, the same way the public
// layout does, and the page still feels like the garden.

export const metadata: Metadata = {
  title: "Page not found",
  description: "This corner of the garden is unplanted. Come back to the path.",
};

export default function NotFound() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" className="w-full max-w-full flex-1 overflow-x-clip">
        <section
          aria-label="Page not found"
          className="mx-auto flex min-h-[60dvh] max-w-7xl items-center justify-center px-5 py-24 lg:px-8"
        >
          <EmptyState
            title="This corner of the garden is unplanted"
            body="Nothing is growing at this address yet. The paths you were looking for begin back at the gate."
            action={<BloomButton href="/">Back to the garden</BloomButton>}
          />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
