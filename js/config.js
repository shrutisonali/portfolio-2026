/* ============================================
   CONFIG.JS — Canvas Element Positions & Data
   ============================================
   Layout reference: Umi-style dense scatter
   — Elements crowd tightly around central hero
   — Mix of card types, sizes, illustrations
   — Overlap and layering creates depth
   ============================================ */

const CONFIG = {
  canvas: {
    width: 5000,
    height: 4000,
    centerX: 2500,
    centerY: 2000,
  },

  startX: 2500,
  startY: 2000,

  minZoom: 0.4,
  maxZoom: 1.5,
  defaultZoom: (() => {
    const w = window.innerWidth;
    if (w >= 2560) return 1.4;
    if (w >= 1920) return 1.3;
    if (w >= 1440) return 1.26;
    return 1.21;
  })(),

  inertiaDecay: 0.92,
  inertiaDuration: 1.2,
  clickThreshold: 5,

  navTargets: {
    hero:    { x: 2500, y: 2000 },
    work:    { x: 2500, y: 2000 },
    play:    { x: 2900, y: 1600 },
    about:   { x: 2100, y: 2300 },
    contact: { x: 2900, y: 2250 },
  },

  // ── Element definitions ──
  elements: [
    // ─── HERO (dead center, large) ───
    {
      id: 'hero',
      type: 'hero',
      x: 2200,
      y: 1880,
      width: 620,
      height: 250,
      depth: 3,
      rotation: 0,
      data: {
        name: '',
        tagline: 'Non-Linear',
        highlightWord: 'Creative.',
        tagline2: '',
        subtitle: 'Brand to Web. Designed and Built with AI.'
      }
    },

    // ─── STICKER (next to hero) ───
    {
      id: 'illust-designer',
      type: 'image-sticker',
      x: 1920,
      y: 1920,
      width: 316,
      height: 316,
      depth: 2,
      rotation: -3,
      data: {
        src: 'assets/Sticker.png',
        hoverSrc: 'assets/sticker 2.png',
        hoverSrc2: 'assets/sticker 3.png',
        alt: 'Shruti — designer at work'
      }
    },

    // ─── CHAI STICKER (interactive, opens recipe panel) ───
    {
      id: 'illust-chai',
      type: 'image-sticker',
      x: 2500, y: 2050,
      width: 288, height: 288,
      depth: 2, rotation: 5,
      data: {
        src: 'assets/Chai Illustrations/chai me 1.png',
        hoverSrc: 'assets/Chai Illustrations/chai me 2.png',
        hoverSrc2: 'assets/Chai Illustrations/chai me 3.png',
        alt: 'Shruti drinking chai',
        speechBubble: 'Chai?',
        clickAction: 'openChaiPanel'
      }
    },

    // ─── DRAGGABLE STICKERS (scattered around) ───
    {
      id: 'sticker-bookshelf',
      type: 'draggable-sticker',
      x: 2920,
      y: 1520,
      width: 281,
      height: 281,
      depth: 2,
      rotation: 5,
      data: { src: 'assets/sticker 6.png', alt: 'Bookshelf' }
    },
    {
      id: 'sticker-watering',
      type: 'draggable-sticker',
      x: 2200,
      y: 2080,
      width: 289,
      height: 289,
      depth: 2,
      rotation: -7,
      data: { src: 'assets/sticker 7.png', alt: 'Watering can' }
    },
    {
      id: 'sticker-outfit',
      type: 'draggable-sticker',
      x: 2500,
      y: 1650,
      width: 272,
      height: 272,
      depth: 2,
      rotation: 8,
      data: { src: 'assets/sticker 8.png', alt: 'Outfit and groceries' }
    },
    {
      id: 'sticker-plant',
      type: 'draggable-sticker',
      x: 3140,
      y: 2100,
      width: 252,
      height: 252,
      depth: 2,
      rotation: -4,
      data: { src: 'assets/sticker 9.png', alt: 'Potted plant' }
    },

    // ─── NARUTO RUNNER GAME STICKER ───
    {
      id: 'sticker-naruto',
      type: 'image-sticker',
      x: 3200, y: 1800,
      width: 240, height: 240,
      depth: 2, rotation: -3,
      data: {
        src: 'assets/naruto/1.png',
        hoverFrames: [
          'assets/naruto/1.png',
          'assets/naruto/2.png',
          'assets/naruto/2.1.png',
          'assets/naruto/2.3.png',
          'assets/naruto/3.png',
          'assets/naruto/3.5.png',
          'assets/naruto/4.png',
          'assets/naruto/5.png',
          'assets/naruto/5.5.png',
          'assets/naruto/5.6.png'
        ],
        alt: 'Play Naruto Runner',
        speechBubble: "Let's run, dattebayo!",
        clickAction: 'openNarutoGame'
      }
    },

    // ─── WORK STACKS (grouped project decks) ───
    {
      id: 'stack-web',
      type: 'work-stack',
      x: 1900,
      y: 1540,
      width: 260,
      height: 340,
      depth: 3,
      rotation: -2,
      data: {
        stackName: 'Web Design & Dev',
        stackType: 'web',
        categoryTags: ['Websites', 'UI/UX', 'Development'],
        cards: [
          { title: 'Kindred', color: '#6CC2EA', thumb: 'assets/screenshots/kindred.png?v=3', desc: 'Minimal studio site with bold type.' },
          { title: 'Sylva', color: '#EA89B9', thumb: 'assets/screenshots/sylva.png?v=3', desc: 'Wellness brand with soft editorial feel.' },
          { title: 'Operators', color: '#A0D4A6', thumb: 'assets/screenshots/operators.png?v=3', desc: 'Community platform, clean and direct.' },
          { title: 'PreSales', color: '#F8C614', thumb: 'assets/screenshots/presales.png?v=3', desc: 'Professional collective, warm refresh.' },
          { title: 'CLC', color: '#F37B75', thumb: 'assets/screenshots/closedloop.png?v=3', desc: 'Sustainability hub, data-forward design.' },
        ]
      }
    },
    {
      id: 'stack-brand',
      type: 'work-stack',
      x: 2920,
      y: 1880,
      width: 260,
      height: 340,
      depth: 3,
      rotation: 3,
      data: {
        stackName: 'Brand Identity',
        stackType: 'brand',
        categoryTags: ['Logos', 'Guidelines', 'Strategy'],
        cards: [
          { title: 'PreSales Collective', color: '#F8C614', thumb: 'assets/Branding Case Studies/Presales Collective/Thumbnail.png', desc: 'Visual system built to scale for 50K+ members.' },
          { title: 'Operators', color: '#A0D4A6', thumb: 'assets/Branding Case Studies/operators/Thumbnail.png', desc: 'Tech community, bold mark and system.' },
          { title: 'Miitra', color: '#F37B75', thumb: 'assets/Branding Case Studies/Miitra/Thumbnail.png', desc: 'Community data platform, dark & precise.' },
          { title: 'Mycelium India', color: '#6CC2EA', thumb: 'assets/Branding Case Studies/Mycelium India/Thumbnail.png', desc: 'Fungi biotech rebrand, science meets nature.' },
        ]
      }
    },
    {
      id: 'stack-packaging',
      type: 'work-stack',
      x: 1620,
      y: 2050,
      width: 260,
      height: 340,
      depth: 3,
      rotation: -1,
      data: {
        stackName: 'Packaging',
        stackType: 'packaging',
        categoryTags: ['Labels', 'Dielines', 'CPG'],
        cards: [
          { title: 'OAR Cosmetics', color: '#F37B75', thumb: 'assets/Packaging/OAR Cosmetics/Thumbnail.png', desc: 'Premium skincare, warm amber tones.' },
          { title: 'Lifecykel', color: '#A0D4A6', thumb: 'assets/Packaging/Lifecykel/Thumbnail.png', desc: 'Mushroom extracts, botanical illustrations.' },
          { title: 'Hempful', color: '#F8C614', thumb: 'assets/Packaging/Hempful/Thumbnail.png', desc: 'Hemp spreads, bold shelf-ready labels.' },
        ]
      }
    },

    // ─── ABOUT & CONTACT INFO CARDS ───
    {
      id: 'about',
      type: 'info-card',
      x: 2050,
      y: 2150,
      width: 280,
      height: 280,
      depth: 3,
      rotation: -2,
      data: {
        variant: 'about',
        title: 'Hey, I\'m Shruti',
        content: 'Get to know me →',
        photo: 'assets/Profile Picture4.png'
      }
    },
    {
      id: 'contact',
      type: 'info-card',
      x: 2800,
      y: 1900,
      width: 280,
      height: 280,
      depth: 3,
      rotation: 2,
      data: {
        variant: 'contact',
        title: "Let's Talk",
        content: "Good work starts with good conversations.",
        email: 'shrutisonali38@gmail.com',
        cta: 'Say hello',
        icon: '→'
      }
    },
  ],

  // ── Brand project data for grid + case study ──
  brandProjects: [
    {
      id: 'presales',
      title: 'PreSales Collective',
      subtitle: 'Branding, illustration, and web design for PreSales Collective — the world\'s largest community for presales professionals. A cohesive visual system built to serve 50,000+ members worldwide.',
      category: 'Brand Identity Design',
      industry: 'Professional Community',
      year: '2025',
      director: 'Shruti Sonali',
      thumb: 'assets/Branding Case Studies/Presales Collective/Thumbnail.png',
      heroImage: 'assets/Branding Case Studies/Presales Collective/Identity Concept 2-01.png',
      toc: ['The Challenge', 'Process', 'Outcome'],
      sections: [
        { type: 'image', src: 'assets/Branding Case Studies/Presales Collective/Identity Concept 2-02.png', caption: 'The refined PSC monogram — professional authority with approachable warmth.' },
        { type: 'image', src: 'assets/Branding Case Studies/Presales Collective/Identity Concept 2-03.png' },
        { type: 'text', heading: 'The Challenge', body: '<p>PreSales Collective had outgrown its original identity. With 50,000+ members across the globe, the brand needed a visual system that could scale across events, digital content, merchandise, and a content-heavy website.</p><h4>Scalability requirements</h4><p>The identity needed to work from conference stage backdrops to social media thumbnails, maintaining consistency across hundreds of content pieces per month.</p>' },
        { type: 'image', src: 'assets/Branding Case Studies/Presales Collective/Identity Concept 2-04.png' },
        { type: 'image', src: 'assets/Branding Case Studies/Presales Collective/Identity Concept 2-05.png' },
        { type: 'text', heading: 'Process', body: '<p>Custom illustrations and a refined typographic system anchor the brand. Soft gradients and a lavender palette set the tone — professional yet approachable.</p><h4>Design methodology</h4><ol><li>Brand strategy & positioning research</li><li>Visual identity exploration & concepts</li><li>Custom illustration system development</li><li>Typography & color palette design</li><li>Website infrastructure & content templates</li></ol>' },
        { type: 'image', src: 'assets/Branding Case Studies/Presales Collective/Identity Concept 2-06.png' },
        { type: 'image', src: 'assets/Branding Case Studies/Presales Collective/Identity Concept 2-08.png' },
        { type: 'image', src: 'assets/Branding Case Studies/Presales Collective/Identity Concept 2-09.png' },
        { type: 'text', heading: 'Outcome', body: '<p>A scalable identity system with custom illustrations, type guidelines, and a content-forward website infrastructure — designed to serve a global community and grow with it.</p><p>The new brand increased member engagement and gave the community a visual identity that matched its industry authority.</p>' },
        { type: 'image', src: 'assets/Branding Case Studies/Presales Collective/Identity Concept 2-10.png' },
        { type: 'image', src: 'assets/Branding Case Studies/Presales Collective/Identity Concept 2-12.png' },
        { type: 'image', src: 'assets/Branding Case Studies/Presales Collective/Identity Concept 2-13.png' },
      ]
    },
    {
      id: 'operators',
      title: 'Operators',
      subtitle: 'Operators is a premier platform empowering strategic operations professionals — Chiefs of Staff, BizOps leaders, and more — by connecting them with curated communities and expert resources.',
      category: 'Brand Identity Design',
      industry: 'Tech Community',
      year: '2025',
      director: 'Shruti Sonali',
      thumb: 'assets/Branding Case Studies/operators/Thumbnail.png',
      heroImage: 'assets/Branding Case Studies/operators/Behance-01.png',
      toc: ['The Challenge', 'Process', 'Outcome'],
      sections: [
        { type: 'image', src: 'assets/Branding Case Studies/operators/Behance-02.png', caption: 'Logo construction — the cross-shaped mark built on a precise grid system.' },
        { type: 'image', src: 'assets/Branding Case Studies/operators/Behance-03.png' },
        { type: 'text', heading: 'The Challenge', body: '<p>Operators needed an identity that could stand alongside the biggest names in tech while feeling grassroots and genuine. The mark needed to signal precision, collaboration, and belonging.</p><h4>Community-first branding</h4><p>Unlike corporate brands, community identities need to feel ownable by members — something they\'re proud to wear and share.</p>' },
        { type: 'image', src: 'assets/Branding Case Studies/operators/Behance-04.png' },
        { type: 'image', src: 'assets/Branding Case Studies/operators/Behance-05.png' },
        { type: 'text', heading: 'Process', body: '<p>The cross-shaped mark suggests precision and collaboration. A dark palette with a neon yellow accent gives the brand an unmistakable presence.</p><h4>Design methodology</h4><ol><li>Community member interviews & surveys</li><li>Visual audit of tech community brands</li><li>Logo exploration & grid-based construction</li><li>Color system & dark mode-first approach</li><li>Brand guidelines & merchandise templates</li></ol>' },
        { type: 'image', src: 'assets/Branding Case Studies/operators/Behance-06.png' },
        { type: 'image', src: 'assets/Branding Case Studies/operators/Behance-07.png' },
        { type: 'text', heading: 'Outcome', body: '<p>A tight identity system that works across digital platforms, event materials, and community merchandise — building recognition for a fast-growing tech network.</p><p>The bold, minimal mark became instantly recognizable in the tech community space.</p>' },
        { type: 'image', src: 'assets/Branding Case Studies/operators/Behance-10.png' },
      ]
    },
    {
      id: 'miitra',
      title: 'Miitra',
      subtitle: 'Miitra is a lightweight customer data platform that aims to revolutionize the way community managers help their communities interact, collaborate, and thrive.',
      category: 'Brand Identity Design',
      industry: 'SaaS / Community Tech',
      year: '2024',
      director: 'Shruti Sonali',
      thumb: 'assets/Branding Case Studies/Miitra/Thumbnail.png',
      heroImage: 'assets/Branding Case Studies/Miitra/Behance-01.png',
      toc: ['The Challenge', 'Process', 'Outcome'],
      sections: [
        { type: 'image', src: 'assets/Branding Case Studies/Miitra/Behance-02.png', caption: 'Brand pillars — maximize engagement, leave no member behind, personalized at scale.' },
        { type: 'text', heading: 'The Challenge', body: '<p>Miitra needed to stand apart in the crowded community-management space. The brand had to communicate data intelligence and human connection simultaneously — technical enough for product teams, warm enough for community managers.</p><h4>Market positioning</h4><p>With Slack communities growing rapidly, Miitra needed a visual identity that signaled both analytical rigor and genuine community care.</p>' },
        { type: 'image', src: 'assets/Branding Case Studies/Miitra/Behance-03.png' },
        { type: 'image', src: 'assets/Branding Case Studies/Miitra/Behance-04.png' },
        { type: 'text', heading: 'Process', body: '<p>The custom "M" mark abstracts growth and connection — two pillars of community building. A deep green palette with mint accents creates a sophisticated tech feel without being cold.</p><h4>Design methodology</h4><ol><li>Community research & stakeholder interviews</li><li>Visual identity exploration & concept development</li><li>Logo design & typography selection</li><li>Color palette & illustration system</li><li>Brand guidelines & digital applications</li></ol>' },
        { type: 'image', src: 'assets/Branding Case Studies/Miitra/Behance-05.png' },
        { type: 'image', src: 'assets/Branding Case Studies/Miitra/Behance-07.png' },
        { type: 'image', src: 'assets/Branding Case Studies/Miitra/Behance-08.png' },
        { type: 'text', heading: 'Outcome', body: '<p>A complete identity system spanning web, mobile, marketing collateral, and custom illustrations — designed to scale as the platform grows from startup to industry standard.</p><p>The custom illustration style became the brand\'s most distinctive asset, creating a recognizable visual language across all touchpoints.</p>' },
        { type: 'image', src: 'assets/Branding Case Studies/Miitra/01_new_Macbook-Pro-03-Standard-Mockup.png', caption: 'The final brand identity system in context.' },
      ]
    },
    {
      id: 'mycelium',
      title: 'Mycelium India',
      subtitle: 'Mycelium India is a leading biotech company harnessing the power of mycelium for health and sustainability — nutraceuticals and eco-friendly packaging solutions for a better future.',
      category: 'Brand Identity Design',
      industry: 'Biotech / Agriculture',
      year: '2023',
      director: 'Shruti Sonali',
      thumb: 'assets/Branding Case Studies/Mycelium India/Thumbnail.png',
      heroImage: 'assets/Branding Case Studies/Mycelium India/Behance-01.png',
      toc: ['The Challenge', 'Process', 'Outcome'],
      sections: [
        { type: 'image', src: 'assets/Branding Case Studies/Mycelium India/Behance-02.png', caption: 'Logomark and logo with wordmark — the flowing M references mycelium networks.' },
        { type: 'text', heading: 'The Challenge', body: '<p>Mycelium India is pioneering fungi-based solutions for agriculture and sustainability. The existing brand didn\'t reflect their scientific credibility or their mission to bring fungi innovation mainstream.</p><h4>Brand perception gap</h4><p>The company needed to be taken seriously by investors and scientists while remaining approachable for farmers and consumers.</p>' },
        { type: 'image', src: 'assets/Branding Case Studies/Mycelium India/Behance-03.png' },
        { type: 'image', src: 'assets/Branding Case Studies/Mycelium India/Behance-04.png' },
        { type: 'text', heading: 'Process', body: '<p>The flowing "M" mark references mycelium networks — organic, interconnected, alive. We explored multiple color directions before landing on a rich teal palette that grounds the brand in nature.</p><h4>Design methodology</h4><ol><li>Industry research & competitive analysis</li><li>Brand strategy & positioning workshops</li><li>Logo design exploring organic forms</li><li>Color & typography system development</li><li>Comprehensive brand guidelines</li></ol>' },
        { type: 'image', src: 'assets/Branding Case Studies/Mycelium India/Behance-05.png' },
        { type: 'image', src: 'assets/Branding Case Studies/Mycelium India/Behance-08.png' },
        { type: 'image', src: 'assets/Branding Case Studies/Mycelium India/Behance-09.png' },
        { type: 'image', src: 'assets/Branding Case Studies/Mycelium India/Behance-10.png' },
        { type: 'text', heading: 'Outcome', body: '<p>The rebrand positioned Mycelium India as a credible, forward-thinking biotech company. The visual language earns trust from both scientists and investors while celebrating the beauty of fungal networks.</p><p>The identity system now works across research presentations, product packaging, and digital platforms.</p>' },
        { type: 'image', src: 'assets/Branding Case Studies/Mycelium India/Behance-11.png' },
        { type: 'image', src: 'assets/Branding Case Studies/Mycelium India/Behance-14.png' },
        { type: 'image', src: 'assets/Branding Case Studies/Mycelium India/Behance-15.png' },
      ]
    }
  ],

  // ── Packaging projects for slider + case study ──
  packagingProjects: [
    {
      id: 'oar',
      title: 'OAR Cosmetics',
      subtitle: 'Packaging design and brand identity for OAR Cosmetics, an advanced natural skincare line. The project encompassed label design across a full multi-SKU range.',
      category: 'Packaging Design',
      industry: 'Skincare / Beauty',
      year: '2026',
      director: 'Shruti Sonali',
      thumb: 'assets/Packaging/OAR Cosmetics/Thumbnail.png',
      tags: ['Packaging', 'Skincare', 'Multi-SKU'],
      color: '#F37B75',
      toc: ['The Challenge', 'The Approach', 'The Result'],
      sections: [
        { type: 'image', src: 'assets/Packaging/OAR Cosmetics/OAR-cosmetics_Design-Concept-Presentation.png', caption: 'OAR Cosmetics — full range packaging concept.' },
        { type: 'text', heading: 'The Challenge', body: '<p>OAR Cosmetics came to us as a skincare brand with a clear product vision but no design direction. The ask was open: create packaging that felt premium, natural, and distinctive — across a full product line including a Perfecting Toning Mist, Facial Cleansing Cream, Hyaluronic Acid Serum, Hydrating Moisturiser, and 15% Vitamin C treatment.</p><h4>Market context</h4><p>The brand needed to occupy a confident space in a saturated skincare market — one where consumers are increasingly drawn to clean aesthetics that still feel luxurious.</p>' },
        { type: 'image', src: 'assets/Packaging/OAR Cosmetics/OAR cosmetics_Design Concept Presentation-13.png' },
        { type: 'image', src: 'assets/Packaging/OAR Cosmetics/OAR cosmetics_Design Concept Presentation-14.png' },
        { type: 'text', heading: 'The Approach', body: '<p>The design system was built around restraint. A bespoke wordmark for OAR anchored the identity — geometric and minimal, with a quiet sophistication that communicates clinical credibility without feeling cold.</p><h4>Design language</h4><p>The colour palette leaned into warm amber browns and matte whites, referencing natural ingredients and earthy provenance while staying distinctly modern. Typography was kept spare and editorial, letting breathing room do the heavy lifting.</p>' },
        { type: 'image', src: 'assets/Packaging/OAR Cosmetics/freepik__oar-facial-cleansing-cream-bottle-on-concrete-surf__27669.png' },
        { type: 'image', src: 'assets/Packaging/OAR Cosmetics/freepik__oar-eye-cream-tube-on-concrete-surface-with-olive-__27671.png' },
        { type: 'image', src: 'assets/Packaging/OAR Cosmetics/freepik__professional-product-photograph-of-oar-facial-clea__87613.png' },
        { type: 'text', heading: 'The Result', body: '<p>A cohesive multi-SKU packaging system delivered within a tight one-month timeline, with the first concept presented within three days of project kickoff.</p><p>The final system scales effortlessly across formats: from full-size spray bottles to compact serums and travel tubes, the OAR identity remains immediately recognisable on shelf.</p>' },
        { type: 'image', src: 'assets/Packaging/OAR Cosmetics/freepik__enhance__87619.png' },
        { type: 'image', src: 'assets/Packaging/OAR Cosmetics/freepik__enhance__86482.png' },
        { type: 'image', src: 'assets/Packaging/OAR Cosmetics/freepik__enhance__87625.png' },
      ]
    },
    {
      id: 'lifecykel',
      title: 'Lifecykel',
      subtitle: 'Packaging design for Lifecykel\'s medicinal mushroom extract range. Featuring custom botanical illustrations and a muted earthy palette to create a premium, approachable system.',
      category: 'Packaging Design',
      industry: 'Biotech / Nutraceuticals',
      year: '2026',
      director: 'Shruti Sonali',
      thumb: 'assets/Packaging/Lifecykel/Thumbnail.png',
      tags: ['Packaging', 'Supplements', 'Illustration'],
      color: '#A0D4A6',
      toc: ['The Brief', 'The Process', 'The Result'],
      sections: [
        { type: 'image', src: 'assets/Packaging/Lifecykel/LC Range.png', caption: 'Lifecykel — full medicinal mushroom extract range.' },
        { type: 'text', heading: 'The Brief', body: '<p>Lifecykel is an Australian mushroom biotechnology company dedicated to harnessing the remarkable potential of medicinal mushrooms. Founded in 2015, the brand has grown into a globally recognized name, offering full-spectrum double liquid extracts.</p><h4>Objective</h4><p>Design a cohesive premium packaging system where each product feels elevated and shelf-worthy, while remaining distinctly approachable — communicating the organic, science-backed nature of the brand to a health-conscious audience.</p>' },
        { type: 'image', src: 'assets/Packaging/Lifecykel/Before After.png', caption: 'Before and after — the rebrand transformation.' },
        { type: 'image', src: 'assets/Packaging/Lifecykel/LC Images.png' },
        { type: 'text', heading: 'The Process', body: '<p>To achieve a high-end feel in line with Lifecykel\'s ethos, I built the design language around a muted, earthy color palette — grounding each product in its natural origins while keeping the overall range visually cohesive.</p><h4>Custom illustrations</h4><p>At the heart of the system are custom botanical illustrations, uniquely crafted for each mushroom variety. Rather than relying on photography or generic icons, these hand-crafted illustrations give each package its own character and instantly connect the customer to what\'s inside.</p>' },
        { type: 'image', src: 'assets/Packaging/Lifecykel/LC Images2.png' },
        { type: 'image', src: 'assets/Packaging/Lifecykel/LC Images3.png' },
        { type: 'image', src: 'assets/Packaging/Lifecykel/LC Images4.png' },
        { type: 'text', heading: 'The Result', body: '<p>The result is a packaging range that feels both personal and purposeful — making it effortless for customers to identify and choose between individual mushroom varieties at a glance.</p>' },
        { type: 'image', src: 'assets/Packaging/Lifecykel/freepik__enhance__79186.png' },
        { type: 'image', src: 'assets/Packaging/Lifecykel/freepik__enhance__79189.png' },
        { type: 'image', src: 'assets/Packaging/Lifecykel/freepik__enhance__79197.png' },
      ]
    },
    {
      id: 'hempful',
      title: 'Hempful',
      subtitle: 'A vibrant packaging design case study for Hempful, a hemp-based food brand offering flavourful hemp dip spreads. Bold, expressive label design that bridges wellness and everyday cooking.',
      category: 'Packaging Design',
      industry: 'Food / CPG',
      year: '2026',
      director: 'Shruti Sonali',
      thumb: 'assets/Packaging/Hempful/Thumbnail.png',
      tags: ['Packaging', 'Food', 'CPG'],
      color: '#F8C614',
      toc: ['The Challenge', 'The Process', 'The Result'],
      sections: [
        { type: 'image', src: 'assets/Packaging/Hempful/freepik__enhance__83082.png', caption: 'Hempful hemp dip spreads — full product range.' },
        { type: 'text', heading: 'The Challenge', body: '<p>Hempful is a hemp-based food brand bringing the nutritional power of hemp seeds into everyday kitchen staples. The challenge was to design packaging that felt approachable, joyful, and shelf-ready, while clearly communicating the brand\'s plant-forward values.</p><h4>Product differentiation</h4><p>Each variant needed a distinct personality through color and form, yet remain cohesive as a product family — bridging the gap between health-conscious shoppers and casual grocery buyers.</p>' },
        { type: 'image', src: 'assets/Packaging/Hempful/freepik__enhance__69322.png' },
        { type: 'image', src: 'assets/Packaging/Hempful/freepik__enhance__69323.png' },
        { type: 'text', heading: 'The Process', body: '<p>This case study documents the complete label design system for Hempful\'s range of hemp dip spreads — still emerging, often misunderstood, and needing to bridge the gap between health-conscious shoppers and casual grocery buyers.</p><h4>Design approach</h4><p>Bold, expressive label design that bridges wellness and everyday cooking — crafted to stand out on shelf while communicating the brand\'s natural, plant-forward identity.</p>' },
        { type: 'image', src: 'assets/Packaging/Hempful/freepik__enhance__83085.png' },
        { type: 'text', heading: 'The Result', body: '<p>A cohesive product family where each variant has its own personality through color and illustration, yet instantly reads as part of the Hempful range on any shelf.</p>' },
        { type: 'image', src: 'assets/Packaging/Hempful/freepik__enhance__98820.png' },
      ]
    }
  ],

  // ── Legacy project page content (kept for any remaining references) ──
  projects: {},

  // ── Web projects for slider ──
  webProjects: [
    { id: 'web-kindred', title: 'Kindred Web Studio', url: 'https://kindredwebstudio.com', tags: ['Web Design', 'Development'], color: '#6CC2EA', screenshot: 'assets/screenshots/kindred.png?v=3' },
    { id: 'web-sylva', title: 'Sylva', url: 'https://withsylva.com', tags: ['Web Design', 'Development'], color: '#EA89B9', screenshot: 'assets/screenshots/sylva.png?v=3' },
    { id: 'web-operators', title: 'Operators', url: 'https://joinoperators.com', tags: ['Web Design', 'Development'], color: '#A0D4A6', screenshot: 'assets/screenshots/operators.png?v=3' },
    { id: 'web-presales', title: 'PreSales Collective', url: 'https://presalescollective.com', tags: ['Web Design', 'Development', 'Brand Refresh'], color: '#F8C614', screenshot: 'assets/screenshots/presales.png?v=3' },
    { id: 'web-closedloop', title: 'Closed Loop Center', url: 'https://closedloopcenter.com', tags: ['Web Design', 'UX Strategy'], color: '#F37B75', screenshot: 'assets/screenshots/closedloop.png?v=3' },
  ],

  about: {
    heading: 'My story',
    bio: "I started in architecture, moved into brand and packaging design, and somewhere along the way fell in love with building for the screen. Now I sit at the intersection of design thinking and emerging technology — making things that feel considered, from the first sketch to the final pixel.",
    philosophy: "I believe the best work happens when craft meets curiosity. I care about the details that most people won't notice but everyone will feel — the weight of a typeface, the rhythm of a layout, the moment an interaction earns a smile.",
    aiThesis: "I build with AI the way a photographer works with light — it's a medium, not a shortcut. The taste, the decisions, the creative direction? That's still very human. That's still mine.",
    skills: ['Brand Identity', 'Packaging Systems', 'Web Design & Dev', 'Design Systems', 'Typography', 'AI-Assisted Development']
  },

  contact: {
    statement: "Good work comes from good conversations.",
    email: 'shrutisonali38@gmail.com',
    social: [
      { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/shruti-sonali/' },
      { platform: 'Behance', url: 'https://www.behance.net/shrutisonali_studio' }
    ]
  }
};
