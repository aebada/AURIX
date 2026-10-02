import { pageDictionaries, type PageDictionaries } from "./pages";

export type Locale = "en" | "de" | "ar";

export const LOCALES: { code: Locale; label: string; dir: "ltr" | "rtl" }[] = [
  { code: "en", label: "English", dir: "ltr" },
  { code: "de", label: "Deutsch", dir: "ltr" },
  { code: "ar", label: "العربية", dir: "rtl" },
];

export interface Dictionary {
  pages: PageDictionaries;
  nav: {
    personal: string;
    send: string;
    partnerWithUs: string;
    howItWorks: string;
    features: string;
    demo: string;
    markets: string;
    pricing: string;
    security: string;
    about: string;
    contact: string;
    aiGovernance: string;
    reserveTransparency: string;
    whitepaper: string;
    partners: string;
    careers: string;
    investors: string;
    download: string;
    waitlist: string;
    webApp: string;
    business: string;
    payroll: string;
  };
  header: {
    login: string;
    signup: string;
    dashboard: string;
    signout: string;
    tryDemo: string;
  };
  footer: {
    tagline: string;
    disclaimer: string;
    rights: string;
    tagline2: string;
    sections: {
      Product: string;
      Trust: string;
      Company: string;
    };
  };
  appStore: {
    comingSoonApple: string;
    appStore: string;
    comingSoonGoogle: string;
    googlePlay: string;
    downloadAndroid: string;
  };
  cta: {
    title: string;
    description: string;
    primary: string;
    secondary: string;
    loggedInTitle: string;
    loggedInDescription: string;
  };
  home: {
    eyebrowHero: string;
    brandHero: string;
    h1Line1: string;
    h1Line2: string;
    sub: string;
    ctaPrimary: string;
    ctaSecondary: string;
    ctaDemo: string;
    ctaBusiness: string;
    trustRow: string[];
    ops: {
      eyebrow: string;
      h2: string;
      sub: string;
      items: {
        id: string;
        title: string;
        body: string;
        points: string[];
        href: string;
        cta: string;
      }[];
    };
    pathsEyebrow: string;
    pathsH2: string;
    pathsSub: string;
    paths: {
      id: string;
      model: string;
      title: string;
      body: string;
      highlights: string[];
      href: string;
      cta: string;
      visualLabel: string;
    }[];
    problem: {
      eyebrow: string;
      h2: string;
      quote: string;
      items: { number: string; title: string; body: string }[];
    };
    solution: {
      eyebrow: string;
      h2: string;
      items: { title: string; body: string }[];
      formula: string;
    };
    pointcoin: {
      eyebrow: string;
      h2: string;
      body: string;
      checks: string[];
      facts: { value: string; label: string }[];
      link: string;
    };
    platform: {
      eyebrow: string;
      h2: string;
      groups: { title: string; items: string[] }[];
    };
    architecture: {
      eyebrow: string;
      h2: string;
      layer1Label: string;
      layer1Items: string[];
      layer2Label: string;
      layer2Items: string[];
      footer: string;
    };
    market: {
      eyebrow: string;
      h2: string;
      stats: { value: string; label: string }[];
    };
    revenue: {
      eyebrow: string;
      h2: string;
      body: string;
      streams: { title: string; body: string }[];
    };
    competitive: {
      eyebrow: string;
      h2: string;
      currentTitle: string;
      currentItems: string[];
      standardTitle: string;
      standardItems: { strong: string; rest: string }[];
    };
    insights: {
      eyebrow: string;
      h2: string;
      posts: { tag: string; title: string; excerpt: string }[];
      note: string;
    };
  };
  login: {
    signInTitle: string;
    registerTitle: string;
    connectsNote: string;
    fullName: string;
    email: string;
    password: string;
    pleaseWait: string;
    signIn: string;
    createAccount: string;
    needAccount: string;
    haveAccount: string;
    or: string;
    genericError: string;
  };
}

