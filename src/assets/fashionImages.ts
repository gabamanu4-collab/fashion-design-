/**
 * High-End Luxury Fashion Editorial Image Assets
 * Crafted vector photography and studio illustrations with rich textures,
 * drape curvatures, tailoring flats, moodboards, and runway staging.
 */

// Helper to convert SVG markup to clean base64 Data URI
function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// 1. Hero Atelier Studio — Haute couture silk drape on mannequin with atelier lighting
export const FASHION_HERO_ATELIER = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1A1816" />
      <stop offset="40%" stop-color="#262320" />
      <stop offset="80%" stop-color="#141311" />
      <stop offset="100%" stop-color="#0D0C0B" />
    </linearGradient>
    <radialGradient id="studio_light" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#FFF2DC" stop-opacity="0.32" />
      <stop offset="50%" stop-color="#E8D1B5" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="silk_gold" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#FBF3DE" />
      <stop offset="25%" stop-color="#DFCA9B" />
      <stop offset="50%" stop-color="#BFA169" />
      <stop offset="75%" stop-color="#8E713E" />
      <stop offset="100%" stop-color="#4E3B1C" />
    </linearGradient>
    <linearGradient id="fabric_shadow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1C160F" stop-opacity="0.9" />
      <stop offset="50%" stop-color="#4E3D2A" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#0E0B07" stop-opacity="0.95" />
    </linearGradient>
    <pattern id="linen_grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFFFFF" stroke-width="0.5" stroke-opacity="0.03" />
    </pattern>
  </defs>

  <!-- Studio Background -->
  <rect width="1200" height="800" fill="url(#bg_grad)" />
  <rect width="1200" height="800" fill="url(#linen_grid)" />
  <rect width="1200" height="800" fill="url(#studio_light)" />

  <!-- Studio Architecture: Window Shadows & Beams -->
  <path d="M 0 0 L 450 0 L 750 800 L 0 800 Z" fill="#FFF8EE" fill-opacity="0.02" />
  <line x1="250" y1="0" x2="600" y2="800" stroke="#E8D1B5" stroke-width="1" stroke-opacity="0.06" />
  <line x1="450" y1="0" x2="800" y2="800" stroke="#E8D1B5" stroke-width="1.5" stroke-opacity="0.08" />

  <!-- Atelier Moodboard in Background -->
  <g transform="translate(750, 100)" opacity="0.6">
    <rect x="0" y="0" width="360" height="260" fill="#201D1A" stroke="#3D3730" stroke-width="1.5" rx="4" />
    <text x="20" y="30" font-family="'Courier New', monospace" font-size="11" fill="#9C9286" letter-spacing="2">CONCEPT RESEARCH · PARIS</text>
    <line x1="20" y1="42" x2="340" y2="42" stroke="#3D3730" stroke-width="1" />
    <!-- Pinned Swatches -->
    <rect x="25" y="60" width="70" height="80" fill="#B45309" fill-opacity="0.8" rx="2" />
    <rect x="110" y="60" width="70" height="80" fill="#D4CEBE" rx="2" />
    <rect x="195" y="60" width="70" height="80" fill="#2A3B4C" rx="2" />
    <rect x="25" y="155" width="240" height="80" fill="#171513" stroke="#4A433A" stroke-dasharray="3 3" rx="2" />
    <!-- Sketches on board -->
    <path d="M 40 170 Q 70 190 90 220 M 130 170 Q 150 200 170 225" stroke="#A8A095" stroke-width="1.5" fill="none" opacity="0.7" />
  </g>

  <!-- Tailoring Drape Stand / Mannequin Core -->
  <g transform="translate(420, 120)">
    <!-- Stand Base and Pole -->
    <line x1="140" y1="580" x2="140" y2="680" stroke="#5E5549" stroke-width="6" stroke-linecap="round" />
    <circle cx="140" cy="670" r="45" fill="none" stroke="#7A6F5F" stroke-width="4" opacity="0.6" />
    <ellipse cx="140" cy="670" rx="60" ry="15" fill="#0F0D0B" opacity="0.8" />

    <!-- Dressmaker Mannequin Torso -->
    <path d="M 105 140 C 90 190 80 250 85 320 C 90 380 100 450 110 520 L 170 520 C 180 450 190 380 195 320 C 200 250 190 190 175 140 Z" fill="#2A2520" stroke="#3D362E" stroke-width="2" />
    <!-- Wooden Neck Cap -->
    <ellipse cx="140" cy="140" rx="35" ry="12" fill="#5E4E3A" stroke="#7A6850" stroke-width="2" />
    <path d="M 130 110 L 150 110 L 145 135 L 135 135 Z" fill="#7A6850" />
    <circle cx="140" cy="105" r="12" fill="#8C775D" />

    <!-- Sculptural Silk Gown Draping across Mannequin -->
    <path d="M 125 150 C 95 210 60 300 70 410 C 80 510 50 600 20 660 L 150 670 C 190 620 230 500 220 400 C 210 320 185 220 155 150 Z" fill="url(#silk_gold)" />
    <!-- Deep Drape Shadow Folds -->
    <path d="M 125 150 C 110 220 85 320 95 440 C 105 530 80 610 50 665 L 85 668 C 110 610 135 520 120 420 C 110 320 135 220 145 150 Z" fill="url(#fabric_shadow)" />
    <path d="M 140 220 C 160 310 180 430 210 590 L 175 600 C 150 440 135 320 125 220 Z" fill="url(#fabric_shadow)" opacity="0.6" />
    <!-- Highlight Shimmer Ridges -->
    <path d="M 130 160 C 105 240 80 340 90 450 C 95 530 75 600 45 650" stroke="#FFF5E0" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.65" />
    <path d="M 145 180 C 170 260 195 380 185 490" stroke="#FFF5E0" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.5" />

    <!-- Sculptural Architectural Peplum / Wing -->
    <path d="M 185 300 C 260 270 330 330 310 420 C 290 490 220 480 180 440 Z" fill="url(#silk_gold)" stroke="#5A4523" stroke-width="1.5" />
    <path d="M 185 300 C 240 310 280 360 260 420 C 240 460 200 450 180 440 Z" fill="url(#fabric_shadow)" opacity="0.4" />
    <path d="M 200 320 Q 280 340 270 410" stroke="#FFF5E0" stroke-width="2" fill="none" opacity="0.7" />

    <!-- Atelier Tailor Chalk Marks (Subtle White Hashes) -->
    <path d="M 100 280 L 115 285 M 102 330 L 118 335 M 105 380 L 122 385" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" opacity="0.8" />
    <!-- Measuring Tape draped casually across shoulder -->
    <path d="M 105 145 C 135 170 145 220 140 290 C 135 360 150 420 160 470" stroke="#E2C968" stroke-width="4" stroke-linecap="round" fill="none" stroke-dasharray="1 3" />
  </g>

  <!-- Foreground Atmospheric Vignette and Floor Specular -->
  <ellipse cx="600" cy="790" rx="550" ry="90" fill="#000000" fill-opacity="0.7" />
  <text x="60" y="740" font-family="'Times New Roman', serif" font-style="italic" font-size="28" fill="#E8DEC8" letter-spacing="3">
    ATELIER DE HAUTE COUTURE · SILHOUETTE N° 07
  </text>
  <text x="60" y="765" font-family="'Courier New', monospace" font-size="11" fill="#8C8172" letter-spacing="2">
    DRAPING STUDY · SILK DUPIONI &amp; WOOL ORGANZA
  </text>
