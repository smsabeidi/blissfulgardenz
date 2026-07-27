import type { ReactNode } from "react";

// The rhythm primitive for every member page. One component so that vertical
// spacing, heading size, and reading measure are decided once instead of being
// re-guessed per page.
//
// Composition note: sections are meant to be stacked as siblings inside a
// wrapper with `divide-y divide-hairline`. That draws the rules between them
// without any section needing to know whether it is first or last.

type MemberSectionProps = {
  /** Optional: a page-opening section is often just a heading and a lede. */
  children?: ReactNode;
  title?: string;
  lede?: string;
  /** The first section on a page passes "h1"; everything else keeps the default. */
  as?: "h1" | "h2";
  /** "reading" clamps to a comfortable prose measure. "wide" fills the layout container. */
  width?: "reading" | "wide";
  /** One quiet link, placed opposite the title. Never a cluster of buttons. */
  action?: ReactNode;
  id?: string;
  className?: string;
};

export function MemberSection({
  children,
  title,
  lede,
  as = "h2",
  width = "wide",
  action,
  id,
  className = "",
}: MemberSectionProps) {
  const Heading = as;
  const hasHeader = Boolean(title || action || lede);

  return (
    <section
      id={id}
      className={`py-12 lg:py-16 ${width === "reading" ? "max-w-[68ch]" : ""} ${className}`}
    >
      {hasHeader ? (
        <div className="flex flex-col gap-3">
          {title || action ? (
            <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
              {title ? (
                <Heading className={as === "h1" ? "text-display text-balance" : "text-display-sm"}>
                  {title}
                </Heading>
              ) : (
                <span />
              )}
              {action ? <div className="shrink-0 text-[14px]">{action}</div> : null}
            </div>
          ) : null}
          {lede ? <p className="text-lede max-w-[62ch]">{lede}</p> : null}
        </div>
      ) : null}
      <div className={hasHeader ? "mt-8" : ""}>{children}</div>
    </section>
  );
}
