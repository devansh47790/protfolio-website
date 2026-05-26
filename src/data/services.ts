/*
  Static services data. Same shape as the Sanity `service` document.

  Two kinds of entries live here:

  1. Foundation services (s1..s4): the original capability cards shown
     on the /services index. They keep the homepage hero from breaking
     and give visitors a fast overview of what we build.

  2. SEO-targeted service pages (s5..s8): full long-form service pages
     mapped to specific Moz-validated keyword clusters from the
     Week 1 plan in /SEO-ACTION-PLAN.md. Each one has:
       - h1, hero paragraphs, ctaLinks
       - sections (problem -> what's included -> who for -> process -> pricing)
       - faqs (rendered + emitted as FAQPage schema)
       - schemaJson (string holding a JSON-LD Service node)
       - internalLinks / externalLinks (used by the detail page nav)
       - seo.title / seo.description (drive <Seo> meta on the page)

  Adding a new SEO page = appending a new object below, then adding the
  matching path to src/data/routeSeo.ts so prerender + sitemap pick it up.
*/
import type { Service } from '../types/content';

export const services: Service[] = [
  /* ------------------------------------------------------------------
     FOUNDATION SERVICES (capability cards on the /services index)
  ------------------------------------------------------------------ */
  {
    _id: 's1',
    slug: 'wordpress-websites',
    title: 'WordPress Websites',
    summary: 'Custom WordPress sites that are polished, responsive, and simple for clients to update.',
    icon: 'code',
    bullets: [
      'Custom themes and page structures',
      'Editor-friendly content management',
      'Responsive builds for mobile, tablet, desktop',
    ],
    seo: {
      title: 'WordPress Websites | Devansh Patel',
      description: 'Custom WordPress websites that are polished, responsive, easy to update, and built for practical business content workflows.',
      keywords: ['WordPress websites', 'custom WordPress theme', 'responsive WordPress development', 'editor friendly CMS'],
    },
  },
  {
    _id: 's2',
    slug: 'react-frontends',
    title: 'React Frontends',
    summary: 'Modern React interfaces for portfolios, dashboards, landing pages, and product surfaces.',
    icon: 'layers',
    bullets: [
      'Component-driven architecture',
      'TypeScript and Tailwind workflows',
      'Smooth motion and accessible interactions',
    ],
    seo: {
      title: 'React Frontends | Devansh Patel',
      description: 'Modern React frontends for portfolios, dashboards, landing pages, and product surfaces with clean components and responsive UI.',
      keywords: ['React frontends', 'React developer', 'TypeScript', 'Tailwind CSS', 'frontend architecture'],
    },
  },
  {
    _id: 's3',
    slug: 'api-integrations',
    title: 'API Integrations',
    summary: 'Connect sites to forms, CMS content, booking tools, dashboards, and third-party APIs.',
    icon: 'database',
    bullets: [
      'REST API and CMS data flows',
      'Contact forms and automation hooks',
      'Clean loading, empty, and error states',
    ],
    seo: {
      title: 'API Integrations | Devansh Patel',
      description: 'API integration services connecting websites to CMS content, forms, automation tools, dashboards, and third-party platforms.',
      keywords: ['API integrations', 'REST API developer', 'CMS integration', 'form automation', 'third party API'],
    },
  },
  {
    _id: 's4',
    slug: 'performance-care',
    title: 'Performance Care',
    summary: 'Optimization and cleanup for websites that need to feel faster, clearer, and more reliable.',
    icon: 'gauge',
    bullets: [
      'Image optimization and lazy loading',
      'Pre-rendered metadata per page',
      'Robots, sitemap, and Open Graph',
    ],
    seo: {
      title: 'Performance Care | Devansh Patel',
      description: 'Website performance and SEO cleanup for faster loading, better metadata, optimized images, robots, sitemap, and Open Graph.',
      keywords: ['website performance', 'SEO cleanup', 'image optimization', 'Open Graph', 'technical SEO'],
    },
  },

  /* ------------------------------------------------------------------
     SEO-TARGETED SERVICE PAGES (Week 1 keyword clusters from
     /SEO-ACTION-PLAN.md and the Moz keyword shortlist)
  ------------------------------------------------------------------ */

  /* ----- s5 — Local SEO Melbourne ----------------------------------
     Primary: local seo melbourne (DA 10, 184/mo)
     Supporting: local business seo melbourne (DA 8, 75/mo),
                 seo local business, local seo for small business
  ------------------------------------------------------------------ */
  {
    _id: 's5',
    slug: 'local-seo-melbourne',
    title: 'Local SEO Melbourne',
    summary:
      'Rank in Google Maps and "near me" searches across Melbourne. GBP, citations, schema, and review systems — done by a developer.',
    icon: 'gauge',
    bullets: [
      'Full Google Business Profile rebuild',
      'On-page schema and suburb targeting',
      'Citations and review acquisition',
    ],
    h1: 'Local SEO Melbourne That Puts You on the Map — Literally',
    hero: [
      'If your customers Google "your service near me" or "your service Melbourne" and your competitors show up but you don\'t, you\'re losing leads every single day. Local SEO fixes that.',
      'I\'m Devansh, the developer and SEO behind Akime. I help Melbourne small businesses rank in Google Maps, the local pack, and local organic search — so the people looking for you find you first.',
      'No contracts. No 12-month lock-ins. One developer who picks up the phone.',
    ],
    ctaLinks: [
      { label: 'Get my free Local SEO audit', href: '/contact' },
      { label: 'See recent work', href: '/projects' },
    ],
    targetKeywords: [
      'local seo melbourne',
      'local business seo melbourne',
      'seo local business',
      'local seo for small business',
    ],
    sections: [
      {
        heading: 'The local SEO problem most Melbourne businesses don\'t realise they have',
        body: [
          'Most small businesses in Melbourne think SEO is one thing — getting onto page one of Google. But there are actually three different Google results that matter for local searches: Google Maps (the pack of 3 listings with the map), local organic results (the regular blue links filtered by your location), and national organic results.',
          'If you\'re a plumber in Hawthorn, you don\'t need to rank nationally — you need to win the local pack for "plumber Hawthorn" and the surrounding suburbs. That\'s a completely different game from generic SEO, and it\'s the game we play.',
        ],
      },
      {
        heading: 'What\'s included in Akime\'s Local SEO Melbourne service',
        body: [
          'Full Google Business Profile audit, claim, and optimisation with categories, services, attributes, and a 750-character description rewritten for keywords and clarity.',
          'Up to 12 GBP photos uploaded and tagged correctly. Suburb-level targeting setup for your top 5 service areas. Citation building across 20+ Australian directories with consistent NAP.',
          'A review acquisition system (template + landing page) so happy clients leave reviews fast. On-page local schema (LocalBusiness, Service, Review) added to your website.',
          'Monthly performance reports showing GBP impressions, calls, direction requests, and ranking changes. Monthly GBP post to keep the profile active — Google rewards this.',
        ],
      },
      {
        heading: 'Who this is for',
        body: [
          'Trades (plumbers, electricians, builders, painters), allied health (physios, chiros, dentists), service businesses (accountants, lawyers, mortgage brokers), retail with a physical location in Greater Melbourne, and service-area businesses without a storefront.',
          'If you\'re 100% online and have no physical location or service area, local SEO isn\'t the right fit — you want regular SEO. I\'ll tell you that up front.',
        ],
      },
      {
        heading: 'Pricing transparency',
        body: [
          'Setup is a one-off project fee in the range of A$1,200–A$2,500 depending on how many service suburbs you target. Ongoing maintenance is A$300–A$800/month. No lock-in contracts. You can stop anytime.',
        ],
      },
    ],
    faqs: [
      {
        question: 'How long does local SEO take to work?',
        answer:
          'First GBP improvements show in 2–4 weeks. Ranking changes in the local pack typically start in months 2–3, with significant movement by month 6. Anyone promising page 1 in 30 days is lying to you.',
      },
      {
        question: 'Do I need a website to rank in Google Maps?',
        answer:
          'Technically no, but Google ranks your GBP partly on the authority and content of the website linked to it. A poor website caps how high your GBP can rank. We usually optimise both together.',
      },
      {
        question: 'What\'s the difference between local SEO and regular SEO?',
        answer:
          'Regular SEO targets searches where location doesn\'t matter. Local SEO targets searches where location is implied or explicit ("plumber near me", "accountant Melbourne CBD"). Local SEO leans heavily on Google Business Profile, reviews, and citations.',
      },
      {
        question: 'How much does local SEO Melbourne cost?',
        answer:
          'Setup A$1,200–A$2,500 depending on suburb count. Ongoing maintenance A$300–A$800/month. No lock-in contracts.',
      },
      {
        question: 'Will you guarantee top 3 rankings in Google Maps?',
        answer:
          'No — and you should run from anyone who does. Google\'s ranking factors change constantly and competition varies suburb by suburb. What I will guarantee is the work: optimisation done to current best-practice standard and transparent monthly reports.',
      },
    ],
    schemaJson: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Local SEO Melbourne',
      description:
        'Local SEO services for Melbourne small businesses. Google Business Profile optimisation, citations, review systems, and on-page local schema.',
      serviceType: 'Local Search Engine Optimisation',
      areaServed: { '@type': 'City', name: 'Melbourne' },
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'AUD',
        lowPrice: '1200',
        highPrice: '2500',
      },
    }),
    internalLinks: [
      { label: 'WordPress websites', href: '/services/wordpress-websites' },
      { label: 'SEO services Geelong', href: '/services/seo-services-geelong' },
      { label: 'Contact', href: '/contact' },
    ],
    externalLinks: [
      {
        label: 'Google — Local ranking factors',
        href: 'https://support.google.com/business/answer/7091',
        note: 'Official documentation',
      },
    ],
    seo: {
      title: 'Local SEO Melbourne | Rank in Google Maps + Local Search | Akime',
      description:
        'Local SEO services for Melbourne small businesses. Rank in Google Maps, the local pack, and "near me" searches. Free audit, no contracts.',
      keywords: [
        'local seo melbourne',
        'local business seo melbourne',
        'seo local business',
        'local seo for small business',
        'google maps ranking melbourne',
      ],
    },
  },

  /* ----- s6 — Ecommerce Website Development Melbourne ------------
     Primary: ecommerce web development melbourne (DA 15, 246/mo)
     Supporting: ecommerce website development melbourne (DA 23, 193/mo)
  ------------------------------------------------------------------ */
  {
    _id: 's6',
    slug: 'ecommerce-website-development-melbourne',
    title: 'Ecommerce Website Development Melbourne',
    summary:
      'WooCommerce and Shopify stores for Melbourne businesses. Built for speed, SEO, and conversion — by the developer, not a markup shop.',
    icon: 'database',
    bullets: [
      'WooCommerce, Shopify, or headless React',
      'Mobile-first, Core Web Vitals optimised',
      'Stripe, Afterpay, Zip, Apple Pay ready',
    ],
    h1: 'Ecommerce Website Development in Melbourne That Actually Sells',
    hero: [
      'A beautiful online store that takes 8 seconds to load doesn\'t sell. A fast store with a confusing checkout doesn\'t sell either. Ecommerce conversion comes from getting twenty things right at once — and that\'s exactly what I do.',
      'I build custom WooCommerce and Shopify stores for Melbourne businesses. Every store ships fast (under 2 seconds), SEO-ready, mobile-first, and built to scale from your first order to your ten-thousandth.',
      'Direct contact with the developer. Transparent pricing. No surprise add-ons after launch.',
    ],
    ctaLinks: [
      { label: 'See ecommerce projects', href: '/projects' },
      { label: 'Get a quote', href: '/contact' },
    ],
    targetKeywords: [
      'ecommerce web development melbourne',
      'ecommerce website development melbourne',
      'woocommerce developer melbourne',
      'shopify developer melbourne',
    ],
    sections: [
      {
        heading: 'Why most Melbourne ecommerce sites underperform',
        body: [
          'Ecommerce sites get built by three types of people: agencies that mark up freelance work, freelancers who know design but not conversion, and DIY founders using drag-and-drop builders that look fine on desktop and break on mobile.',
          'None of them think about the things that actually move ecommerce revenue: time-to-interactive on mobile, checkout flow length, product page schema, image format and lazy loading, Australian payment gateway support (Afterpay, Zip, PayID), and shipping integration with Australia Post.',
          'I think about these things first and design second. The result is a store that ranks, loads fast, and converts the traffic it gets.',
        ],
      },
      {
        heading: 'What\'s included',
        body: [
          'Discovery and platform recommendation (WooCommerce for control and lower long-term cost, Shopify for speed-to-market, or headless React for bespoke UX). Custom mobile-first design.',
          'Product catalogue setup for up to 100 products. Payment integration: Stripe, PayPal, Afterpay, Zip, Apple Pay, Google Pay, PayID. Shipping: live rates from Australia Post and Sendle.',
          'SEO foundation built in: product schema, breadcrumb schema, sitemap, mobile-optimised images, fast LCP. Klaviyo or Mailchimp integration with abandoned cart automation. GA4, GTM, Meta Pixel configured before launch.',
          '30 days post-launch support for bugs, tweaks, and content changes — included.',
        ],
      },
      {
        heading: 'Pricing ranges (real numbers, not "from $999" lies)',
        body: [
          'Simple WooCommerce store (1–50 products): A$4,000–A$7,000, 4–6 weeks. Medium WooCommerce (50–500 products): A$7,000–A$15,000, 6–10 weeks.',
          'Shopify store with custom theme: A$5,000–A$10,000, 4–8 weeks. Custom headless build: A$15,000+, 10–16 weeks. Migration from existing store: A$3,000–A$8,000, 3–6 weeks.',
          'If your budget is below A$3,000, I\'ll be honest — you\'re better off on a premium theme you install yourself, and I\'ll point you in the right direction.',
        ],
      },
    ],
    faqs: [
      {
        question: 'How much does ecommerce website development in Melbourne cost?',
        answer:
          'Most WooCommerce builds for Australian small businesses land between A$4,000 and A$15,000 depending on product count, design complexity, and integrations. Shopify builds A$5,000–A$10,000. I always quote a fixed project price after a free scoping call.',
      },
      {
        question: 'WooCommerce or Shopify — which should I choose?',
        answer:
          'Shopify if you want the simplest possible admin and don\'t mind monthly platform fees that grow with revenue. WooCommerce if you want lower long-term costs, full control of your data, deep customisation, and stronger SEO/content marketing potential.',
      },
      {
        question: 'How long does an ecommerce build take?',
        answer:
          'Simple stores 4–6 weeks. Medium stores 6–10 weeks. Custom or migration 8–16 weeks. Most delays come from waiting on client content.',
      },
      {
        question: 'Can you migrate my existing store without losing SEO?',
        answer:
          'Yes. I set up 301 redirects from old URLs to new ones, preserve metadata, keep schema intact, and submit a fresh sitemap immediately on launch.',
      },
      {
        question: 'Do you handle Afterpay, Zip, and Apple Pay?',
        answer:
          'Yes. All three are standard inclusions on every store I build. Stripe and PayPal too.',
      },
      {
        question: 'Will my store work on mobile?',
        answer:
          'Mobile-first is the only way I build. Over 70% of Australian ecommerce traffic is mobile.',
      },
    ],
    schemaJson: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Ecommerce Website Development Melbourne',
      description:
        'Custom WooCommerce and Shopify ecommerce development for Melbourne and Australian businesses. Built for speed, SEO, and conversion.',
      serviceType: 'Ecommerce Web Development',
      areaServed: { '@type': 'City', name: 'Melbourne' },
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'AUD',
        lowPrice: '4000',
        highPrice: '15000',
      },
    }),
    internalLinks: [
      { label: 'WordPress websites', href: '/services/wordpress-websites' },
      { label: 'Performance care', href: '/services/performance-care' },
      { label: 'See projects', href: '/projects' },
    ],
    externalLinks: [
      {
        label: 'WooCommerce documentation',
        href: 'https://woocommerce.com/documentation/',
      },
    ],
    seo: {
      title: 'Ecommerce Website Development Melbourne | WooCommerce & Shopify',
      description:
        'Custom ecommerce website development in Melbourne. WooCommerce and Shopify stores built for speed, SEO, and conversion. Direct developer contact.',
      keywords: [
        'ecommerce web development melbourne',
        'ecommerce website development melbourne',
        'woocommerce developer melbourne',
        'shopify developer melbourne',
        'online store melbourne',
      ],
    },
  },

  /* ----- s7 — SEO Services Geelong --------------------------------
     Primary: seo consultant geelong (DA 12, 190/mo)
     Supporting: search engine optimisation geelong, geelong seo,
                 search engine optimisation specialist geelong
  ------------------------------------------------------------------ */
  {
    _id: 's7',
    slug: 'seo-services-geelong',
    title: 'SEO Services Geelong',
    summary:
      'SEO consultant in Geelong. Technical audits, local SEO, content, and link building for regional Victorian small businesses.',
    icon: 'gauge',
    bullets: [
      'Technical + on-page SEO audits',
      'Geelong suburb targeting + citations',
      'Monthly reporting in plain English',
    ],
    h1: 'SEO Services in Geelong That Bring You Real Customers',
    hero: [
      'Geelong businesses don\'t need national SEO. You need to win the searches that happen within a 30-minute drive of your front door — and there are more of them than you\'d think.',
      'I\'m Devansh from Akime. I help Geelong businesses rank higher on Google for the searches that actually bring in calls, bookings, and walk-ins. Technical fixes, local SEO, content, and link building — all done by one experienced developer-SEO, not a call centre.',
      'Free 30-minute SEO audit. No contract. No upsell.',
    ],
    ctaLinks: [
      { label: 'Book a free SEO audit', href: '/contact' },
      { label: 'Website design Geelong', href: '/services/website-design-geelong' },
    ],
    targetKeywords: [
      'seo consultant geelong',
      'search engine optimisation geelong',
      'geelong seo',
      'search engine optimisation specialist geelong',
    ],
    sections: [
      {
        heading: 'Why Geelong SEO is different from Melbourne SEO',
        body: [
          'Melbourne SEO is a knife fight. Every service category has agencies with 7-figure budgets bidding for the same keywords. Geelong is the opposite — strong commercial demand, much less competition.',
          'The same effort that gets you to position 11 in Melbourne gets you to position 3 in Geelong. Competitor domain authority scores in Geelong sit between 10 and 25 for most search terms — the numbers we beat regularly. The gap is wide open right now. In 12 months it won\'t be.',
        ],
      },
      {
        heading: 'What\'s included',
        body: [
          'Full SEO audit covering technical, on-page, and off-page issues — delivered as a written report with a 90-day fix plan ranked by impact.',
          'Technical SEO fixes: page speed, Core Web Vitals, mobile usability, crawl errors, schema markup, HTTPS, canonical URLs. The boring stuff that has to be right before anything else works.',
          'Local SEO Geelong: Google Business Profile optimisation, suburb targeting (Newtown, East Geelong, Belmont, Highton, Grovedale, Waurn Ponds, Torquay), Australian directory citations, review systems.',
          'Content strategy: two helpful blog posts per month aligned to your actual customer questions. Link building: local directories, partnerships, broken link reclamation — slow, ethical, durable. Monthly reporting on rankings, traffic, and attributed leads.',
        ],
      },
      {
        heading: 'Pricing',
        body: [
          'One-off SEO audit: A$500–A$1,500 (best for DIY-minded owners who want a roadmap). Setup + 3 months: A$3,000–A$6,000. Ongoing monthly: A$800–A$2,000/mo. No 12-month lock-ins. Month-to-month after the first 3 months.',
        ],
      },
    ],
    faqs: [
      {
        question: 'How long does SEO take to work for a Geelong business?',
        answer:
          'First measurable movement in 4–8 weeks. Real ranking gains in months 3–6. Sustained lead growth in months 6–12. SEO is slow then sudden — most of the work happens before you see the result.',
      },
      {
        question: 'Do you have to be in Geelong to do SEO for a Geelong business?',
        answer:
          'No, and I\'m in Melbourne — but knowing the region matters. I work with Geelong businesses regularly, I know the suburbs and competitor landscape, and I can drive down for in-person meetings.',
      },
      {
        question: 'How much does SEO cost in Geelong?',
        answer:
          'Audit only A$500–A$1,500. Setup + first 3 months A$3,000–A$6,000. Ongoing A$800–A$2,000/month depending on scope.',
      },
      {
        question: 'What\'s included in a free SEO audit?',
        answer:
          'A 30-minute call where I screen-share through your site\'s biggest SEO issues, look at your top competitors, and give you 3–5 things you can fix yourself this week — even if we never work together.',
      },
      {
        question: 'Will you guarantee top 3 rankings?',
        answer:
          'No, and run from anyone who does. I\'ll guarantee the work — done to current best-practice standard, transparent reporting, and changes based on what\'s actually moving the needle.',
      },
    ],
    schemaJson: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'SEO Services Geelong',
      description:
        'SEO consultant in Geelong. Technical SEO, local SEO, content, and link building for regional Victorian small businesses.',
      serviceType: 'Search Engine Optimisation',
      areaServed: { '@type': 'City', name: 'Geelong' },
    }),
    internalLinks: [
      { label: 'Local SEO Melbourne', href: '/services/local-seo-melbourne' },
      { label: 'Website design Geelong', href: '/services/website-design-geelong' },
      { label: 'WordPress websites', href: '/services/wordpress-websites' },
    ],
    externalLinks: [
      {
        label: 'Google Search Starter Guide',
        href: 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide',
      },
      {
        label: 'Geelong Chamber of Commerce',
        href: 'https://www.geelongchamber.com.au/',
        note: 'Local trust signal',
      },
    ],
    seo: {
      title: 'SEO Services Geelong | SEO Consultant for Geelong Businesses | Akime',
      description:
        'SEO consultant in Geelong helping local businesses rank higher in Google. Technical SEO, local SEO, content, and link building. Free SEO audit.',
      keywords: [
        'seo consultant geelong',
        'search engine optimisation geelong',
        'geelong seo',
        'search engine optimisation specialist geelong',
        'seo audit geelong',
      ],
    },
  },

  /* ----- s8 — Website Design Geelong ------------------------------
     Primary: geelong website design (DA 23, 197/mo)
     Supporting: web design company geelong (DA 24, 194/mo)
  ------------------------------------------------------------------ */
  {
    _id: 's8',
    slug: 'website-design-geelong',
    title: 'Website Design Geelong',
    summary:
      'Custom WordPress, WooCommerce, and React websites for Geelong small businesses. Mobile-first, fast, and SEO-ready from day one.',
    icon: 'layers',
    bullets: [
      'Custom design — no off-the-shelf templates',
      'Mobile-first, Core Web Vitals optimised',
      'Direct contact with the developer',
    ],
    h1: 'Website Design in Geelong That Looks Great and Actually Performs',
    hero: [
      'A pretty website that nobody can find isn\'t doing its job. A fast, search-optimised website is what brings in calls and bookings — and that\'s what I build.',
      'Akime designs and develops custom websites for Geelong small businesses. WordPress, WooCommerce, or React — whichever fits. Every site ships mobile-first, search-engine-ready, and built to scale.',
      'You\'ll work directly with me, the developer. No project managers in the middle. No offshore handoffs.',
    ],
    ctaLinks: [
      { label: 'See recent work', href: '/projects' },
      { label: 'Request a quote', href: '/contact' },
    ],
    targetKeywords: [
      'geelong website design',
      'web design company geelong',
      'website design geelong',
      'web designer geelong',
    ],
    sections: [
      {
        heading: 'Why most Geelong small business websites under-perform',
        body: [
          'Most Geelong businesses I talk to have one of three website problems: a template site from a discount provider (looks generic, loads slowly, ranks for nothing), a custom site built years ago (great in 2020, now mobile-broken and image-heavy), or a Wix/Squarespace DIY (fine for getting started but caps your SEO ceiling).',
          'Each is fixable. The path forward depends on your budget and timeline.',
        ],
      },
      {
        heading: 'What\'s included',
        body: [
          'Discovery call to understand your business, customers, and what the website actually needs to do. Custom design built around your brand — not a template. Mobile-first, accessible, fast.',
          'Development on WordPress, WooCommerce, or React based on what fits your needs. Content structure: service pages, location pages (Newtown, Belmont, East Geelong, Highton, Grovedale, Waurn Ponds), about, contact, blog, FAQs.',
          'Technical SEO foundation: schema markup, sitemap, robots.txt, canonical URLs, fast LCP, low CLS — all configured at build time. Booking and CRM integrations. 30 days post-launch support included.',
        ],
      },
      {
        heading: 'Three tiers I offer',
        body: [
          'Starter — A$1,800–A$3,500. 4–6 pages, WordPress with a customised premium theme, mobile-first, SEO-ready, contact form, 2–3 week build. For solo operators and new businesses.',
          'Standard — A$3,500–A$7,000. 8–15 pages, custom design, WordPress or React, booking integrations, blog, service area / suburb pages, 4–6 week build. For established Geelong businesses ready to invest in search visibility.',
          'Bespoke — A$7,000–A$15,000+. Fully custom design and development, WooCommerce or headless CMS, advanced SEO, conversion-rate-optimised, 6–12 week build. For businesses where the website is a meaningful revenue channel.',
        ],
      },
    ],
    faqs: [
      {
        question: 'How much does website design cost in Geelong?',
        answer:
          'Starter sites A$1,800–A$3,500. Standard custom builds A$3,500–A$7,000. Bespoke or ecommerce A$7,000+. I always quote a fixed project price after the free scoping call.',
      },
      {
        question: 'How long does a website take to build?',
        answer:
          'Starter 2–3 weeks. Standard 4–6 weeks. Bespoke 6–12 weeks. Most delays come from waiting on content (copy, images), so the more prepared you are, the faster we ship.',
      },
      {
        question: 'Do you only work with Geelong businesses?',
        answer:
          'No — I work across regional Victoria, Melbourne, and Australia-wide. But Geelong is a focus because it\'s a strong commercial market with relatively low online competition.',
      },
      {
        question: 'WordPress or React — what will you build my site on?',
        answer:
          'WordPress for most small business sites (easy to maintain, strong SEO, huge plugin ecosystem). React for sites that need bespoke interactivity or a custom UI.',
      },
      {
        question: 'Do I own the site after it\'s built?',
        answer:
          'Yes, completely. The domain, the hosting, the code, the content — all yours. You can take it to another developer anytime.',
      },
      {
        question: 'Do you offer ongoing maintenance after launch?',
        answer:
          'Yes — A$60–A$200/month depending on plan. Updates, backups, security, small content changes, and quarterly performance reviews.',
      },
    ],
    schemaJson: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Website Design Geelong',
      description:
        'Custom website design and development for Geelong small businesses. WordPress, WooCommerce, and React websites built for speed and SEO.',
      serviceType: 'Web Design',
      areaServed: { '@type': 'City', name: 'Geelong' },
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'AUD',
        lowPrice: '1800',
        highPrice: '15000',
      },
    }),
    internalLinks: [
      { label: 'SEO services Geelong', href: '/services/seo-services-geelong' },
      { label: 'Ecommerce development', href: '/services/ecommerce-website-development-melbourne' },
      { label: 'See projects', href: '/projects' },
    ],
    externalLinks: [
      {
        label: 'Google Core Web Vitals',
        href: 'https://web.dev/vitals/',
      },
    ],
    seo: {
      title: 'Website Design Geelong | Web Design Company Geelong | Akime',
      description:
        'Website design Geelong — custom WordPress, WooCommerce, and React websites for Geelong small businesses. Mobile-first, fast, and SEO-ready.',
      keywords: [
        'geelong website design',
        'web design company geelong',
        'website design geelong',
        'web designer geelong',
      ],
    },
  },
];