</svg>
`);

// 2. Lookbook Sculptural Wool Coat — High-contrast luxury fashion plate
export const FASHION_LOOKBOOK_COAT = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1066" width="100%" height="100%">
  <defs>
    <linearGradient id="coat_bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#EFECE6" />
      <stop offset="50%" stop-color="#DFD9CE" />
      <stop offset="100%" stop-color="#CCC5B8" />
    </linearGradient>
    <linearGradient id="wool_black" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2B2825" />
      <stop offset="50%" stop-color="#141312" />
      <stop offset="100%" stop-color="#080706" />
    </linearGradient>
    <linearGradient id="lapel_highlight" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#4A453F" />
      <stop offset="100%" stop-color="#141312" />
    </linearGradient>
  </defs>

  <!-- Clean Editorial Background -->
  <rect width="800" height="1066" fill="url(#coat_bg)" />

  <!-- Architectural Studio Shadow -->
  <polygon points="50,0 280,0 450,1066 120,1066" fill="#000000" fill-opacity="0.04" />
  <ellipse cx="400" cy="980" rx="280" ry="30" fill="#000000" fill-opacity="0.22" />

  <!-- Model & Sculptural Garment Silhouette -->
  <g transform="translate(180, 100)">
    <!-- Model Head / Stylized Editorial Silhouette -->
    <ellipse cx="220" cy="110" rx="38" ry="50" fill="#201C18" />
    <path d="M 210 155 L 230 155 L 235 210 L 205 210 Z" fill="#201C18" />

    <!-- Oversized Architectural Structured Wool Coat -->
    <!-- Broad Pagoda Shoulder line -->
    <path d="M 60 210 C 130 190 310 190 380 210 L 410 270 C 420 370 410 520 430 750 C 440 850 420 900 400 920 L 40 920 C 20 900 0 850 10 750 C 30 520 20 370 30 270 Z" fill="url(#wool_black)" />

    <!-- Exaggerated High Shawl Lapel Structure -->
    <path d="M 220 200 L 140 450 L 220 620 L 300 450 Z" fill="url(#lapel_highlight)" />
    <!-- Asymmetric Fold -->
    <path d="M 140 450 L 220 620 L 220 920 L 110 920 C 100 780 120 580 140 450 Z" fill="#1B1917" />
    <path d="M 300 450 L 220 620 L 220 920 L 330 920 C 340 780 320 580 300 450 Z" fill="#0C0B0A" />

    <!-- Razor-sharp Tailoring Seam Lines -->
    <line x1="220" y1="200" x2="220" y2="920" stroke="#3D3730" stroke-width="1.5" />
    <line x1="140" y1="450" x2="60" y2="210" stroke="#5E544A" stroke-width="1.5" />
    <line x1="300" y1="450" x2="380" y2="210" stroke="#5E544A" stroke-width="1.5" />

    <!-- Structural Waist Belt with Monolithic Brass Buckle -->
    <rect x="130" y="520" width="180" height="32" fill="#11100F" />
    <rect x="200" y="514" width="40" height="44" fill="none" stroke="#D1B87D" stroke-width="5" rx="3" />
    <rect x="217" y="516" width="6" height="40" fill="#D1B87D" />

    <!-- Slanted Welt Pocket Details -->
    <line x1="90" y1="640" x2="150" y2="670" stroke="#423C34" stroke-width="4" stroke-linecap="round" />
    <line x1="350" y1="640" x2="290" y2="670" stroke="#423C34" stroke-width="4" stroke-linecap="round" />

    <!-- Specular Wool Sheen Highlights -->
    <path d="M 75 220 Q 140 205 210 210" stroke="#6E6254" stroke-width="2" fill="none" opacity="0.6" />
    <path d="M 365 220 Q 300 205 230 210" stroke="#6E6254" stroke-width="2" fill="none" opacity="0.6" />
  </g>

  <!-- Editorial Typography Plating -->
  <text x="60" y="90" font-family="'Times New Roman', serif" font-size="22" font-weight="bold" fill="#1C1814" letter-spacing="4">
    COLLECTION 01 · STRUCTURE &amp; MASS
  </text>
  <text x="60" y="115" font-family="'Courier New', monospace" font-size="11" fill="#786E62" letter-spacing="2">
    LOOK 04 · DOUBLE-FACED MELTON WOOL TRENCH
  </text>
  <text x="740" y="1010" text-anchor="end" font-family="'Courier New', monospace" font-size="10" fill="#786E62" letter-spacing="3">
    FD RUNWAY ARCHIVE
  </text>
</svg>
`);