export const dictionaries: Record<Locale, Dictionary> = {
  en: {
    pages: pageDictionaries.en,
    nav: {
      personal: "Personal",
      send: "Send gold",
      partnerWithUs: "Partner with us",
      howItWorks: "How It Works",
      features: "Features",
      demo: "Demo",
      markets: "Markets",
      pricing: "Pricing",
      security: "Security",
      about: "About",
      contact: "Contact",
      aiGovernance: "AI & Governance",
      reserveTransparency: "Reserve Transparency",
      whitepaper: "Whitepaper",
      partners: "Partners",
      careers: "Careers",
      investors: "Investors",
      download: "Download",
      waitlist: "Waitlist",
      webApp: "Open web app",
      business: "Business",
      payroll: "Payroll benefit",
    },
    header: {
      login: "Log in",
      signup: "Get started",
      dashboard: "Open web app",
      signout: "Sign out",
      tryDemo: "Try demo",
    },
    footer: {
      tagline:
        "Measured trust. Real digital money. A regulated orchestration layer connecting real gold and silver reserves to instant global payments.",
      disclaimer: "AURIX does not custody funds, metals, crypto, or securities.",
      rights: "AURIX. All rights reserved.",
      tagline2: "Real value, made digital.",
      sections: {
        Product: "Product",
        Trust: "Trust",
        Company: "Company",
      },
    },
    appStore: {
      comingSoonApple: "Coming soon on the",
      appStore: "App Store",
      comingSoonGoogle: "Coming soon on",
      googlePlay: "Google Play",
      downloadAndroid: "Preview available —",
    },
    cta: {
      title: "Be first when AURIX opens its doors.",
      description:
        "Create your account to get early access, founding-member pricing, and updates as we move from architecture to MVP.",
      primary: "Create your account",
      secondary: "Read the Whitepaper",
      loggedInTitle: "Welcome back.",
      loggedInDescription:
        "Head to your dashboard to check balances, move money, and manage your account.",
    },
    home: {
      eyebrowHero: "Gold-linked money for people & companies",
      brandHero: "AURIX",
      h1Line1: "Measured trust.",
      h1Line2: "Real digital money.",
      sub: "Wallets, payments, partner gold delivery, and employer benefits — practice today. Live custody stays gated until certification.",
      ctaPrimary: "Get started",
      ctaSecondary: "Try practice mode",
      ctaDemo: "Watch walkthrough",
      ctaBusiness: "For businesses",
      trustRow: [
        "Practice wallets live",
        "Partner corridors building",
        "Payroll apply open",
        "Custody gated honestly",
      ],
      ops: {
        eyebrow: "Product",
        h2: "Everything that moves value — in one place",
        sub: "Hover a capability to preview it. Practice rails today; live metal grants and vault claims stay off until certified.",
        items: [
          {
            id: "wallet",
            title: "Multi-wallet",
            body: "Gold, silver, and cash pockets with practice pay, send, and trade — one account for personal and business.",
            points: [
              "Personal · Business · Family contexts",
              "Practice balances — no live vault claims",
              "Instant product feel before certification",
            ],
            href: "/app/?tour=1",
            cta: "Open practice wallet",
          },
          {
            id: "send",
            title: "Send gold",
            body: "Cross-border gold for customers, fulfilled by jewelry and bullion partners in your corridor.",
            points: [
              "You keep the sender relationship",
              "Partners earn on pickup & delivery",
              "SA · EG · KW · AE · QA focus",
            ],
            href: "/send/",
            cta: "Send gold",
          },
          {
            id: "payroll",
            title: "Payroll benefit",
            body: "Employers grant owned gold as a tax-aware Sachbezug — additional to salary, never a substitute.",
            points: [
              "Monthly ~€50 or annual ~€10,000 framing",
              "Additionality attestation required",
              "Register your company for KYB review",
            ],
            href: "/for-business/payroll/",
            cta: "Register your company",
          },
          {
            id: "partners",
            title: "Partners",
            body: "Join the Gold as a Service network — appear in the locator once approved, redeem at the counter.",
            points: [
              "Partner panel for inventory & earnings",
              "Zero setup fee to start the conversation",
              "Corridor-by-corridor activation",
            ],
            href: "/partner-with-us/",
            cta: "Become a partner",
          },
        ],
      },
      pathsEyebrow: "Who it’s for",
      pathsH2: "One platform. Four ways in.",
      pathsSub:
        "Tap a path to preview the surface — customers, businesses, partners, or capital.",
      paths: [
        {
          id: "b2c",
          model: "B2C",
          title: "Customers",
          body: "A modern multi-wallet for people: gold, silver, and cash pockets with practice pay, send, and trade.",
          highlights: [
            "Personal · Business · Kids wallets in one account",
            "Practice payments and swaps today",
            "Live custody stays gated until certification",
          ],
          href: "/app/?tour=1",
          cta: "Open practice wallet",
          visualLabel: "Personal app",
        },
        {
          id: "b2b",
          model: "B2B",
          title: "Businesses",
          body: "Treasury, payroll pockets, merchant float, and team seats — plus AURIX for Payroll for employee gold benefits.",
          highlights: [
            "Metal salary & tax-aware Sachbezug framing",
            "Ops treasury with pocket-level controls",
            "Register company for employer onboarding review",
          ],
          href: "/for-business/payroll/",
          cta: "Explore payroll benefit",
          visualLabel: "Business treasury",
        },
        {
          id: "b2b2c",
          model: "B2B2C",
          title: "Partners",
          body: "Jewelry and bullion stores fulfill gold for your customers. You own the sender relationship; partners earn on pickup and delivery.",
          highlights: [
            "Send gold across SA · EG · KW · AE · QA",
            "Partner locator + redeem panel",
            "Zero setup fee to start the conversation",
          ],
          href: "/partner-with-us/",
          cta: "Become a partner",
          visualLabel: "Partner network",
        },
        {
          id: "investors",
          model: "Capital",
          title: "Investors",
          body: "Platform thesis, milestones, and a direct IR form — honest early-stage status, no fake live vault claims.",
          highlights: [
            "Practice product and partner corridors first",
            "Licensed rails before live settlement",
            "Direct inquiry to investor relations",
          ],
          href: "/investors",
          cta: "Investor relations",
          visualLabel: "IR roadmap",
        },
      ],
      problem: {
        eyebrow: "The problem",
        h2: "Value, stability, and usability rarely meet.",
        quote: "There is no system that combines real value, stability, and global usability.",
        items: [
          {
            number: "01",
            title: "Fiat inflation",
            body: "Savings stay accessible — but purchasing power erodes. Everyday money is not designed as lasting value.",
          },
          {
            number: "02",
            title: "Crypto volatility",
            body: "Speed without the stability most people and businesses need for real commercial use.",
          },
          {
            number: "03",
            title: "The ownership gap",
            body: "Many platforms sell digital access without clear underlying assets. Users hold promises, not metal.",
          },
        ],
      },
      solution: {
        eyebrow: "The product",
        h2: "Gold-linked digital money — orchestrated, not custodied by AURIX.",
        items: [
          {
            title: "Partner reserves",
            body: "Designed so digital units map to physical gold and silver held by licensed custodians — not AURIX. Live vault allocation is in certification and not enabled yet.",
          },
          {
            title: "Governance layer",
            body: "Anomaly detection and scoring for continuous verification when partner reserve feeds go live. Irreversible actions stay human-approved.",
          },
          {
            title: "Everyday utility",
            body: "Practice payments, transfers, payroll benefits, and partner fulfillment today. Live rails activate only with certified partners.",
          },
        ],
        formula: "Partner reserves + payment network + governance = AURIX",
      },
      pointcoin: {
        eyebrow: "Introducing Pointcoin",
        h2: "Gold-linked units, down to the point.",
        body: "Pointcoin is AURIX's atomic unit standard (BPC): 0.0001g of gold or silver per unit when custody partners are live. Until then, the app uses practice balances — no claim that metal is vaulted or redeemable today.",
        checks: [
          "Designed for allocated ownership via licensed partners — not AURIX custody",
          "Practice payments, transfers, and savings in the web and mobile apps",
          "Proof-of-reserve roadmap — issued supply must never exceed vaulted metal when live",
        ],
        facts: [
          { value: "0.0001g", label: "Designed smallest unit — one Pointcoin for micro-ownership when live" },
          { value: "1:1", label: "Target rule: issued units never exceed partner-vaulted metal (gated)" },
          { value: "Practice", label: "Web & mobile practice balances today — live reserves coming soon" },
        ],
        link: "Read the full tokenization model →",
      },
      platform: {
        eyebrow: "Revolutionizing Digital Ownership",
        h2: "The all-in-one asset platform",
        groups: [
          {
            title: "Unified Multi-Wallet",
            items: [
              "Real-time view of gold, silver, fiat, and crypto assets",
              "Seamless asset switching and instant liquidity",
              "Integrated market data for informed decision making",
            ],
          },
          {
            title: "Physical Asset Trading",
            items: [
              "Buy, sell, and store real gold instantly via mobile",
              "Direct allocation to physical bars in audited vaults",
              "Zero-friction entry into precious metal markets",
            ],
          },
          {
            title: "Global Payments",
            items: [
              "NFC, QR, and P2P payments for daily retail use",
              "Sharia-compliant gold-backed credit lines",
              '"Save Now Buy Later" innovative financial tools',
            ],
          },
        ],
      },
      architecture: {
        eyebrow: "Middleware Integration",
        h2: "The two-layer architecture",
        layer1Label: "01   Reserve Layer",
        layer1Items: [
          "Physical gold/silver stored in globally audited, secure vaults.",
          "Zero-Knowledge Proof (ZKP) verification for asset allocation.",
          "AI-driven anomaly detection for real-time reserve monitoring.",
          "Cryptographic link between physical bars and digital units.",
        ],
        layer2Label: "02   Payment Layer",
        layer2Items: [
          "High-performance wallet-based settlement for instant clearing.",
          "Real-time reconciliation with the underlying Reserve Layer.",
          "Seamless integration with NFC, QR, and P2P payment rails.",
          "Scalable architecture designed for global retail transaction volume.",
        ],
        footer: "System integrity — real-time reconciliation ensures 1:1 backing at all times.",
      },
      market: {
        eyebrow: "Market Opportunity",
        h2: "Intersection of four giants",
        stats: [
          { value: "$2T+", label: "Global payments market, ripe for stable, asset-backed disruption" },
          { value: "$13T+", label: "Global gold market, now accessible via digital liquidity" },
          { value: "$4T+", label: "Ethical finance sector seeking Sharia-compliant products" },
          { value: "$1T+", label: "Real-World Asset (RWA) tokenization and digital ownership" },
        ],
      },
      revenue: {
        eyebrow: "Scalable & Asset-Light",
        h2: "Diversified revenue streams",
        body: "AURIX is an infrastructure layer — not a custodian. We do not store assets; we connect users to physical reserves via secure APIs.",
        streams: [
          { title: "Transactions", body: "Fees on instant payments, global transfers, and P2P settlements." },
          { title: "Asset Spread", body: "Competitive spread on the buy/sell of physical gold and silver." },
          { title: "Vault Partners", body: "Commissions from global vaulting and custody partners." },
          { title: "Ethical Lending", body: "Sharia-compliant service fees on gold-backed credit lines." },
          { title: "Subscriptions", body: "Tiered premium features for high-volume retail and institutional users." },
          { title: "B2B Licensing", body: "API licensing for banks and fintechs to offer asset-backed services." },
        ],
      },
      competitive: {
        eyebrow: "Beyond Stablecoins",
        h2: "Competitive landscape",
        currentTitle: "The current market",
        currentItems: [
          "DeFi for real assets with complex, non-liquid structures.",
          "Fractional ownership platforms for investment only.",
          "Stablecoins backed by debt or algorithmic promises.",
        ],
        standardTitle: "The AURIX standard",
        standardItems: [
          { strong: "Physical Reality:", rest: "backed by real gold/silver, not just code." },
          { strong: "Daily Utility:", rest: "designed for instant retail transactions." },
          { strong: "AI Verification:", rest: "real-time audits via AI and physics." },
        ],
      },
      insights: {
        eyebrow: "AURIX Insights",
        h2: "News & market perspective",
        posts: [
          {
            tag: "Market Update",
            title: "Why gold is reclaiming its role as a monetary anchor",
            excerpt:
              "Central bank gold buying has hit multi-decade highs as institutions hedge against currency debasement — here's what it means for everyday savers.",
          },
          {
            tag: "Regulation",
            title: "The regulatory path for asset-backed digital money",
            excerpt:
              "How compliant, fully-allocated gold-backed tokens differ from algorithmic and fiat-collateralized stablecoins under emerging frameworks.",
          },
          {
            tag: "Product",
            title: "Inside AURIX's continuous proof-of-reserve",
            excerpt:
              "A look at how AI-driven reconciliation keeps issued Pointcoin balances cryptographically tied to vaulted metal, in real time.",
          },
        ],
        note: "Illustrative content — the AURIX blog is coming soon.",
      },
    },
    login: {
      signInTitle: "Sign in to AURIX",
      registerTitle: "Create your AURIX account",
      connectsNote: "Connects to the live services/backend API. Once signed in, you'll be taken to the AURIX wallet dashboard.",
      fullName: "Full name",
      email: "Email",
      password: "Password",
      pleaseWait: "Please wait…",
      signIn: "Sign in",
      createAccount: "Create account",
      needAccount: "Need an account? Register",
      haveAccount: "Already have an account? Sign in",
      or: "or",
      genericError: "Couldn't reach the AURIX API. Please try again shortly.",
    },
  },
  de: {
    pages: pageDictionaries.de,
    nav: {
      personal: "Privat",
      send: "Gold senden",
      partnerWithUs: "Partner werden",
      howItWorks: "So funktioniert's",
      features: "Funktionen",
      demo: "Demo",
      markets: "Märkte",
      pricing: "Preise",
      security: "Sicherheit",
      about: "Über uns",
      contact: "Kontakt",
      aiGovernance: "KI & Governance",
      reserveTransparency: "Reservetransparenz",
      whitepaper: "Whitepaper",
      partners: "Partner",
      careers: "Karriere",
      investors: "Investoren",
      download: "Download",
      waitlist: "Warteliste",
      webApp: "Web-App öffnen",
      business: "Business",
      payroll: "Lohn-Benefit",
    },
    header: {
      login: "Anmelden",
      signup: "Loslegen",
      dashboard: "Web-App öffnen",
      signout: "Abmelden",
      tryDemo: "Demo testen",
    },
    footer: {
      tagline:
        "Verlässliches Vertrauen. Echtes digitales Geld. Eine regulierte Orchestrierungsebene, die reale Gold- und Silberreserven mit sofortigen globalen Zahlungen verbindet.",
      disclaimer: "AURIX verwahrt keine Gelder, Metalle, Kryptowerte oder Wertpapiere.",
      rights: "AURIX. Alle Rechte vorbehalten.",
      tagline2: "Echter Wert, digital gemacht.",
      sections: {
        Product: "Produkt",
        Trust: "Vertrauen",
        Company: "Unternehmen",
      },
    },
    appStore: {
      comingSoonApple: "Demnächst im",
      appStore: "App Store",
      comingSoonGoogle: "Demnächst bei",
      googlePlay: "Google Play",
      downloadAndroid: "Vorschau verfügbar —",
    },
    cta: {
      title: "Seien Sie dabei, wenn AURIX seine Türen öffnet.",
      description:
        "Erstellen Sie Ihr Konto für frühzeitigen Zugang, Preise für Gründungsmitglieder und Updates auf dem Weg von der Architektur zum MVP.",
      primary: "Konto erstellen",
      secondary: "Whitepaper lesen",
      loggedInTitle: "Willkommen zurück.",
      loggedInDescription:
        "Gehen Sie zu Ihrem Dashboard, um Guthaben zu prüfen, Geld zu bewegen und Ihr Konto zu verwalten.",
    },
    home: {
      eyebrowHero: "Goldverknüpftes Geld für Menschen & Unternehmen",
      brandHero: "AURIX",
      h1Line1: "Verlässliches Vertrauen.",
      h1Line2: "Echtes digitales Geld.",
      sub: "Wallets, Zahlungen, Partner-Goldlieferung und Employer-Benefits — heute üben. Live-Verwahrung bleibt bis zur Zertifizierung gesperrt.",
      ctaPrimary: "Loslegen",
      ctaSecondary: "Übungsmodus starten",
      ctaDemo: "Rundgang ansehen",
      ctaBusiness: "Für Unternehmen",
      trustRow: [
        "Übungs-Wallets live",
        "Partner-Korridore im Aufbau",
        "Payroll-Bewerbung offen",
        "Verwahrung ehrlich gesperrt",
      ],
      ops: {
        eyebrow: "Produkt",
        h2: "Alles, was Wert bewegt — an einem Ort",
        sub: "Fahren Sie über eine Fähigkeit für die Vorschau. Übungs-Rails heute; Live-Metall-Grants und Vault-Claims bleiben bis zur Zertifizierung aus.",
        items: [
          {
            id: "wallet",
            title: "Multi-Wallet",
            body: "Gold-, Silber- und Cash-Taschen mit Übungszahlen, Senden und Handel — ein Konto für privat und business.",
            points: [
              "Persönlich · Business · Familie",
              "Übungsguthaben — keine Live-Vault-Claims",
              "Produktgefühl vor der Zertifizierung",
            ],
            href: "/app/?tour=1",
            cta: "Übungs-Wallet öffnen",
          },
          {
            id: "send",
            title: "Gold senden",
            body: "Grenzüberschreitendes Gold für Kunden, erfüllt von Schmuck- und Bullion-Partnern in Ihrem Korridor.",
            points: [
              "Sie behalten die Absender-Beziehung",
              "Partner verdienen an Abholung & Lieferung",
              "Fokus SA · EG · KW · AE · QA",
            ],
            href: "/send/",
            cta: "Gold senden",
          },
          {
            id: "payroll",
            title: "Lohn-Benefit",
            body: "Arbeitgeber gewähren eigenes Gold als steuerbewussten Sachbezug — zusätzlich zum Gehalt, nie als Ersatz.",
            points: [
              "Monatlich ~€50 oder jährlich ~€10.000",
              "Zusätzlichkeits-Bestätigung erforderlich",
              "Unternehmen zur KYB-Prüfung registrieren",
            ],
            href: "/for-business/payroll/",
            cta: "Unternehmen registrieren",
          },
          {
            id: "partners",
            title: "Partner",
            body: "Werden Sie Teil des Gold-as-a-Service-Netzwerks — im Locator erscheinen, am Tresen einlösen.",
            points: [
              "Partner-Panel für Bestand & Erträge",
              "Kein Setup-Fee für den Einstieg",
              "Aktivierung Korridor für Korridor",
            ],
            href: "/partner-with-us/",
            cta: "Partner werden",
          },
        ],
      },
      pathsEyebrow: "Für wen",
      pathsH2: "Eine Plattform. Vier Einstiege.",
      pathsSub:
        "Pfad wählen und die Oberfläche sehen — Kunden, Unternehmen, Partner oder Kapital.",
      paths: [
        {
          id: "b2c",
          model: "B2C",
          title: "Kunden",
          body: "Modernes Multi-Wallet: Gold-, Silber- und Cash-Taschen mit Übungszahlungen, Senden und Handel.",
          highlights: [
            "Persönlich · Business · Kids in einem Konto",
            "Übungszahlungen und Swaps heute",
            "Live-Verwahrung erst nach Zertifizierung",
          ],
          href: "/app/?tour=1",
          cta: "Übungs-Wallet öffnen",
          visualLabel: "Persönliche App",
        },
        {
          id: "b2b",
          model: "B2B",
          title: "Unternehmen",
          body: "Treasury, Payroll-Taschen, Händler-Float und Team-Sitze — plus AURIX for Payroll für Mitarbeiter-Gold-Benefits.",
          highlights: [
            "Metall-Gehalt & Sachbezug-Framing",
            "Ops-Treasury mit Taschen-Kontrolle",
            "Unternehmen zur Employer-Prüfung registrieren",
          ],
          href: "/for-business/payroll/",
          cta: "Payroll-Benefit entdecken",
          visualLabel: "Business-Treasury",
        },
        {
          id: "b2b2c",
          model: "B2B2C",
          title: "Partner",
          body: "Schmuck- und Bullion-Stores erfüllen Gold für Ihre Kunden. Sie besitzen die Absender-Beziehung; Partner verdienen an Abholung und Lieferung.",
          highlights: [
            "Gold senden über SA · EG · KW · AE · QA",
            "Partner-Locator + Einlöse-Panel",
            "Kein Setup-Fee für den Einstieg",
          ],
          href: "/partner-with-us/",
          cta: "Partner werden",
          visualLabel: "Partnernetzwerk",
        },
        {
          id: "investors",
          model: "Kapital",
          title: "Investoren",
          body: "Plattform-These, Meilensteine und direktes IR-Formular — ehrlicher Early-Stage-Status, keine Fake-Live-Vault-Claims.",
          highlights: [
            "Übungsprodukt und Partner-Korridore zuerst",
            "Lizenzierte Rails vor Live-Settlement",
            "Direkte Anfrage an Investor Relations",
          ],
          href: "/investors",
          cta: "Investor Relations",
          visualLabel: "IR-Roadmap",
        },
      ],
      problem: {
        eyebrow: "Das Problem",
        h2: "Wert, Stabilität und Nutzbarkeit treffen selten zusammen.",
        quote: "Es gibt kein System, das realen Wert, Stabilität und globale Nutzbarkeit vereint.",
        items: [
          {
            number: "01",
            title: "Fiat-Inflation",
            body: "Ersparnisse bleiben zugänglich — aber Kaufkraft schwindet. Alltagswährung ist nicht als dauerhafter Wert gedacht.",
          },
          {
            number: "02",
            title: "Krypto-Volatilität",
            body: "Geschwindigkeit ohne die Stabilität, die Menschen und Unternehmen für realen Handel brauchen.",
          },
          {
            number: "03",
            title: "Eigentumslücke",
            body: "Viele Plattformen verkaufen digitalen Zugang ohne klare Basiswerte. Nutzer halten Versprechen, kein Metall.",
          },
        ],
      },
      solution: {
        eyebrow: "Das Produkt",
        h2: "Goldverknüpftes digitales Geld — orchestriert, nicht von AURIX verwahrt.",
        items: [
          {
            title: "Partner-Reserven",
            body: "Digitale Einheiten sollen physischem Gold und Silber bei lizenzierten Verwahrern entsprechen — nicht AURIX. Live-Vault-Allokation ist in Zertifizierung und noch nicht aktiv.",
          },
          {
            title: "Governance-Schicht",
            body: "Anomalie-Erkennung und Scoring für kontinuierliche Prüfung, wenn Partner-Reserve-Feeds live gehen. Unumkehrbare Aktionen bleiben menschlich freigegeben.",
          },
          {
            title: "Alltagsnutzen",
            body: "Übungszahlungen, Transfers, Payroll-Benefits und Partner-Fulfillment heute. Live-Rails nur mit zertifizierten Partnern.",
          },
        ],
        formula: "Partner-Reserven + Zahlungsnetz + Governance = AURIX",
      },
      pointcoin: {
        eyebrow: "Wir stellen vor: Pointcoin",
        h2: "Echtes Gold, bis auf den Punkt genau.",
        body: "Pointcoin ist AURIX' atomare Eigentumseinheit — unser BPC-Standard (Base Precious Coin). Jeder Pointcoin entspricht genau 0,0001 g eingelagertem Gold oder Silber, geprägt in dem Moment, in dem eine Einzahlung verifiziert wird, und vernichtet in dem Moment, in dem er eingelöst wird. Keine Versprechen, kein synthetisches Risiko — nur physische Reserven, tokenisiert bis auf einen teilbaren, ausgebbaren Punkt.",
        checks: [
          "Vollständig zugewiesenes Eigentum — rechtlich, nicht nur Preisrisiko",
          "Direkt nutzbar für Zahlungen, Überweisungen, Ersparnisse und goldbesicherte Kredite",
          "Kontinuierlicher Reservenachweis — die ausgegebene Menge kann das eingelagerte Metall nie übersteigen",
        ],
        facts: [
          { value: "0,0001 g", label: "Kleinste Einheit — ein Pointcoin, ermöglicht echtes Mikroeigentum" },
          { value: "1:1", label: "Jeder ausgegebene Pointcoin wird durch eingelagertes Gold oder Silber gedeckt" },
          { value: "Practice", label: "Web- & Mobile-Übungsguthaben heute — Live-Reserven demnächst" },
        ],
        link: "Das vollständige Tokenisierungsmodell lesen →",
      },
      platform: {
        eyebrow: "Digitales Eigentum neu gedacht",
        h2: "Die All-in-one-Vermögensplattform",
        groups: [
          {
            title: "Einheitliches Multi-Wallet",
            items: [
              "Echtzeitansicht von Gold-, Silber-, Fiat- und Krypto-Vermögenswerten",
              "Nahtloser Wechsel zwischen Assets und sofortige Liquidität",
              "Integrierte Marktdaten für fundierte Entscheidungen",
            ],
          },
          {
            title: "Handel mit physischen Vermögenswerten",
            items: [
              "Echtes Gold sofort per Mobilgerät kaufen, verkaufen und aufbewahren",
              "Direkte Zuweisung zu physischen Barren in geprüften Tresoren",
              "Reibungsloser Einstieg in die Edelmetallmärkte",
            ],
          },
          {
            title: "Globale Zahlungen",
            items: [
              "NFC-, QR- und P2P-Zahlungen für den täglichen Einzelhandel",
              "Scharia-konforme, goldbesicherte Kreditlinien",
              '„Save Now Buy Later" — innovative Finanzwerkzeuge',
            ],
          },
        ],
      },
      architecture: {
        eyebrow: "Middleware-Integration",
        h2: "Die zweistufige Architektur",
        layer1Label: "01   Reserveebene",
        layer1Items: [
          "Physisches Gold/Silber, gelagert in weltweit geprüften, sicheren Tresoren.",
          "Zero-Knowledge-Proof (ZKP)-Verifizierung der Vermögenszuweisung.",
          "KI-gestützte Anomalieerkennung zur Echtzeitüberwachung der Reserven.",
          "Kryptografische Verknüpfung zwischen physischen Barren und digitalen Einheiten.",
        ],
        layer2Label: "02   Zahlungsebene",
        layer2Items: [
          "Hochleistungsfähige, wallet-basierte Abwicklung für sofortiges Clearing.",
          "Echtzeitabgleich mit der zugrunde liegenden Reserveebene.",
          "Nahtlose Integration mit NFC-, QR- und P2P-Zahlungswegen.",
          "Skalierbare Architektur für globale Einzelhandelstransaktionsvolumen.",
        ],
        footer: "Systemintegrität — Echtzeitabgleich gewährleistet jederzeit eine 1:1-Deckung.",
      },
      market: {
        eyebrow: "Marktchance",
        h2: "Schnittmenge vier großer Märkte",
        stats: [
          { value: "2 Bio. $+", label: "Globaler Zahlungsmarkt, reif für stabile, vermögensbesicherte Disruption" },
          { value: "13 Bio. $+", label: "Globaler Goldmarkt, jetzt über digitale Liquidität zugänglich" },
          { value: "4 Bio. $+", label: "Ethischer Finanzsektor auf der Suche nach Scharia-konformen Produkten" },
          { value: "1 Bio. $+", label: "Tokenisierung realer Vermögenswerte (RWA) und digitales Eigentum" },
        ],
      },
      revenue: {
        eyebrow: "Skalierbar & vermögensschonend",
        h2: "Diversifizierte Einnahmequellen",
        body: "AURIX ist eine Infrastrukturebene — kein Verwahrer. Wir lagern keine Vermögenswerte; wir verbinden Nutzer über sichere APIs mit physischen Reserven.",
        streams: [
          { title: "Transaktionen", body: "Gebühren auf Sofortzahlungen, globale Überweisungen und P2P-Abwicklungen." },
          { title: "Asset-Spread", body: "Wettbewerbsfähige Spanne beim Kauf/Verkauf von physischem Gold und Silber." },
          { title: "Tresor-Partner", body: "Provisionen von globalen Einlagerungs- und Verwahrungspartnern." },
          { title: "Ethische Kreditvergabe", body: "Scharia-konforme Servicegebühren auf goldbesicherte Kreditlinien." },
          { title: "Abonnements", body: "Gestaffelte Premiumfunktionen für Vielnutzer im Privat- und Institutionsgeschäft." },
          { title: "B2B-Lizenzierung", body: "API-Lizenzierung für Banken und Fintechs zur Bereitstellung vermögensbesicherter Dienste." },
        ],
      },
      competitive: {
        eyebrow: "Mehr als Stablecoins",
        h2: "Wettbewerbslandschaft",
        currentTitle: "Der aktuelle Markt",
        currentItems: [
          "DeFi für reale Vermögenswerte mit komplexen, illiquiden Strukturen.",
          "Plattformen für Bruchteilseigentum, nur für Investitionszwecke.",
          "Stablecoins, gedeckt durch Schulden oder algorithmische Versprechen.",
        ],
        standardTitle: "Der AURIX-Standard",
        standardItems: [
          { strong: "Physische Realität:", rest: "gedeckt durch echtes Gold/Silber, nicht nur Code." },
          { strong: "Alltagsnutzen:", rest: "konzipiert für sofortige Einzelhandelstransaktionen." },
          { strong: "KI-Verifizierung:", rest: "Echtzeitprüfungen mittels KI und Physik." },
        ],
      },
      insights: {
        eyebrow: "AURIX Insights",
        h2: "Nachrichten & Marktperspektive",
        posts: [
          {
            tag: "Marktupdate",
            title: "Warum Gold seine Rolle als monetärer Anker zurückerobert",
            excerpt:
              "Zentralbanken kaufen so viel Gold wie seit Jahrzehnten nicht mehr, um sich gegen Währungsentwertung abzusichern — was das für Sparer bedeutet.",
          },
          {
            tag: "Regulierung",
            title: "Der regulatorische Weg für vermögensbesichertes digitales Geld",
            excerpt:
              "Wie sich konforme, voll zugewiesene goldbesicherte Token von algorithmischen und fiat-besicherten Stablecoins unter neuen Regelwerken unterscheiden.",
          },
          {
            tag: "Produkt",
            title: "Einblick in AURIX' kontinuierlichen Reservenachweis",
            excerpt:
              "Ein Blick darauf, wie KI-gestützter Abgleich ausgegebene Pointcoin-Guthaben in Echtzeit kryptografisch an eingelagertes Metall bindet.",
          },
        ],
        note: "Illustrativer Inhalt — der AURIX-Blog kommt bald.",
      },
    },
    login: {
      signInTitle: "Bei AURIX anmelden",
      registerTitle: "AURIX-Konto erstellen",
      connectsNote: "Verbindet sich mit der Live-API von services/backend. Nach der Anmeldung gelangen Sie zum AURIX-Wallet-Dashboard.",
      fullName: "Vollständiger Name",
      email: "E-Mail",
      password: "Passwort",
      pleaseWait: "Bitte warten…",
      signIn: "Anmelden",
      createAccount: "Konto erstellen",
      needAccount: "Noch kein Konto? Registrieren",
      haveAccount: "Bereits ein Konto? Anmelden",
      or: "oder",
      genericError: "Die AURIX-API war nicht erreichbar. Bitte versuchen Sie es in Kürze erneut.",
    },
  },
  ar: {
    pages: pageDictionaries.ar,
    nav: {
      personal: "الأفراد",
      send: "إرسال الذهب",
      partnerWithUs: "كن شريكًا",
      howItWorks: "كيف يعمل",
      features: "المزايا",
      demo: "عرض توضيحي",
      markets: "الأسواق",
      pricing: "الأسعار",
      security: "الأمان",
      about: "من نحن",
      contact: "تواصل معنا",
      aiGovernance: "الذكاء الاصطناعي والحوكمة",
      reserveTransparency: "شفافية الاحتياطي",
      whitepaper: "الورقة البيضاء",
      partners: "الشركاء",
      careers: "الوظائف",
      investors: "المستثمرون",
      download: "تحميل",
      waitlist: "قائمة الانتظار",
      webApp: "فتح تطبيق الويب",
      business: "الأعمال",
      payroll: "ميزة الرواتب",
    },
    header: {
      login: "تسجيل الدخول",
      signup: "ابدأ",
      dashboard: "فتح تطبيق الويب",
      signout: "تسجيل الخروج",
      tryDemo: "جرّب العرض",
    },
    footer: {
      tagline:
        "ثقة مُقاسة. مال رقمي حقيقي. طبقة تنسيق منظمة تربط احتياطيات حقيقية من الذهب والفضة بشبكة مدفوعات عالمية فورية.",
      disclaimer: "لا تحتفظ AURIX بعهدة الأموال أو المعادن أو العملات المشفرة أو الأوراق المالية.",
      rights: "AURIX. جميع الحقوق محفوظة.",
      tagline2: "قيمة حقيقية، بصيغة رقمية.",
      sections: {
        Product: "المنتج",
        Trust: "الثقة",
        Company: "الشركة",
      },
    },
    appStore: {
      comingSoonApple: "قريبًا على",
      appStore: "App Store",
      comingSoonGoogle: "قريبًا على",
      googlePlay: "Google Play",
      downloadAndroid: "معاينة متاحة —",
    },
    cta: {
      title: "كن أول من ينضم عند افتتاح أبواب AURIX.",
      description:
        "أنشئ حسابك للحصول على وصول مبكر، وأسعار الأعضاء المؤسسين، وتحديثات مع انتقالنا من التصميم إلى المنتج الأولي.",
      primary: "أنشئ حسابك",
      secondary: "اقرأ الورقة البيضاء",
      loggedInTitle: "مرحبًا بعودتك.",
      loggedInDescription: "انتقل إلى لوحة التحكم للتحقق من الأرصدة، وتحويل الأموال، وإدارة حسابك.",
    },
    home: {
      eyebrowHero: "مال مرتبط بالذهب للأفراد والشركات",
      brandHero: "AURIX",
      h1Line1: "ثقة مُقاسة.",
      h1Line2: "مال رقمي حقيقي.",
      sub: "محافظ ومدفوعات وتوصيل ذهب عبر الشركاء ومزايا أصحاب العمل — تدرّب اليوم. الحفظ الحي يبقى مغلقًا حتى الاعتماد.",
      ctaPrimary: "ابدأ",
      ctaSecondary: "بدء وضع التدريب",
      ctaDemo: "شاهد الجولة",
      ctaBusiness: "للشركات",
      trustRow: [
        "محافظ تجريبية حية",
        "ممرات الشركاء قيد البناء",
        "تقديم الرواتب مفتوح",
        "الحفظ مغلق بصدق",
      ],
      ops: {
        eyebrow: "المنتج",
        h2: "كل ما يحرّك القيمة — في مكان واحد",
        sub: "مرّر فوق قدرة لمعاينتها. سكك تجريبية اليوم؛ المنح الحية وادعاءات الخزنة متوقفة حتى الاعتماد.",
        items: [
          {
            id: "wallet",
            title: "محفظة متعددة",
            body: "جيوب ذهب وفضة ونقد مع دفع وإرسال وتداول تجريبي — حساب واحد للشخصي والأعمال.",
            points: [
              "شخصي · أعمال · عائلة",
              "أرصدة تجريبية — بلا ادعاءات حفظ حية",
              "إحساس المنتج قبل الاعتماد",
            ],
            href: "/app/?tour=1",
            cta: "افتح المحفظة التجريبية",
          },
          {
            id: "send",
            title: "أرسل الذهب",
            body: "ذهب عبر الحدود للعملاء، ينفّذه شركاء المجوهرات والسبائك في ممرك.",
            points: [
              "تحتفظ بعلاقة المُرسل",
              "الشركاء يربحون من الاستلام والتوصيل",
              "تركيز SA · EG · KW · AE · QA",
            ],
            href: "/send/",
            cta: "أرسل الذهب",
          },
          {
            id: "payroll",
            title: "ميزة الرواتب",
            body: "أصحاب العمل يمنحون ذهبًا مملوكًا كمنفعة عينية واعية ضريبيًا — إضافة للراتب وليس بديلاً.",
            points: [
              "شهري ~€50 أو سنوي ~€10,000",
              "إقرار بالإضافة مطلوب",
              "سجّل شركتك لمراجعة KYB",
            ],
            href: "/for-business/payroll/",
            cta: "سجّل شركتك",
          },
          {
            id: "partners",
            title: "الشركاء",
            body: "انضم لشبكة الذهب كخدمة — اظهر في المحدد بعد الموافقة واسترد عند المنضدة.",
            points: [
              "لوحة شريك للمخزون والأرباح",
              "بدون رسوم إعداد لبدء المحادثة",
              "تفعيل ممرًا بممر",
            ],
            href: "/partner-with-us/",
            cta: "كن شريكًا",
          },
        ],
      },
      pathsEyebrow: "لمن صُممت",
      pathsH2: "منصة واحدة. أربع مداخل.",
      pathsSub:
        "اختر مسارًا لمعاينة السطح — العملاء أو الشركات أو الشركاء أو رأس المال.",
      paths: [
        {
          id: "b2c",
          model: "B2C",
          title: "العملاء",
          body: "محفظة متعددة بأسلوب البنوك الرقمية: جيوب ذهب وفضة ونقد مع دفع وإرسال وتداول تجريبي.",
          highlights: [
            "شخصية · أعمال · أطفال في حساب واحد",
            "مدفوعات ومبادلات تجريبية اليوم",
            "الحفظ الحي يبقى مغلقًا حتى الاعتماد",
          ],
          href: "/app/?tour=1",
          cta: "افتح المحفظة التجريبية",
          visualLabel: "تطبيق شخصي",
        },
        {
          id: "b2b",
          model: "B2B",
          title: "الشركات",
          body: "خزينة وجيوب رواتب وعوّامة تجّار ومقاعد فريق — للمشغّلين الذين يحتاجون قيمة مرتبطة بالذهب في الدفاتر.",
          highlights: [
            "خزينة تشغيل بتحكم على مستوى الجيب",
            "تدفقات الرواتب ومدفوعات التجّار",
            "شركاء البنوك والمدفوعات والاستثمار",
          ],
          href: "/for-business/payroll/",
          cta: "استكشف ميزة الرواتب",
          visualLabel: "خزينة الأعمال",
        },
        {
          id: "b2b2c",
          model: "B2B2C",
          title: "الشركاء",
          body: "متاجر المجوهرات والسبائك تُنفّذ الذهب لعملائك. أنت تملك علاقة المُرسل؛ الشركاء يربحون من الاستلام والتوصيل.",
          highlights: [
            "أرسل الذهب عبر SA · EG · KW · AE · QA",
            "محدد مواقع + لوحة استرداد للشركاء",
            "بدون رسوم إعداد لبدء المحادثة",
          ],
          href: "/partner-with-us/",
          cta: "كن شريكًا",
          visualLabel: "شبكة الشركاء",
        },
        {
          id: "investors",
          model: "رأس المال",
          title: "المستثمرون",
          body: "أطروحة المنصة والمعالم ونموذج IR مباشر — وضع مبكر صادق بلا ادعاءات حفظ حية وهمية.",
          highlights: [
            "منتج تجريبي وممرات شركاء أولًا",
            "سكك مرخّصة قبل التسوية الحية",
            "استفسار مباشر لعلاقات المستثمرين",
          ],
          href: "/investors",
          cta: "علاقات المستثمرين",
          visualLabel: "خارطة IR",
        },
      ],
      problem: {
        eyebrow: "المشكلة",
        h2: "نظام مالي مُختل",
        quote: "لا يوجد نظام يجمع بين القيمة الحقيقية والاستقرار وقابلية الاستخدام العالمية.",
        items: [
          {
            number: "01",
            title: "تضخم العملات الورقية",
            body: "تفقد العملات التقليدية قوتها الشرائية بمعدل متسارع. المدخرات متاحة، لكنها لم تعد محمية من التآكل المنهجي.",
          },
          {
            number: "02",
            title: "تقلب العملات المشفرة",
            body: "توفر الأصول الرقمية سرعة، لكنها تفتقر إلى الاستقرار اللازم للاستخدام التجاري الحقيقي. حلّت المضاربة محل المنفعة في الحدود الرقمية.",
          },
          {
            number: "03",
            title: "فجوة الملكية",
            body: "توفر المنصات الحديثة وصولًا رقميًا لكنها غالبًا تفتقر إلى ملكية حقيقية للأصل الأساسي. يمتلك المستخدمون وعودًا، لا واقعًا ماديًا.",
          },
        ],
      },
      solution: {
        eyebrow: "الحل",
        h2: "فئة جديدة من المال",
        items: [
          {
            title: "نظام احتياطي هجين",
            body: "كل وحدة مدعومة بنسبة 100% بذهب وفضة ماديين مخزنين في خزائن آمنة وخاضعة للتدقيق. نحن نسد الفجوة بين الواقع المادي والسرعة الرقمية.",
          },
          {
            title: "تدقيق مستمر بالذكاء الاصطناعي",
            body: "يضمن التحقق التشفيري الفوري والمراقبة المدفوعة بالذكاء الاصطناعي تطابق الوحدات الرقمية دائمًا مع الاحتياطيات المادية. الثقة تُقاس، لا تُوعد.",
          },
          {
            title: "منفعة عالمية فورية",
            body: "شبكة مدفوعات عالية الأداء تجعل المعادن الثمينة سائلة كالنقد — قابلة للاستخدام الفوري للتحويلات والمدفوعات في التجزئة والادخار.",
          },
        ],
        formula: "احتياطي أصول حقيقي + شبكة مدفوعات رقمية = AURIX",
      },
      pointcoin: {
        eyebrow: "نقدّم لكم Pointcoin",
        h2: "ذهب حقيقي، حتى آخر نقطة.",
        body: "Pointcoin هي وحدة الملكية الذرية في AURIX — معيارنا BPC (العملة الثمينة الأساسية). يمثل كل Pointcoin بالضبط 0.0001 غرام من الذهب أو الفضة المخزّنة في الخزائن، يُسك لحظة التحقق من الإيداع ويُتلف لحظة استرداده. لا وعود، لا تعرض اصطناعي — فقط احتياطيات مادية، مرمّزة حتى نقطة قابلة للتجزئة والإنفاق.",
        checks: [
          "ملكية مخصصة بالكامل — قانونية، وليست مجرد تعرض للسعر",
          "تُستخدم مباشرة للمدفوعات والتحويلات والادخار والضمانات المدعومة بالذهب",
          "إثبات احتياطي مستمر — لا يمكن أن تتجاوز الكمية المُصدرة المعدن المخزّن أبدًا",
        ],
        facts: [
          { value: "0.0001غ", label: "أصغر وحدة — Pointcoin واحدة، تتيح ملكية جزئية حقيقية" },
          { value: "1:1", label: "كل Pointcoin مُصدرة مقابلة بذهب أو فضة مخزّنة" },
          { value: "24/7", label: "إثبات احتياطي مدقق بالذكاء الاصطناعي، يُتحقق منه باستمرار عبر واجهات الخزائن" },
        ],
        link: "اقرأ نموذج الترميز الكامل ←",
      },
      platform: {
        eyebrow: "إعادة ابتكار الملكية الرقمية",
        h2: "منصة الأصول الشاملة",
        groups: [
          {
            title: "محفظة موحدة متعددة الأصول",
            items: [
              "عرض فوري لأصول الذهب والفضة والعملات الورقية والمشفرة",
              "تبديل سلس بين الأصول وسيولة فورية",
              "بيانات سوق متكاملة لاتخاذ قرارات مستنيرة",
            ],
          },
          {
            title: "تداول الأصول المادية",
            items: [
              "شراء وبيع وتخزين ذهب حقيقي فوريًا عبر الهاتف المحمول",
              "تخصيص مباشر لسبائك مادية في خزائن مدققة",
              "دخول سلس تمامًا إلى أسواق المعادن الثمينة",
            ],
          },
          {
            title: "مدفوعات عالمية",
            items: [
              "مدفوعات NFC وQR وP2P للاستخدام اليومي في التجزئة",
              "خطوط ائتمان مدعومة بالذهب ومتوافقة مع الشريعة",
              "أدوات مالية مبتكرة \"ادّخر الآن، اشترِ لاحقًا\"",
            ],
          },
        ],
      },
      architecture: {
        eyebrow: "تكامل الطبقة الوسيطة",
        h2: "المعمارية ذات الطبقتين",
        layer1Label: "01   طبقة الاحتياطي",
        layer1Items: [
          "ذهب/فضة مادية مخزّنة في خزائن آمنة ومدققة عالميًا.",
          "التحقق بإثبات المعرفة الصفرية (ZKP) لتخصيص الأصول.",
          "كشف الشذوذ المدفوع بالذكاء الاصطناعي لمراقبة الاحتياطي في الوقت الفعلي.",
          "رابط تشفيري بين السبائك المادية والوحدات الرقمية.",
        ],
        layer2Label: "02   طبقة المدفوعات",
        layer2Items: [
          "تسوية عالية الأداء قائمة على المحفظة للمقاصة الفورية.",
          "تسوية آنية مع طبقة الاحتياطي الأساسية.",
          "تكامل سلس مع قنوات دفع NFC وQR وP2P.",
          "معمارية قابلة للتوسع مصممة لحجم معاملات التجزئة العالمية.",
        ],
        footer: "سلامة النظام — التسوية الآنية تضمن دعمًا بنسبة 1:1 في كل الأوقات.",
      },
      market: {
        eyebrow: "الفرصة السوقية",
        h2: "تقاطع أربعة أسواق عملاقة",
        stats: [
          { value: "+2 تريليون دولار", label: "سوق المدفوعات العالمي، جاهز لتحول مستقر ومدعوم بالأصول" },
          { value: "+13 تريليون دولار", label: "سوق الذهب العالمي، أصبح متاحًا الآن عبر السيولة الرقمية" },
          { value: "+4 تريليون دولار", label: "قطاع التمويل الأخلاقي الباحث عن منتجات متوافقة مع الشريعة" },
          { value: "+1 تريليون دولار", label: "ترميز الأصول الواقعية (RWA) والملكية الرقمية" },
        ],
      },
      revenue: {
        eyebrow: "قابل للتوسع وخفيف الأصول",
        h2: "مصادر إيرادات متنوعة",
        body: "AURIX طبقة بنية تحتية — وليست جهة حفظ. نحن لا نخزّن الأصول؛ بل نربط المستخدمين بالاحتياطيات المادية عبر واجهات برمجية آمنة.",
        streams: [
          { title: "المعاملات", body: "رسوم على المدفوعات الفورية والتحويلات العالمية وتسويات الند للند." },
          { title: "هامش الأصول", body: "هامش تنافسي على شراء/بيع الذهب والفضة الماديين." },
          { title: "شركاء الخزائن", body: "عمولات من شركاء التخزين والحفظ العالميين." },
          { title: "الإقراض الأخلاقي", body: "رسوم خدمة متوافقة مع الشريعة على خطوط الائتمان المدعومة بالذهب." },
          { title: "الاشتراكات", body: "مزايا مميزة متدرجة لمستخدمي التجزئة والمؤسسات ذوي الحجم الكبير." },
          { title: "الترخيص للشركات", body: "ترخيص واجهات برمجية للبنوك وشركات التكنولوجيا المالية لتقديم خدمات مدعومة بالأصول." },
        ],
      },
      competitive: {
        eyebrow: "أبعد من العملات المستقرة",
        h2: "المشهد التنافسي",
        currentTitle: "السوق الحالي",
        currentItems: [
          "تمويل لامركزي للأصول الحقيقية بهياكل معقدة وغير سائلة.",
          "منصات ملكية جزئية للاستثمار فقط.",
          "عملات مستقرة مدعومة بالديون أو بوعود خوارزمية.",
        ],
        standardTitle: "معيار AURIX",
        standardItems: [
          { strong: "واقع مادي:", rest: "مدعوم بذهب/فضة حقيقيين، وليس مجرد كود برمجي." },
          { strong: "منفعة يومية:", rest: "مصمم لمعاملات التجزئة الفورية." },
          { strong: "تحقق بالذكاء الاصطناعي:", rest: "تدقيق فوري عبر الذكاء الاصطناعي والفيزياء." },
        ],
      },
      insights: {
        eyebrow: "رؤى AURIX",
        h2: "الأخبار ومنظور السوق",
        posts: [
          {
            tag: "تحديث السوق",
            title: "لماذا يستعيد الذهب دوره كمرساة نقدية",
            excerpt:
              "بلغ شراء البنوك المركزية للذهب أعلى مستوياته منذ عقود مع تحوّط المؤسسات ضد تآكل العملات — وهذا ما يعنيه للمدخرين العاديين.",
          },
          {
            tag: "التنظيم",
            title: "المسار التنظيمي للمال الرقمي المدعوم بالأصول",
            excerpt:
              "كيف تختلف الرموز المدعومة بالذهب المتوافقة والمخصصة بالكامل عن العملات المستقرة الخوارزمية والمضمونة بالعملات الورقية بموجب الأطر الناشئة.",
          },
          {
            tag: "المنتج",
            title: "نظرة داخل إثبات الاحتياطي المستمر لدى AURIX",
            excerpt:
              "نظرة على كيفية إبقاء التسوية المدفوعة بالذكاء الاصطناعي أرصدة Pointcoin المُصدرة مرتبطة تشفيريًا بالمعدن المخزّن، في الوقت الفعلي.",
          },
        ],
        note: "محتوى توضيحي — مدونة AURIX قادمة قريبًا.",
      },
    },
    login: {
      signInTitle: "تسجيل الدخول إلى AURIX",
      registerTitle: "إنشاء حساب AURIX",
      connectsNote: "يتصل بواجهة برمجة services/backend الحية. بعد تسجيل الدخول، ستنتقل إلى لوحة تحكم محفظة AURIX.",
      fullName: "الاسم الكامل",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      pleaseWait: "الرجاء الانتظار…",
      signIn: "تسجيل الدخول",
      createAccount: "إنشاء حساب",
      needAccount: "ليس لديك حساب؟ سجّل الآن",
      haveAccount: "لديك حساب بالفعل؟ سجّل الدخول",
      or: "أو",
      genericError: "تعذّر الوصول إلى واجهة برمجة AURIX. يرجى المحاولة مرة أخرى بعد قليل.",
    },
  },
};
