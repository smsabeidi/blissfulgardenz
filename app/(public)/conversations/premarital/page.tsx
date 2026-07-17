import type { Metadata } from "next";
import { OfferingPage } from "@/components/conversations/offering-page";
import { offerings } from "@/content/offerings";

const offering = offerings.find((o) => o.slug === "premarital")!;

export const metadata: Metadata = {
  title: "Premarital Conversations",
  description:
    "Before the vows, the conversations. Private 60-minute harmony conversations with Dr. Laiyemo for engaged and newly married couples building their foundation.",
};

export default function PremaritalPage() {
  return <OfferingPage offering={offering} />;
}