// 3. Technical Design Flats — CAD pattern drafting & garment specifications
export const FASHION_TECHNICAL_FLATS = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 750" width="100%" height="100%">
  <defs>
    <pattern id="grid_pattern" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E5E0D5" stroke-width="0.75" />
    </pattern>
  </defs>

  <!-- Technical drafting paper background -->
  <rect width="1000" height="750" fill="#FAF8F5" />
  <rect width="1000" height="750" fill="url(#grid_pattern)" />

  <!-- Specification Sheet Header -->
  <rect x="40" y="40" width="920" height="60" fill="#FFFFFF" stroke="#DCD7CD" stroke-width="1.5" rx="4" />
  <text x="60" y="75" font-family="'Courier New', monospace" font-size="15" font-weight="bold" fill="#141210" letter-spacing="2">
    TECH PACK: ASYMMETRIC TAILORED BLAZER · STYLE NO. FD-2026-08
  </text>
  <text x="60" y="92" font-family="'Courier New', monospace" font-size="10" fill="#78716A" letter-spacing="1">
    FABRICATION: 100% VIRGIN WOOL TWILL (340 GSM) · COLOR: NOIR CHARCOAL · SIZES: 36 - 44
  </text>
  <text x="830" y="75" font-family="'Courier New', monospace" font-size="11" fill="#141210">REV. 03</text>

  <!-- Flat 1: Front Elevation -->
  <g transform="translate(140, 160)">
    <text x="140" y="-15" text-anchor="middle" font-family="'Courier New', monospace" font-size="11" font-weight="bold" fill="#4A453E" letter-spacing="2">
      FRONT ELEVATION
    </text>

    <!-- Blazer Body Outline -->
    <path d="M 60 40 L 110 20 L 170 20 L 220 40 L 260 90 L 245 280 L 230 400 L 50 400 L 35 280 L 20 90 Z" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="2" />
    
    <!-- Sleeves -->
    <path d="M 20 90 L 0 320 L 35 325 L 55 130" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="1.8" />
    <path d="M 260 90 L 280 320 L 245 325 L 225 130" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="1.8" />
    <!-- Sleeve Cuff Stitching -->
    <line x1="2" y1="310" x2="33" y2="315" stroke="#1A1A1A" stroke-width="1" stroke-dasharray="2 2" />
    <line x1="247" y1="315" x2="278" y2="310" stroke="#1A1A1A" stroke-width="1" stroke-dasharray="2 2" />

    <!-- Lapel & Collar -->
    <path d="M 110 20 L 140 60 L 170 20" fill="none" stroke="#1A1A1A" stroke-width="2" />
    <path d="M 110 20 L 90 90 L 140 180" fill="#F4F1EA" stroke="#1A1A1A" stroke-width="1.8" />
    <path d="M 170 20 L 190 90 L 140 180" fill="#F4F1EA" stroke="#1A1A1A" stroke-width="1.8" />

    <!-- Front Closure & Buttons -->
    <line x1="140" y1="180" x2="140" y2="400" stroke="#1A1A1A" stroke-width="1.8" />
    <circle cx="140" cy="220" r="4" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="1.5" />
    <circle cx="140" cy="270" r="4" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="1.5" />
    <circle cx="140" cy="320" r="4" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="1.5" />

    <!-- Princess Seams & Darts -->
    <path d="M 90 130 Q 95 240 90 400" fill="none" stroke="#1A1A1A" stroke-width="1" stroke-dasharray="3 2" />
    <path d="M 190 130 Q 185 240 190 400" fill="none" stroke="#1A1A1A" stroke-width="1" stroke-dasharray="3 2" />

    <!-- Flap Pockets -->
    <rect x="65" y="290" width="55" height="18" fill="#F4F1EA" stroke="#1A1A1A" stroke-width="1.5" />
    <rect x="160" y="290" width="55" height="18" fill="#F4F1EA" stroke="#1A1A1A" stroke-width="1.5" />

    <!-- Chest Welt Pocket -->
    <line x1="80" y1="140" x2="115" y2="135" stroke="#1A1A1A" stroke-width="3" />

    <!-- Dimension Annotation Callout -->
    <line x1="-30" y1="40" x2="-30" y2="400" stroke="#8C8172" stroke-width="1" marker-start="url(#dot)" />
    <line x1="-35" y1="40" x2="-25" y2="40" stroke="#8C8172" stroke-width="1" />
    <line x1="-35" y1="400" x2="-25" y2="400" stroke="#8C8172" stroke-width="1" />
    <text x="-40" y="225" text-anchor="end" font-family="'Courier New', monospace" font-size="9" fill="#786E62">76.0 CM</text>
  </g>

  <!-- Flat 2: Back Elevation -->
  <g transform="translate(580, 160)">
    <text x="140" y="-15" text-anchor="middle" font-family="'Courier New', monospace" font-size="11" font-weight="bold" fill="#4A453E" letter-spacing="2">
      BACK ELEVATION
    </text>

    <!-- Blazer Back Outline -->
    <path d="M 60 40 L 110 20 L 170 20 L 220 40 L 260 90 L 245 280 L 230 400 L 50 400 L 35 280 L 20 90 Z" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="2" />
    
    <!-- Sleeves -->
    <path d="M 20 90 L 0 320 L 35 325 L 55 130" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="1.8" />
    <path d="M 260 90 L 280 320 L 245 325 L 225 130" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="1.8" />

    <!-- Collar Stand -->
    <path d="M 110 20 Q 140 28 170 20" fill="none" stroke="#1A1A1A" stroke-width="2" />

    <!-- Center Back Seam with Vent -->
    <line x1="140" y1="24" x2="140" y2="400" stroke="#1A1A1A" stroke-width="1.5" />
    <!-- Double Vent -->
    <line x1="90" y1="310" x2="90" y2="400" stroke="#1A1A1A" stroke-width="1.5" />
    <line x1="190" y1="310" x2="190" y2="400" stroke="#1A1A1A" stroke-width="1.5" />

    <!-- Back Shoulder Darts -->
    <line x1="100" y1="40" x2="105" y2="85" stroke="#1A1A1A" stroke-width="1" stroke-dasharray="3 2" />
    <line x1="180" y1="40" x2="175" y2="85" stroke="#1A1A1A" stroke-width="1" stroke-dasharray="3 2" />

    <!-- Hem Stitching -->
    <line x1="50" y1="390" x2="230" y2="390" stroke="#1A1A1A" stroke-width="1" stroke-dasharray="2 2" />
  </g>

  <!-- Technical Construction Notes Footer -->
  <g transform="translate(40, 620)">
    <rect x="0" y="0" width="920" height="90" fill="#FFFFFF" stroke="#DCD7CD" stroke-width="1.5" rx="4" />
    <text x="25" y="26" font-family="'Courier New', monospace" font-size="11" font-weight="bold" fill="#141210">CONSTRUCTION CALLOUTS &amp; FINISHES:</text>
    <text x="25" y="46" font-family="'Courier New', monospace" font-size="10" fill="#57524A">
      1. CANVASSING: Full floating chest canvas with horsehair interlining pad-stitched by hand.
    </text>
    <text x="25" y="62" font-family="'Courier New', monospace" font-size="10" fill="#57524A">
      2. BUTTONHOLES: Milanese keyhole stitch with silk gimp thread. Real horn buttons (28L).
    </text>
    <text x="25" y="78" font-family="'Courier New', monospace" font-size="10" fill="#57524A">
      3. SEAM ALLOWANCES: 1.5 cm throughout; 4.0 cm turn-up at sleeve hems and jacket lower edge.
    </text>
  </g>
