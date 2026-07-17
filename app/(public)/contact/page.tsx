import type { Metadata } from "next";
import { Reveal } from "@/components/garden/reveal";
import { PetalCard } from "@/components/garden/primitives";
import { ContactForm, CONVERSATION_TOPIC } from "@/components/contact/contact-form";
import { disclaimer } from "@/content/site";

// Contact (PRD §7.8): a note through the garden gate, not a support ticket.
// The topic preselects from ?topic= so conversation pages can hand a visitor
// here gently; the privacy variant (design ruling D11) follows the selection.

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Write to the garden. Questions, hellos, and first steps toward a harmony conversation all begin here. A reply within two business days.",
};

function topicFromParam(raw: string | string[] | undefined): string {
  const value = (Array.isArray(raw) ? raw[0] : raw)?.toLowerCase().trim();
  switch (value) {
    case "premarital":
    case "marital":
    case "postmarital":
    case "conversation":
      return CONVERSATION_TOPIC;
    case "membership":
      return "Membership question";
    case "gift":
    case "gifting":
      return "Gifting";
    case "speaking":
      return "Speaking invitation";
    default:
      return "General hello";
  }
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string | string[] }>;
}) {
  const { topic } = await searchParams;
  const initialTopic = topicFromParam(topic);

  return (
    <section aria-labelledby="contact-title" className="mx-auto max-w-7xl px-5 py-24 sm:py-32 lg:px-8">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <div className="flex flex-col gap-6">
            <h1 id="contact-title" className="text-display-xl text-balance">
              Write to the garden
            </h1>
            <p className="text-lede max-w-[52ch]">
              Whatever brought you here, begin however feels right. A reply within two business
              days, usually sooner.
            </p>
            <p className="text-body max-w-[52ch] text-ink-muted">
              Every note is read by a person, not a queue. If you are reaching out about a
              harmony conversation, a short hello is more than enough to begin.
            </p>
            <div className="mt-4 rounded-2xl border border-hairline px-6 py-5">
              <p className="text-[14px] leading-relaxed text-ink-muted">{disclaimer.short}</p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7">
          <PetalCard>
            <ContactForm initialTopic={initialTopic} />
          </PetalCard>
        </Reveal>
      </div>
    </section>
  );
}
