import type { Metadata } from "next";
import { OfferingPage } from "@/components/conversations/offering-page";
import { offerings } from "@/content/offerings";

const offering = offerings.find((o) => o.slug === "premarital")!;

export const metadata: Metadata = {
  title: "Premarital Conversations",
  description:
    "Before the vows, the conversations. Private 60-minute harmony conversations with Dr. Laiyemo for anyone preparing for marriage: single and thinking ahead, dating with intention, engaged, or newly wed.",
};

export default function PremaritalPage() {
  return <OfferingPage offering={offering} />;
}