</svg>
`);

// 4. Avant-Garde Sculptural Wearable Art — Pleated architectural form
export const FASHION_AVANT_GARDE = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="100%" height="100%">
  <defs>
    <linearGradient id="avant_bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F0F10" />
      <stop offset="60%" stop-color="#1B1B1E" />
      <stop offset="100%" stop-color="#050506" />
    </linearGradient>
    <linearGradient id="pleat_silver" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E8E8EC" />
      <stop offset="40%" stop-color="#A5A5AF" />
      <stop offset="70%" stop-color="#5B5B65" />
      <stop offset="100%" stop-color="#232328" />
    </linearGradient>
    <linearGradient id="neon_accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#C5A880" />
      <stop offset="100%" stop-color="#F2E6D0" />
    </linearGradient>
  </defs>

  <rect width="800" height="1000" fill="url(#avant_bg)" />

  <!-- Dramatic Runway Spotlight Cone -->
  <polygon points="400,0 200,1000 600,1000" fill="#FFFFFF" fill-opacity="0.04" />
  <circle cx="400" cy="180" r="160" fill="#FFFFFF" fill-opacity="0.03" filter="blur(20px)" />

  <!-- Sculptural Pleated Structure Radiating from Torso -->
  <g transform="translate(400, 480)">
    <!-- Radiating Accordion / Origami Pleats -->
    <path d="M 0 -220 L -60 -180 L 0 -130 L 60 -180 Z" fill="url(#pleat_silver)" />
    <path d="M -60 -180 L -140 -120 L -80 -70 L 0 -130 Z" fill="#757580" />
    <path d="M 60 -180 L 140 -120 L 80 -70 L 0 -130 Z" fill="#9595A2" />
    <path d="M -140 -120 L -230 -40 L -160 20 L -80 -70 Z" fill="url(#pleat_silver)" />
    <path d="M 140 -120 L 230 -40 L 160 20 L 80 -70 Z" fill="#585862" />

    <!-- Mid-Torso Kinetic Fan Structure -->
    <path d="M -230 -40 L -310 80 L -210 130 L -160 20 Z" fill="#3D3D45" />
    <path d="M 230 -40 L 310 80 L 210 130 L 160 20 Z" fill="url(#pleat_silver)" />
    <path d="M -310 80 L -280 240 L -170 230 L -210 130 Z" fill="url(#pleat_silver)" />
    <path d="M 310 80 L 280 240 L 170 230 L 210 130 Z" fill="#4B4B55" />

    <!-- Cascading Lower Column -->
    <path d="M -170 230 L -220 420 L -90 440 L -50 240 Z" fill="#888894" />
    <path d="M 170 230 L 220 420 L 90 440 L 50 240 Z" fill="url(#pleat_silver)" />
    <path d="M -50 240 L -90 440 L 0 460 L 50 240 Z" fill="#2E2E35" />

    <!-- Sharp Metallic Edge Tracing -->
    <line x1="-310" y1="80" x2="-280" y2="240" stroke="#E8DEC8" stroke-width="2" />
    <line x1="310" y1="80" x2="280" y2="240" stroke="#E8DEC8" stroke-width="2" />
    <line x1="0" y1="-220" x2="-230" y2="-40" stroke="#FFF2DC" stroke-width="2.5" />
    <line x1="0" y1="-220" x2="230" y2="-40" stroke="#FFF2DC" stroke-width="2.5" />

    <!-- Central Sculptural Collar -->
    <ellipse cx="0" cy="-210" rx="30" ry="12" fill="none" stroke="#E8DEC8" stroke-width="4" />
    <!-- Model Head Abstract Silhouette -->
    <ellipse cx="0" cy="-260" rx="28" ry="38" fill="#141416" stroke="#44444C" stroke-width="1.5" />
  </g>

  <!-- Editorial Metadata Caption -->
  <text x="50" y="80" font-family="'Times New Roman', serif" font-size="24" font-style="italic" fill="#FAF9F6" letter-spacing="4">
    KINETIC ORGANZA · SCULPTURAL STUDY
  </text>
  <text x="50" y="105" font-family="'Courier New', monospace" font-size="11" fill="#9C9588" letter-spacing="2">
    AVANT-GARDE &amp; WEARABLE ART EXHIBITION · MILAN 2026
  </text>
</svg>
`);

