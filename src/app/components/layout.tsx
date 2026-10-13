import { PageShell } from "@/components/interract/page-shell";
import { ComponentsSidebar } from "./_components/components-sidebar";

/**
 * Shared frame for the component index and every component page: a sticky
 * sidebar of types and categories on the left, content on the right. The
 * layout persists between pages, so the sidebar keeps its scroll and its
 * active marker slides from item to item.
 */
export default function ComponentsLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageShell className="max-w-7xl">
      <div className="lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
        <ComponentsSidebar />
        {/* section rules stop at the sidebar instead of running under it */}
        <div className="min-w-0 lg:[&_.section-rule]:left-0 lg:[&_.section-rule]:translate-x-0">
          {children}
        </div>
      </div>
    </PageShell>
  );
}
