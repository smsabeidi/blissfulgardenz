import Link from "next/link";
import { BloomButton } from "@/components/garden/buttons";
import { ctaLabels } from "@/content/site";

// What a signed-in person sees when they do not hold a membership. This is a
// door, not a wall: it names honestly what is on the other side and then stops
// talking. No countdown, no scarcity, no "you are missing out". Someone who
// reaches this screen has already shown interest by making an account, and
// pressure is the wrong way to repay that.

const INSIDE: { name: string; body: string }[] = [
  {
    name: "The Library",
    body: "Films from Dr. Laiyemo with the reading that sits alongside them, added through the season. Watch at whatever pace suits the week. The garden remembers where you stopped.",
  },
  {
    name: "The Vault",
    body: "Guides and questions you can work through slowly, and a private place to write. What you write is visible to you and to no one else.",
  },
  {
    name: "Conversations",
    body: "Facilitated harmony conversations, arranged when the time is right for you.",
  },
  {
    name: "A second seat",
    body: "Membership carries a seat you can pass to someone else. If there is a person you would like to share this with, you can invite them. If there is not, the membership is complete exactly as it stands.",
  },
];

export function PaywallNotice() {
  return (
    <div className="max-w-[68ch] py-16 lg:py-24">
      <p className="text-meta text-ink-muted">The Inner Garden</p>
      <h1 className="text-display mt-4 text-balance">This part of the garden opens with a membership.</h1>
      <p className="text-lede mt-5">
        You are signed in, so nothing else is needed. Here is what is on the other side.
      </p>

      <dl className="mt-12 divide-y divide-hairline border-y border-hairline">
        {INSIDE.map((item) => (
          <div key={item.name} className="py-6">
            <dt className="text-display-sm">{item.name}</dt>
            <dd className="text-body mt-2 text-ink-muted">{item.body}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-12">
        <BloomButton href="/membership">{ctaLabels.membership}</BloomButton>
      </div>

      <p className="mt-8 text-[14px] leading-relaxed text-ink-muted">
        There is no countdown on this. The gate stays where it is, and you can come back to it
        whenever you like.
      </p>

      {/* Billing can land a beat after checkout. Saying so here prevents a paid
          member from concluding they were charged for nothing. */}
      <p className="mt-3 text-[14px] leading-relaxed text-ink-muted">
        If you have already joined and this page is still showing, give it a moment and reload. If
        it stays, please{" "}
        <Link
          href="/contact"
          className="underline decoration-hairline underline-offset-4 transition-colors duration-200 hover:text-ink hover:decoration-current"
        >
          write to us
        </Link>{" "}
        and we will sort it out.
      </p>
    </div>
  );
}