// 5. Concept Research & Textile Swatch Moodboard
export const FASHION_MOODBOARD = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 700" width="100%" height="100%">
  <defs>
    <linearGradient id="board_bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F4F1EA" />
      <stop offset="100%" stop-color="#E7E2D6" />
    </linearGradient>
    <pattern id="herringbone" width="30" height="30" patternUnits="userSpaceOnUse">
      <path d="M 0 0 L 15 15 L 0 30 M 15 0 L 30 15 L 15 30" fill="none" stroke="#7A6F5F" stroke-width="1.5" opacity="0.4" />
    </pattern>
  </defs>

  <rect width="1000" height="700" fill="url(#board_bg)" />

  <!-- Frame Title -->
  <text x="50" y="60" font-family="'Times New Roman', serif" font-size="24" font-weight="bold" fill="#1C1814" letter-spacing="3">
    ARCHIVAL CONCEPT BOARD: TERRACOTTA &amp; STRUCTURAL SILK
  </text>
  <text x="50" y="82" font-family="'Courier New', monospace" font-size="11" fill="#786E62" letter-spacing="2">
    FABRIC SWATCHES · BOTANICAL DYES · ATHENIAN ARCHITECTURAL FRAGMENTS
  </text>

  <!-- Card 1: Botanical Terracotta Dye Swatch with frayed edges -->
  <g transform="translate(60, 120)">
    <rect x="0" y="0" width="260" height="320" fill="#C25E38" rx="2" stroke="#A84C27" stroke-width="1.5" />
    <rect x="15" y="15" width="230" height="250" fill="#A84C27" opacity="0.25" />
    <!-- Texture weave lines -->
    <line x1="20" y1="40" x2="240" y2="40" stroke="#FFFFFF" stroke-width="0.5" stroke-opacity="0.3" stroke-dasharray="2 3" />
    <line x1="20" y1="80" x2="240" y2="80" stroke="#FFFFFF" stroke-width="0.5" stroke-opacity="0.3" stroke-dasharray="2 3" />
    <line x1="20" y1="120" x2="240" y2="120" stroke="#FFFFFF" stroke-width="0.5" stroke-opacity="0.3" stroke-dasharray="2 3" />
    <!-- Pin at top -->
    <circle cx="130" cy="10" r="6" fill="#D1B87D" stroke="#5E4E3A" stroke-width="1" />
    <text x="20" y="300" font-family="'Courier New', monospace" font-size="10" fill="#FAF9F6">SWATCH A-01: MADONNA TERRACOTTA</text>
  </g>

  <!-- Card 2: Handwoven Herringbone Textile Sample -->
  <g transform="translate(360, 120)">
    <rect x="0" y="0" width="280" height="360" fill="#DDD7CB" stroke="#B8B0A2" stroke-width="1.5" rx="2" />
    <rect x="0" y="0" width="280" height="360" fill="url(#herringbone)" />
    <!-- Masked swatch frame -->
    <rect x="15" y="15" width="250" height="300" fill="none" stroke="#4A4338" stroke-width="1" />
    <circle cx="140" cy="10" r="6" fill="#D1B87D" stroke="#5E4E3A" stroke-width="1" />
    <text x="25" y="340" font-family="'Courier New', monospace" font-size="10" fill="#3D372E">SWATCH B-04: RAW WOOL HERRINGBONE (380 GSM)</text>
  </g>

  <!-- Card 3: Croquis Gesture Sketch -->
  <g transform="translate(680, 120)">
    <rect x="0" y="0" width="260" height="380" fill="#FFFFFF" stroke="#DCD7CD" stroke-width="1.5" rx="2" />
    <circle cx="130" cy="10" r="6" fill="#A84C27" stroke="#5E4E3A" stroke-width="1" />
    <!-- Fluid gestural brush stroke figure -->
    <path d="M 130 50 C 130 75 140 85 130 95 C 115 110 80 140 100 200 C 115 240 100 300 135 340 M 130 95 C 150 115 170 160 160 210 C 150 250 165 310 140 340" stroke="#1A1816" stroke-width="3" stroke-linecap="round" fill="none" />
    <!-- Wash of color -->
    <path d="M 105 130 Q 150 140 140 220 Q 110 240 105 130 Z" fill="#C25E38" fill-opacity="0.3" />
    <text x="20" y="365" font-family="'Times New Roman', serif" font-style="italic" font-size="13" fill="#1A1816">Atelier Croquis · Proportion 1:10</text>
  </g>

  <!-- Palette Chips along the bottom -->
  <g transform="translate(60, 480)">
    <text x="0" y="30" font-family="'Courier New', monospace" font-size="11" font-weight="bold" fill="#3D372E" letter-spacing="1">COLLECTION COLOR HARMONY:</text>
    <rect x="0" y="45" width="80" height="60" fill="#C25E38" rx="3" />
    <rect x="95" y="45" width="80" height="60" fill="#2A2624" rx="3" />
    <rect x="190" y="45" width="80" height="60" fill="#E8DEC8" rx="3" />
    <rect x="285" y="45" width="80" height="60" fill="#6E6254" rx="3" />
    <rect x="380" y="45" width="80" height="60" fill="#A8B4A5" rx="3" />
    <text x="0" y="125" font-family="'Courier New', monospace" font-size="9" fill="#786E62">#C25E38 · TERRA</text>
    <text x="95" y="125" font-family="'Courier New', monospace" font-size="9" fill="#786E62">#2A2624 · CHARCOAL</text>
    <text x="190" y="125" font-family="'Courier New', monospace" font-size="9" fill="#786E62">#E8DEC8 · ALABASTER</text>
    <text x="285" y="125" font-family="'Courier New', monospace" font-size="9" fill="#786E62">#6E6254 · TAUPE</text>
    <text x="380" y="125" font-family="'Courier New', monospace" font-size="9" fill="#786E62">#A8B4A5 · SAGE WEAVE</text>
  </g>
