import type { Metadata } from "next";
import { OfferingPage } from "@/components/conversations/offering-page";
import { offerings } from "@/content/offerings";

const offering = offerings.find((o) => o.slug === "marital")!;

export const metadata: Metadata = {
  title: "Marital Conversations",
  description:
    "A garden grows best when it is tended on purpose. Private 60-minute harmony conversations with Dr. Laiyemo for couples in every season of marriage.",
};

export default function MaritalPage() {
  return <OfferingPage offering={offering} />;
}
