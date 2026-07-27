import Link from "next/link";
import type { Metadata } from "next";
import { BookingPanel } from "@/components/member/booking-panel";
import { DisclaimerNote } from "@/components/conversations/disclaimer-note";
import { offerings } from "@/content/offerings";
import { getAccess } from "@/lib/access";
import { env } from "@/lib/env";
import { conversationPricing } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Conversations",
  description: "Book a private sixty minute conversation with Dr. Laiyemo.",
  // Behind the gate, and not for the index. Middleware already redirects
  // signed-out visitors, so this is belt and braces for anything that follows
  // a shared link.
  robots: { index: false, follow: false },
};

// The member path to a private conversation.
//
// Register: still. No scroll reveals, no parallax, no motion of any kind on
// this page. Someone reading it may be in a hard season and does not need the
// interface performing for them.
//
// Compliance: the nature of these conversations and the crisis line are stated
// before the price and the button, not after them, and the approved wording
// comes from content/site through DisclaimerNote so it can only ever be edited
// in one place.

export default async function MemberConversationsPage() {
  const access = await getAccess();
  const pricing = conversationPricing(access);
  const bookingUrl = env.calBookingUrl();

  return (
    <div className="mx-auto w-full max-w-3xl px-5 pb-24 pt-10 sm:px-6">
      <header>
        <p className="text-meta text-ink-muted">Harmony conversations</p>
        <h1 className="mt-4 text-display text-balance">A private conversation</h1>
        <p className="mt-5 max-w-[58ch] text-lede">
          Sixty unhurried minutes with Dr. Laiyemo. Private, and yours to use however you need it.
        </p>
      </header>

      <section aria-labelledby="what-this-is" className="mt-16">
        <h2 id="what-this-is" className="text-display-sm">
          What a conversation is
        </h2>
        <div className="mt-5 flex max-w-[62ch] flex-col gap-4 text-body text-ink-muted">
          <p>
            One hour, held on purpose. You bring what is on your mind. Dr. Laiyemo listens first,
            then asks, then offers what he has learned across two decades of family harmony
            advocacy. It is plain, practical talk about what is working, what is not, and what could
            be different.
          </p>
          <p>
            There is no script to get through and no hurry. Many people find the first twenty
            minutes are simply for saying the thing out loud, sometimes for the first time.
          </p>
          <p>
            You do not need to be part of a couple. People come single, dating, engaged, married,
            separated, divorced, and widowed. You may come alone or with someone. All of it is
            ordinary here, and all of it is welcome.
          </p>
          <p>
            What you say stays between you and Dr. Laiyemo. If you share a membership with someone,
            they cannot see anything you write or book.
          </p>
        </div>
      </section>

      <div className="mt-10">
        <DisclaimerNote crisis />
      </div>

      <section aria-labelledby="booking" className="mt-16">
        <h2 id="booking" className="text-display-sm">
          Booking a conversation
        </h2>
        <p className="mt-4 max-w-[58ch] text-body text-ink-muted">
          One rate, one hour, whichever path you choose.
        </p>
        <div className="mt-6">
          <BookingPanel pricing={pricing} bookingUrl={bookingUrl} />
        </div>
      </section>

      <section aria-labelledby="paths" className="mt-16">
        <h2 id="paths" className="text-display-sm">
          Three paths
        </h2>
        <p className="mt-4 max-w-[58ch] text-body text-ink-muted">
          Three ways in. If you are not sure which is yours, choose the one that sounds closest.
          Nothing is settled by picking one, and you can say so in the hour.
        </p>

        <ul className="mt-8 flex flex-col">
          {offerings.map((offering) => (
            <li
              key={offering.slug}
              className="border-t border-hairline py-8 first:border-t-0 first:pt-0"
            >
              <p className="text-meta text-ink-muted">{offering.label}</p>
              <h3 className="mt-3 text-display-sm">{offering.title}</h3>
              <p className="mt-3 max-w-[58ch] text-body text-ink-muted">{offering.lede}</p>
              <p className="mt-2 max-w-[58ch] text-[15px] leading-relaxed text-ink-muted">
                For {offering.audience.charAt(0).toLowerCase()}
                {offering.audience.slice(1)}.
              </p>
              <Link
                href={`/conversations/${offering.slug}`}
                className="mt-4 inline-flex min-h-11 items-center text-[15px] font-medium text-gold-text underline decoration-hairline underline-offset-4 transition-colors hover:decoration-current"
              >
                More about the {offering.label.toLowerCase()} path
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-14 max-w-[58ch] text-[15px] leading-relaxed text-ink-muted">
        If you would like to see how an hour usually unfolds before you book,{" "}
        <Link
          href="/conversations/how-it-works"
          className="text-gold-text underline decoration-hairline underline-offset-4 transition-colors hover:decoration-current"
        >
          read how it works
        </Link>
        . If you would rather ask something first,{" "}
        <Link
          href="/contact"
          className="text-gold-text underline decoration-hairline underline-offset-4 transition-colors hover:decoration-current"
        >
          write to us
        </Link>
        .
      </p>
    </div>
  );
}