</svg>
`);

// 6. Designer Portrait — Luxury Monochrome Atelier Headshot
export const FASHION_DESIGNER_PORTRAIT = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <radialGradient id="portrait_light" cx="45%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#FAF8F5" />
      <stop offset="60%" stop-color="#E2DDD5" />
      <stop offset="100%" stop-color="#C2BAB0" />
    </radialGradient>
    <linearGradient id="turtleneck" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#24211E" />
      <stop offset="100%" stop-color="#11100F" />
    </linearGradient>
  </defs>

  <rect width="500" height="500" fill="url(#portrait_light)" />

  <!-- Designer Figure in Black Turtleneck -->
  <!-- Shoulders -->
  <path d="M 50 500 C 70 380 130 330 200 310 L 300 310 C 370 330 430 380 450 500 Z" fill="url(#turtleneck)" />
  <!-- Turtleneck Collar -->
  <rect x="200" y="270" width="100" height="50" rx="10" fill="#1C1A18" />
  <!-- Neck -->
  <rect x="215" y="240" width="70" height="40" fill="#DFC9B2" />

  <!-- Head Contour -->
  <ellipse cx="250" cy="180" rx="70" ry="90" fill="#EDD9C5" />
  <!-- Sculpted Jaw Shadow -->
  <path d="M 195 210 Q 250 270 305 210 Q 250 250 195 210 Z" fill="#C9AF96" opacity="0.6" />

  <!-- Hair / Minimalist Sculpted Cut -->
  <path d="M 170 170 C 165 90 220 70 250 70 C 290 70 340 90 330 170 C 320 120 280 110 250 110 C 210 110 180 130 170 170 Z" fill="#24211E" />

  <!-- Minimalist Eyes / Contemplative Gaze -->
  <ellipse cx="225" cy="175" rx="10" ry="4" fill="#3D3227" />
  <ellipse cx="275" cy="175" rx="10" ry="4" fill="#3D3227" />
  <line x1="210" y1="162" x2="238" y2="164" stroke="#24211E" stroke-width="2.5" stroke-linecap="round" />
  <line x1="262" y1="164" x2="290" y2="162" stroke="#24211E" stroke-width="2.5" stroke-linecap="round" />

  <!-- Nose & Lips -->
  <line x1="250" y1="175" x2="248" y2="205" stroke="#B89B82" stroke-width="2" stroke-linecap="round" />
  <line x1="242" y1="205" x2="256" y2="205" stroke="#B89B82" stroke-width="1.5" />
  <path d="M 235 224 Q 250 220 265 224" stroke="#9E7660" stroke-width="2.5" stroke-linecap="round" />

  <!-- Frame & Border Accent -->
  <rect x="20" y="20" width="460" height="460" fill="none" stroke="#A89F94" stroke-width="1" stroke-opacity="0.5" />
  <text x="35" y="465" font-family="'Courier New', monospace" font-size="9" fill="#786E62" letter-spacing="2">
    CAMILLE LAURENT · HEAD ATELIER
  </text>
</svg>
`);

