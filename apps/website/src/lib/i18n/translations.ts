export type Locale = "en" | "de" | "ar";

export const LOCALES: { code: Locale; label: string; dir: "ltr" | "rtl" }[] = [
  { code: "en", label: "English", dir: "ltr" },
  { code: "de", label: "Deutsch", dir: "ltr" },
  { code: "ar", label: "العربية", dir: "rtl" },
];

export interface Dictionary {
  nav: {
    howItWorks: string;
    features: string;
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
  };
  header: {
    login: string;
    signup: string;
    dashboard: string;
    signout: string;
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
    h1Line1: string;
    h1Line2: string;
    sub: string;
    ctaPrimary: string;
    ctaSecondary: string;
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
    nav: {
      howItWorks: "How It Works",
      features: "Features",
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
    },
    header: {
      login: "Log in",
      signup: "Sign up",
      dashboard: "Dashboard",
      signout: "Sign out",
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
      eyebrowHero: "The Fintech Revolution — 2026",
      h1Line1: "Measured Trust.",
      h1Line2: "Real Digital Money.",
      sub: "AURIX combines gold- and silver-backed reserves, AI-driven auditing, and an instant global payment network — a new category of money for the post-fiat era.",
      ctaPrimary: "Create your account",
      ctaSecondary: "See How It Works",
      problem: {
        eyebrow: "The Problem",
        h2: "A broken financial system",
        quote: "There is no system that combines real value, stability, and global usability.",
        items: [
          {
            number: "01",
            title: "Fiat Inflation",
            body: "Traditional currencies are losing purchasing power at an accelerating rate. Savings are accessible, but no longer protected from systemic devaluation.",
          },
          {
            number: "02",
            title: "Crypto Volatility",
            body: "Digital assets offer speed but lack the stability required for real-world commercial use. Speculation has replaced utility in the digital frontier.",
          },
          {
            number: "03",
            title: "The Ownership Gap",
            body: "Modern platforms provide digital access but often lack true underlying asset ownership. Users hold promises, not physical reality.",
          },
        ],
      },
      solution: {
        eyebrow: "The Solution",
        h2: "A new category of money",
        items: [
          {
            title: "Hybrid Reserve System",
            body: "Every unit is 100% backed by physical gold and silver stored in high-security, audited vaults. We bridge the gap between physical reality and digital speed.",
          },
          {
            title: "Continuous AI Audit",
            body: "Real-time cryptographic verification and AI-driven monitoring ensure that digital units always match physical reserves. Trust is measured, not promised.",
          },
          {
            title: "Instant Global Utility",
            body: "A high-performance payment network that makes precious metals as liquid as cash — instantly usable for transfers, retail payments, and savings.",
          },
        ],
        formula: "Real Asset Reserve + Digital Payment Network = AURIX",
      },
      pointcoin: {
        eyebrow: "Introducing Pointcoin",
        h2: "Real gold, down to the point.",
        body: "Pointcoin is AURIX's atomic unit of ownership — our BPC (Base Precious Coin) standard. Every Pointcoin represents exactly 0.0001g of vaulted gold or silver, minted the moment a deposit is verified and burned the moment it's redeemed. No promises, no synthetic exposure — just physical reserves, tokenized down to a fractionable, spendable point.",
        checks: [
          "Fully allocated ownership — legal, not just price exposure",
          "Used directly for payments, transfers, savings, and gold-backed collateral",
          "Continuous proof-of-reserve — issued supply can never exceed vaulted metal",
        ],
        facts: [
          { value: "0.0001g", label: "Smallest unit — one Pointcoin, enabling true micro-ownership" },
          { value: "1:1", label: "Every Pointcoin issued is matched by vaulted gold or silver" },
          { value: "24/7", label: "AI-audited proof-of-reserve, continuously verified against vault APIs" },
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
    nav: {
      howItWorks: "So funktioniert's",
      features: "Funktionen",
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
    },
    header: {
      login: "Anmelden",
      signup: "Registrieren",
      dashboard: "Dashboard",
      signout: "Abmelden",
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
      eyebrowHero: "Die Fintech-Revolution — 2026",
      h1Line1: "Verlässliches Vertrauen.",
      h1Line2: "Echtes digitales Geld.",
      sub: "AURIX verbindet gold- und silberbesicherte Reserven, KI-gestützte Prüfung und ein sofortiges globales Zahlungsnetzwerk — eine neue Geldkategorie für die Zeit nach dem Fiatgeld.",
      ctaPrimary: "Konto erstellen",
      ctaSecondary: "So funktioniert's",
      problem: {
        eyebrow: "Das Problem",
        h2: "Ein kaputtes Finanzsystem",
        quote: "Es gibt kein System, das echten Wert, Stabilität und globale Nutzbarkeit vereint.",
        items: [
          {
            number: "01",
            title: "Fiat-Inflation",
            body: "Traditionelle Währungen verlieren zunehmend schneller an Kaufkraft. Ersparnisse sind zugänglich, aber nicht mehr vor systemischer Entwertung geschützt.",
          },
          {
            number: "02",
            title: "Krypto-Volatilität",
            body: "Digitale Vermögenswerte bieten Geschwindigkeit, aber nicht die Stabilität, die für den realen Handelseinsatz nötig ist. Spekulation hat den Nutzen im digitalen Grenzland verdrängt.",
          },
          {
            number: "03",
            title: "Die Eigentumslücke",
            body: "Moderne Plattformen bieten digitalen Zugang, aber oft kein echtes zugrunde liegendes Eigentum. Nutzer halten Versprechen, keine physische Realität.",
          },
        ],
      },
      solution: {
        eyebrow: "Die Lösung",
        h2: "Eine neue Geldkategorie",
        items: [
          {
            title: "Hybrides Reservesystem",
            body: "Jede Einheit ist zu 100 % durch physisches Gold und Silber in hochsicheren, geprüften Tresoren gedeckt. Wir schließen die Lücke zwischen physischer Realität und digitaler Geschwindigkeit.",
          },
          {
            title: "Kontinuierliche KI-Prüfung",
            body: "Kryptografische Echtzeitverifizierung und KI-gestützte Überwachung stellen sicher, dass digitale Einheiten stets den physischen Reserven entsprechen. Vertrauen wird gemessen, nicht versprochen.",
          },
          {
            title: "Sofortiger globaler Nutzen",
            body: "Ein leistungsstarkes Zahlungsnetzwerk, das Edelmetalle so liquide wie Bargeld macht — sofort nutzbar für Überweisungen, Zahlungen im Einzelhandel und Ersparnisse.",
          },
        ],
        formula: "Reale Vermögensreserve + digitales Zahlungsnetzwerk = AURIX",
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
          { value: "24/7", label: "KI-geprüfter Reservenachweis, kontinuierlich gegen Tresor-APIs verifiziert" },
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
    nav: {
      howItWorks: "كيف يعمل",
      features: "المزايا",
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
    },
    header: {
      login: "تسجيل الدخول",
      signup: "إنشاء حساب",
      dashboard: "لوحة التحكم",
      signout: "تسجيل الخروج",
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
      eyebrowHero: "ثورة التكنولوجيا المالية — 2026",
      h1Line1: "ثقة مُقاسة.",
      h1Line2: "مال رقمي حقيقي.",
      sub: "تجمع AURIX بين احتياطيات مدعومة بالذهب والفضة، وتدقيق مدفوع بالذكاء الاصطناعي، وشبكة مدفوعات عالمية فورية — فئة جديدة من المال لعصر ما بعد العملات الورقية.",
      ctaPrimary: "أنشئ حسابك",
      ctaSecondary: "كيف يعمل",
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
