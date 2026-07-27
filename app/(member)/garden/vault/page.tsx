import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PetalCard } from "@/components/garden/primitives";
import { QuietButton } from "@/components/garden/buttons";
import { VaultList } from "@/components/member/vault-list";
import { getAccess } from "@/lib/access";

// The Resource Vault. Nothing in it is finished, and the page says so in the
// first paragraph a member reads. An empty shelf described honestly holds a
// membership; a shelf of dead download links loses one.

export const metadata: Metadata = {
  title: "The Resource Vault",
  robots: { index: false, follow: false },
};

function Shell({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-3xl px-5 py-12 sm:py-16 lg:px-8">{children}</div>;
}

export default async function VaultPage() {
  const access = await getAccess();

  if (!access.isMember) {
    return (
      <Shell>
        <h1 className="text-display">The Resource Vault</h1>
        <p className="text-lede mt-4 max-w-[55ch]">
          The Vault is part of The Inner Garden, and this account is not holding a seat right now. If
          you have joined and this looks wrong, write to us and we will put it right.
        </p>
        <div className="mt-8">
          <QuietButton href="/membership">See the membership</QuietButton>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <header className="flex flex-col gap-4">
        <h1 className="text-display">The Resource Vault</h1>
        <p className="text-lede max-w-[58ch]">
          The guides, workbooks, and book companions that belong to your membership, gathered in one
          place.
        </p>
      </header>

      <div className="mt-10">
        <PetalCard>
          <h2 className="text-display-sm">Where this stands today</h2>
          <div className="text-body mt-4 flex flex-col gap-4 text-ink-muted">
            <p>
              Nothing here is ready to download yet. We would rather tell you that plainly than hand
              you a link that goes nowhere. Every title below is being written by Dr. Laiyemo.
            </p>
            <p>
              The first conversation guides are expected within the opening months of the Garden. The
              workbooks follow, and the three book companions arrive alongside them. Each one is
              included in your membership at no further cost, and you will get a letter the day it
              lands.
            </p>
            <p>
              When a resource arrives it comes in two forms: a page you can read on your phone, and a
              PDF made to be printed and written on.
            </p>
          </div>
        </PetalCard>
      </div>

      <div className="mt-14">
        <VaultList />
      </div>
    </Shell>
  );
}