// 7. Evening Gown Runway Catwalk
export const FASHION_RUNWAY_GOWN = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" width="100%" height="100%">
  <defs>
    <linearGradient id="runway_bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#080706" />
      <stop offset="70%" stop-color="#141210" />
      <stop offset="100%" stop-color="#24201B" />
    </linearGradient>
    <linearGradient id="chiffon_burgundy" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#881337" />
      <stop offset="50%" stop-color="#4C0519" />
      <stop offset="100%" stop-color="#1E0209" />
    </linearGradient>
  </defs>

  <rect width="800" height="1100" fill="url(#runway_bg)" />

  <!-- Runway Overhead Follow-Spot Light Cone -->
  <polygon points="400,0 120,1100 680,1100" fill="#FFF5E6" fill-opacity="0.06" />
  <ellipse cx="400" cy="1020" rx="260" ry="40" fill="#FFF5E6" fill-opacity="0.12" />

  <!-- Model & Floating Haute Couture Chiffon Gown -->
  <g transform="translate(220, 150)">
    <!-- Runway Model Figure -->
    <ellipse cx="180" cy="100" rx="30" ry="42" fill="#141210" />
    <!-- Strapless Bodice -->
    <path d="M 140 180 C 130 240 135 290 145 340 L 215 340 C 225 290 230 240 220 180 Z" fill="#4C0519" stroke="#881337" stroke-width="1.5" />

    <!-- Billowing Dramatic Multi-Layered Chiffon Train -->
    <path d="M 145 340 C 90 420 10 550 -40 750 C -70 870 -80 930 -100 950 L 460 950 C 440 920 420 860 380 750 C 330 610 260 450 215 340 Z" fill="url(#chiffon_burgundy)" />

    <!-- Translucent Overlay Swirls -->
    <path d="M 170 340 C 80 470 -20 620 40 820 C 80 910 180 940 240 950 C 190 850 140 700 170 540 Z" fill="#9F1239" fill-opacity="0.4" />
    <path d="M 190 340 C 260 470 360 620 320 820 C 290 900 230 940 190 950 C 230 840 260 690 210 520 Z" fill="#BE123C" fill-opacity="0.3" />

    <!-- Rim Light on Floating Fabric -->
    <path d="M -40 750 Q 80 880 240 950" stroke="#FECDD3" stroke-width="2" fill="none" opacity="0.6" />
    <path d="M 380 750 Q 300 880 240 950" stroke="#FECDD3" stroke-width="1.5" fill="none" opacity="0.5" />
  </g>

  <!-- Stage Lights & Audience Depth -->
  <line x1="0" y1="1020" x2="800" y2="1020" stroke="#5E5345" stroke-width="1" stroke-dasharray="8 8" opacity="0.4" />
  <text x="50" y="80" font-family="'Times New Roman', serif" font-size="22" font-style="italic" fill="#FAF9F6" letter-spacing="4">
    PARIS FASHION WEEK · HAUTE COUTURE 2026
  </text>
  <text x="50" y="105" font-family="'Courier New', monospace" font-size="11" fill="#9C9588" letter-spacing="2">
    CRIMSON FLUIDITY · LOOK 18 BY ATELIER LAURENT
  </text>
