import Image from "next/image";
import type { ReactNode } from "react";
import { Reveal } from "@/components/garden/reveal";

// Slim photographic header band for the conversation pages: the chairs
// photograph (two chairs facing each other, the brand's conversation motif and
// the book-one cover image) cropped wide and graded into a deep green duotone
// with the poster technique: brand-color ground, luminosity-blended photo, and
// a bottom scrim so the page title always reads AA in both themes.
// The Rebuilding page (quiet) never renders this: private rooms stay
// undecorated by design.

const duotoneGround =
  "linear-gradient(140deg, var(--brand) 0%, color-mix(in srgb, var(--brand) 72%, var(--sage)) 58%, color-mix(in srgb, var(--brand) 58%, var(--gold)) 100%)";

const scrimFloor =
  "linear-gradient(to top, rgba(11, 21, 18, 0.72) 0%, rgba(11, 21, 18, 0.3) 55%, rgba(11, 21, 18, 0.16) 100%)";

export function ConversationPhotoBand({
  titleId,
  title,
  kicker,
}: {
  titleId: string;
  title: ReactNode;
  kicker?: ReactNode;
}) {
  return (
    <div className="relative flex min-h-60 items-end overflow-hidden" style={{ background: duotoneGround }}>
      <Image
        src="/images/photos/chairs.jpg"
        alt=""
        fill
        preload
        sizes="100vw"
        className="object-cover object-[50%_60%] mix-blend-luminosity opacity-40"
      />
      <div aria-hidden className="absolute inset-0" style={{ background: scrimFloor }} />
      <div className="relative mx-auto w-full max-w-7xl px-5 pb-8 pt-16 lg:px-8">
        <Reveal>
          <div className="flex flex-col gap-3">
            {kicker}
            <h1 id={titleId} className="text-display max-w-4xl text-balance text-[#F0EDE2]">
              {title}
            </h1>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
