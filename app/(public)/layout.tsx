import { SiteHeader } from "@/components/garden/site-header";
import { SiteFooter } from "@/components/garden/site-footer";
import { HorizonProgress } from "@/components/garden/horizon-progress";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <SiteHeader />
      <HorizonProgress />
      <main id="main" className="w-full max-w-full flex-1 overflow-x-clip">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