</svg>
`);

// ==============================================================================
// REAL EDITORIAL FASHION PHOTOGRAPHY ASSETS (HIGH-RESOLUTION VERIFIED CDNS)
// ==============================================================================

export const PHOTO_HERO_ATELIER =
  'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=85&w=1600';

export const PHOTO_RUNWAY_EDITORIAL =
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=85&w=1200';

export const PHOTO_TEXTILE_DRAPERY =
  'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=85&w=1200';

export const PHOTO_TAILORING_WORKSPACE =
  'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=85&w=1200';

export const PHOTO_AVANT_GARDE_COUTURE =
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=85&w=1200';

export const PHOTO_DESIGNER_PORTRAIT_1 =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=85&w=1000';

export const PHOTO_DESIGNER_PORTRAIT_2 =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=85&w=1000';

export const PHOTO_PFW_RUNWAY_BURGUNDY =
  'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&q=85&w=1200';

export const PHOTO_MODERN_TAILORING =
  'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=85&w=1200';

export const PHOTO_MOODBOARD_FABRICS =
  'https://images.unsplash.com/photo-1607344645866-009c320b5ab8?auto=format&fit=crop&q=85&w=1200';

export const PHOTO_COUTURE_SILHOUETTE =
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=85&w=1200';

export interface FashionGalleryItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  type: 'photography' | 'flat' | 'moodboard' | 'spec';
  imageUrl: string;
  fallbackSvg: string;
  designer: string;
  atelierNotes: string;
  aspectRatio: '3:4' | '1:1' | '16:9' | '4:3';
  fabrication?: string;
  season?: string;
}

export const FASHION_GALLERY_ITEMS: FashionGalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Haute Couture Silk Drape Atelier',
    subtitle: 'Maison de l’Ombre · Silhouette N° 07',
    category: 'Haute Couture',
    type: 'photography',
    imageUrl: PHOTO_HERO_ATELIER,
    fallbackSvg: FASHION_HERO_ATELIER,
    designer: 'Camille Laurent',
    atelierNotes: 'True bias silk dupioni drape balanced on wooden mannequin with hand-pinned pleats.',
    aspectRatio: '16:9',
    fabrication: '100% Raw Silk Dupioni & Wool Organza',
    season: 'Autumn/Winter 2026',
  },
  {
    id: 'gal-2',
    title: 'Pagoda Shoulder Double-Faced Trench',
    subtitle: 'Monochrome Architecture · Look 04',
    category: 'Tailoring & Outerwear',
    type: 'photography',
    imageUrl: PHOTO_RUNWAY_EDITORIAL,
    fallbackSvg: FASHION_LOOKBOOK_COAT,
    designer: 'Kenzo Mori',
    atelierNotes: 'Sculptural broad shoulder volume with razor-sharp lapel roll and bespoke horsehair chest canvas.',
    aspectRatio: '3:4',
    fabrication: '480 GSM Melton British Wool',
    season: 'Capsule 01',
  },
  {
    id: 'gal-3',
    title: 'Asymmetric Tailored Blazer Tech Pack',
    subtitle: 'CAD Drafting & Graded Coordinate Geometry',
    category: 'Pattern Drafting',
    type: 'flat',
    imageUrl: FASHION_TECHNICAL_FLATS,
    fallbackSvg: FASHION_TECHNICAL_FLATS,
    designer: 'Camille Laurent',
    atelierNotes: 'Front and back elevations with seam allowance callouts and Milanese keyhole stitch placement.',
    aspectRatio: '4:3',
    fabrication: 'CAD Vector / Tech Spec Sheet',
    season: 'Production Rev. 03',
  },
  {
    id: 'gal-4',
    title: 'Crimson Fluidity Silk Evening Gown',
    subtitle: 'Paris Fashion Week Catwalk Presentation',
    category: 'Haute Couture',
    type: 'photography',
    imageUrl: PHOTO_PFW_RUNWAY_BURGUNDY,
    fallbackSvg: FASHION_RUNWAY_GOWN,
    designer: 'Camille Laurent',
    atelierNotes: '28 meters of 6-momme silk chiffon cut on true bias with micro baby-hem finishing.',
    aspectRatio: '3:4',
    fabrication: 'Mulberry Silk Chiffon',
    season: 'PFW Haute Couture 2026',
  },
  {
    id: 'gal-5',
    title: 'Parametric Organza Kinetic Sculpture',
    subtitle: 'Avant-Garde & Wearable Art Monograph',
    category: 'Avant-Garde',
    type: 'photography',
    imageUrl: PHOTO_AVANT_GARDE_COUTURE,
    fallbackSvg: FASHION_AVANT_GARDE,
    designer: 'Elena Rostova',
    atelierNotes: 'Origami algorithmic pleating in heat-set metallic organza with dynamic movement response.',
    aspectRatio: '3:4',
    fabrication: 'Heat-Set Metallic Monofilament Organza',
    season: 'Milan Triennale 2026',
  },
  {
    id: 'gal-6',
    title: 'Terracotta Pigments & Raw Wool Research',
    subtitle: 'Botanical Dyes & Athenian Swatch Board',
    category: 'Textile Design',
    type: 'moodboard',
    imageUrl: PHOTO_MOODBOARD_FABRICS,
    fallbackSvg: FASHION_MOODBOARD,
    designer: 'Maya Lin',
    atelierNotes: 'Madder root botanical dye trials, unbleached handspun linen yarn, and herringbone weave structures.',
    aspectRatio: '4:3',
    fabrication: 'Raw Wool, Botanical Madder, Walnut Husk',
    season: 'Circular Lab 2026',
  },
  {
    id: 'gal-7',
    title: 'Atelier Tailoring Shears & Pattern Table',
    subtitle: 'Pattern Drafting & Muslin Toile Fitting',
    category: 'Craftsmanship',
    type: 'photography',
    imageUrl: PHOTO_TAILORING_WORKSPACE,
    fallbackSvg: FASHION_HERO_ATELIER,
    designer: 'Atelier Collective',
    atelierNotes: 'Muslin prototype development, armscye ease adjustments, and bespoke tailoring tools in action.',
    aspectRatio: '16:9',
    fabrication: 'Cotton Muslin & Tailoring Canvas',
    season: 'Atelier Practice',
  },
  {
    id: 'gal-8',
    title: 'Tactile Silk Drapery & Specular Folds',
    subtitle: 'Textile Sheen and Fluidity Study',
    category: 'Textile Design',
    type: 'photography',
    imageUrl: PHOTO_TEXTILE_DRAPERY,
    fallbackSvg: FASHION_MOODBOARD,
    designer: 'Elena Rostova',
    atelierNotes: 'Specular light reflection on organic silk fibers under diffused studio northern skylight.',
    aspectRatio: '3:4',
    fabrication: '100% Habotai & Charmeuse Silk',
    season: 'Textile Archive',
  },
  {
    id: 'gal-9',
    title: 'Camille Laurent — Head Atelier Headshot',
    subtitle: 'Antwerp Royal Academy Scholar & Designer',
    category: 'Designer Lineage',
    type: 'photography',
    imageUrl: PHOTO_DESIGNER_PORTRAIT_1,
    fallbackSvg: FASHION_DESIGNER_PORTRAIT,
    designer: 'Camille Laurent',
    atelierNotes: 'Contemplative minimalist portrait in tailored knitwear. Head of Atelier de l’Ombre.',
    aspectRatio: '1:1',
    fabrication: 'Studio Portrait Leica 35mm',
    season: 'Head Atelier',
  },
];
