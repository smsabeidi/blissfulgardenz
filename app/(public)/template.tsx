// Remounts on every navigation: the arriving page rises out of soft focus
// while the Horizon Line's transition role sweeps a gold hairline across the
// top of the viewport (DESIGN.md motion inventory). Both are CSS one-shots,
// reduced-motion collapses them to instant via the global media block.
export default function PublicTemplate({ children }: { children: React.ReactNode }) {
  return (
    <div className="route-enter">
      <span aria-hidden className="route-sweep" />
      {children}
    </div>
  );
}
