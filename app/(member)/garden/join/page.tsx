import Link from "next/link";
import { acceptSeatInvite } from "@/app/actions/seat-accept";
import { BloomButton } from "@/components/garden/buttons";

// Accepting a second seat. Middleware already guaranteed the visitor is signed
// in by the time they land here, so the invited partner's path is: open the
// emailed link, sign in (or create an account), and arrive back here with the
// token intact.

export const metadata = { title: "Join a membership" };

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <Shell title="This link is incomplete.">
        <p className="text-body text-ink-muted">
          The invitation link is missing its code. Ask for a fresh invitation, and open the link
          straight from the email.
        </p>
      </Shell>
    );
  }

  const result = await acceptSeatInvite(token);

  if (result.status === "ok") {
    return (
      <Shell title="You are in.">
        <p className="text-body text-ink-muted">
          The garden is open to you. Your films, the vault, and the gatherings are shared. Anything
          you write stays private to you, always.
        </p>
        <div className="mt-8">
          <BloomButton href="/garden">Enter the garden</BloomButton>
        </div>
      </Shell>
    );
  }

  return (
    <Shell title={result.status === "invalid" ? "We could not open that." : "Something interrupted that."}>
      <p className="text-body text-ink-muted">
        {result.status === "invalid"
          ? result.reason
          : "Please try the link once more. If it still will not open, write to us and we will sort it out."}
      </p>
      <div className="mt-8">
        <Link href="/contact" className="text-[15px] font-medium text-gold-text underline-offset-4 hover:underline">
          Write to us
        </Link>
      </div>
    </Shell>
  );
}

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-2xl px-5 py-24 sm:py-32 lg:px-8">
      <h1 className="text-display text-balance">{title}</h1>
      <div className="mt-5">{children}</div>
    </section>
  );
}
