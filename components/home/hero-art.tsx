// Hand-drawn botanical silhouette layers for the Dawn Hero. Drawn flora only
// (design ruling: no abstract blobs, no wave dividers). Colors ride the theme
// tokens so dusk mode re-lights the same garden.

export function SunDisc() {
  return (
    <svg aria-hidden viewBox="0 0 240 130" className="h-full w-full overflow-visible">
      <defs>
        <radialGradient id="sun-glow" cx="50%" cy="100%" r="70%">
          <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.38" />
          <stop offset="45%" stopColor="var(--gold)" stopOpacity="0.12" />
          <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
        </radialGradient>
        <clipPath id="sun-clip">
          <rect x="0" y="0" width="240" height="120" />
        </clipPath>
      </defs>
      <ellipse cx="120" cy="120" rx="120" ry="90" fill="url(#sun-glow)" />
      <circle cx="120" cy="120" r="46" fill="var(--gold)" clipPath="url(#sun-clip)" data-hero-sun />
    </svg>
  );
}

// Distant treeline and shrubs: soft, rounded canopies on a low hill.
export function FarFoliage() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 190"
      preserveAspectRatio="xMidYMax slice"
      className="h-full w-full"
    >
      <g fill="var(--sage)" opacity="0.38">
        <path d="M0 190v-60c60-10 90-34 140-36s80 18 130 16 90-30 140-28 85 22 135 20 95-26 145-24 80 18 130 16 90-24 140-22 85 20 130 18 95-26 150-22 70 16 100 20v102z" />
      </g>
      <g fill="var(--sage)" opacity="0.55">
        <ellipse cx="170" cy="150" rx="58" ry="30" />
        <ellipse cx="238" cy="160" rx="40" ry="22" />
        <rect x="166" y="150" width="7" height="40" rx="3" />
        <ellipse cx="1210" cy="146" rx="66" ry="34" />
        <ellipse cx="1290" cy="158" rx="44" ry="24" />
        <rect x="1206" y="150" width="7" height="40" rx="3" />
        <ellipse cx="620" cy="164" rx="46" ry="20" />
        <ellipse cx="900" cy="160" rx="52" ry="24" />
      </g>
      <path d="M0 190v-26c120-12 340-18 720-18s600 6 720 18v26z" fill="var(--sage)" opacity="0.5" />
    </svg>
  );
}

// Foreground grasses and leaning stems, anchored to the bottom edge.
export function ForegroundGrasses() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 220"
      preserveAspectRatio="xMidYMax slice"
      className="h-full w-full"
    >
      <g fill="none" stroke="var(--brand)" strokeWidth="3" strokeLinecap="round" opacity="0.9">
        <path d="M60 220C58 160 40 130 24 112" />
        <path d="M92 220c4-70-8-118 10-160" />
        <path d="M130 220c-6-56-2-96 22-128" />
        <path d="M1320 220c2-64 16-104 34-126" />
        <path d="M1360 220c-4-72 6-120-12-158" />
        <path d="M1288 220c6-52 0-92-24-120" />
        <path d="M710 220c-2-38-8-66-24-84" />
        <path d="M742 220c2-46 10-78 26-96" />
      </g>
      <g fill="var(--brand)" opacity="0.92">
        {/* Leaning leaf pairs on the tall stems */}
        <path d="M34 118c-16-10-26-26-24-44 18 4 28 20 30 40z" />
        <path d="M104 66c-2-20 6-36 20-46 6 18-2 34-14 46z" />
        <path d="M150 96c14-14 30-18 46-14-8 16-26 22-42 20z" />
        <path d="M1352 98c16-12 24-28 22-46-18 6-26 22-28 42z" />
        <path d="M1350 66c4-18-2-34-16-44-6 16 0 32 12 44z" />
        <path d="M1266 104c-14-12-30-16-46-10 10 16 28 20 44 16z" />
        <path d="M688 140c-12-10-18-24-16-40 14 4 20 18 20 36z" />
        <path d="M766 128c2-18 12-30 26-36 2 16-8 30-20 38z" />
      </g>
      {/* Low tuft band across the bottom */}
      <path
        d="M0 220v-24c50-8 80-20 120-18s70 14 110 12 80-18 120-16 75 12 115 12 85-16 125-14 70 12 110 12 85-16 125-14 75 12 115 12 80-16 120-14 70 12 105 14 55-6 75-8v46z"
        fill="var(--brand)"
        opacity="0.95"
      />
    </svg>
  );
}
