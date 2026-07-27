import { DownloadSimple, Leaf } from "@phosphor-icons/react/dist/ssr";

// The Resource Vault, presented honestly.
//
// None of these files exist yet. Rather than render a download button that
// leads nowhere, or a greyed-out button that reads as "broken" instead of
// "unwritten", every item without a fileName carries a plain "in preparation"
// tag. The day a PDF lands in /public/vault, adding `fileName` to that item is
// the whole change: the tag becomes a download, nothing else moves.
//
// Print-friendly web versions are the eventual goal. Each item is expected to
// gain a /garden/vault/[slug] page that renders the guide as readable HTML with
// a print stylesheet, so the PDF becomes the offline copy rather than the only
// copy. The slug below is that future route's key, which is why every item has
// one now even though nothing links to it yet.

export type VaultKind = "guide" | "workbook" | "companion";

export type VaultItem = {
  title: string;
  description: string;
  kind: VaultKind;
  slug: string;
  /** Set only when the finished file is present in /public/vault. */
  fileName?: string;
};

export const vaultItems: VaultItem[] = [
  {
    kind: "guide",
    slug: "the-horizon-conversation",
    title: "The Horizon Conversation",
    description:
      "One seasonal conversation for comparing where each of you hopes to be a year from now.",
  },
  {
    kind: "guide",
    slug: "the-money-biography",
    title: "The Money Biography",
    description:
      "Questions that get underneath the numbers: what money meant in the house you grew up in.",
  },
  {
    kind: "guide",
    slug: "two-families-one-table",
    title: "Two Families, One Table",
    description:
      "Warm boundaries with parents, siblings, and traditions, agreed before a holiday decides for you.",
  },
  {
    kind: "guide",
    slug: "the-repair-conversation",
    title: "The Repair Conversation",
    description: "How to apologize plainly, and how to hear an apology when one is offered to you.",
  },
  {
    kind: "guide",
    slug: "rest-and-energy",
    title: "Rest and Energy",
    description:
      "A plain look at sleep, health, and how much of yourself is left for the people you love.",
  },
  {
    kind: "workbook",
    slug: "the-first-year-workbook",
    title: "The First Year Workbook",
    description: "Twelve short exercises for a first year of marriage, one for each month.",
  },
  {
    kind: "workbook",
    slug: "the-quiet-season-workbook",
    title: "The Quiet Season Workbook",
    description: "Pages to work through in a hard season, when warmth is difficult to find.",
  },
  {
    kind: "workbook",
    slug: "the-five-pillars-workbook",
    title: "The Five Pillars Workbook",
    description: "One page each for the physical, social, financial, mental, and emotional.",
  },
  {
    kind: "companion",
    slug: "companion-my-wife-or-my-childrens-mother",
    title: "Companion to Book One",
    description:
      "My Wife or My Children's Mother? Ray's question, turned gently toward your own life.",
  },
  {
    kind: "companion",
    slug: "companion-when-ladies-fight-back",
    title: "Companion to Book Two",
    description: "When Ladies Fight Back. What the second book raises, and what to do with it.",
  },
  {
    kind: "companion",
    slug: "companion-the-romantic-tragedy",
    title: "Companion to Book Three",
    description: "The Romantic Tragedy. Reading the last book slowly, with someone or alone.",
  },
];

const GROUPS: { kind: VaultKind; heading: string; note: string }[] = [
  {
    kind: "guide",
    heading: "Conversation guides",
    note: "Short guides, each built around holding one conversation well.",
  },
  {
    kind: "workbook",
    heading: "Workbooks",
    note: "Longer sets of exercises, to work through at whatever pace suits you.",
  },
  {
    kind: "companion",
    heading: "Book companions",
    note: "One companion for each book in the Three Guys Talking trilogy.",
  },
];

function InPreparation() {
  return (
    <span className="text-meta inline-flex min-h-11 items-center gap-2 rounded-full border border-hairline px-4 text-ink-muted">
      <Leaf aria-hidden weight="light" className="h-4 w-4 text-sage" />
      In preparation
    </span>
  );
}

function Download({ item }: { item: VaultItem }) {
  return (
    <a
      href={`/vault/${item.fileName}`}
      download
      className="text-meta inline-flex min-h-11 items-center gap-2 rounded-full border border-hairline px-4 text-ink transition-colors duration-200 hover:bg-raised motion-reduce:transition-none"
    >
      <DownloadSimple aria-hidden weight="light" className="h-4 w-4" />
      Download
      <span className="sr-only"> {item.title}, PDF</span>
    </a>
  );
}

export function VaultList({ items = vaultItems }: { items?: VaultItem[] }) {
  return (
    <div className="flex flex-col gap-14">
      {GROUPS.map((group) => {
        const groupItems = items.filter((item) => item.kind === group.kind);
        if (groupItems.length === 0) return null;

        return (
          <section key={group.kind} aria-labelledby={`vault-${group.kind}`}>
            <div className="flex flex-col gap-2">
              <h2 id={`vault-${group.kind}`} className="text-meta text-ink-muted">
                {group.heading}
              </h2>
              <p className="text-body max-w-[55ch] text-ink-muted">{group.note}</p>
            </div>

            <ul className="mt-7 flex flex-col">
              {groupItems.map((item) => (
                <li
                  key={item.slug}
                  className="flex flex-col gap-4 border-t border-hairline py-7 sm:flex-row sm:items-start sm:justify-between sm:gap-10"
                >
                  <div className="flex flex-col gap-2">
                    <h3 className="text-display-sm">{item.title}</h3>
                    <p className="text-body max-w-[52ch] text-ink-muted">{item.description}</p>
                  </div>
                  <div className="shrink-0">
                    {item.fileName ? <Download item={item} /> : <InPreparation />}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
