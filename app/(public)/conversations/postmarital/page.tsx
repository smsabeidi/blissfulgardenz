import type { Metadata } from "next";
import { OfferingPage } from "@/components/conversations/offering-page";
import { offerings } from "@/content/offerings";

// The Rebuilding path (design rulings D11/D12): the human-facing label is
// always "Rebuilding"; the route slug alone keeps the PRD's taxonomy.

const offering = offerings.find((o) => o.slug === "postmarital")!;

export const metadata: Metadata = {
  title: "Rebuilding",
  description:
    "A quieter way in. You may come alone: private, confidential harmony conversations with Dr. Laiyemo for strained seasons, one person or two.",
};

export default function RebuildingPage() {
  return <OfferingPage offering={offering} />;
}
