import { db } from "./db";
import { industrySectors, successCases } from "@shared/schema";

// Seed data for Industry Sectors
const sectorsData = [
  {
    name: "Retail & E-commerce",
    namePt: "Varejo & E-commerce",
    nameEn: "Retail & E-commerce",
    nameEs: "Comercio Minorista",
    nameFr: "Commerce de Détail",
    description: "Lojas físicas, e-commerce, marketplaces e experiências de compra",
    icon: "ShoppingCart",
    order: 1,
  },
  {
    name: "Healthcare & Wellness",
    namePt: "Saúde & Bem-estar",
    nameEn: "Healthcare & Wellness",
    nameEs: "Salud y Bienestar",
    nameFr: "Santé et Bien-être",
    description: "Hospitais, clínicas, aplicativos de saúde, fitness e bem-estar",
    icon: "Heart",
    order: 2,
  },
  {
    name: "Education & Training",
    namePt: "Educação & Treinamento",
    nameEn: "Education & Training",
    nameEs: "Educación y Formación",
    nameFr: "Éducation et Formation",
    description: "Escolas, universidades, cursos online, plataformas de aprendizado",
    icon: "GraduationCap",
    order: 3,
  },
  {
    name: "Technology & Software",
    namePt: "Tecnologia & Software",
    nameEn: "Technology & Software",
    nameEs: "Tecnología y Software",
    nameFr: "Technologie et Logiciels",
    description: "SaaS, aplicativos, plataformas digitais, ferramentas de produtividade",
    icon: "Laptop",
    order: 4,
  },
  {
    name: "Food & Restaurants",
    namePt: "Alimentação & Restaurantes",
    nameEn: "Food & Restaurants",
    nameEs: "Alimentación y Restaurantes",
    nameFr: "Alimentation et Restaurants",
    description: "Restaurantes, delivery, food trucks, produtos alimentícios",
    icon: "Utensils",
    order: 5,
  },
  {
    name: "Financial Services",
    namePt: "Serviços Financeiros",
    nameEn: "Financial Services",
    nameEs: "Servicios Financieros",
    nameFr: "Services Financiers",
    description: "Bancos, fintechs, investimentos, pagamentos digitais, seguros",
    icon: "DollarSign",
    order: 6,
  },
  {
    name: "Tourism & Hospitality",
    namePt: "Turismo & Hospitalidade",
    nameEn: "Tourism & Hospitality",
    nameEs: "Turismo y Hospitalidad",
    nameFr: "Tourisme et Hôtellerie",
    description: "Hotéis, viagens, experiências turísticas, hospedagem",
    icon: "Plane",
    order: 7,
  },
  {
    name: "Manufacturing & Industry",
    namePt: "Manufatura & Indústria",
    nameEn: "Manufacturing & Industry",
    nameEs: "Manufactura e Industria",
    nameFr: "Fabrication et Industrie",
    description: "Produção industrial, automação, logística, supply chain",
    icon: "Factory",
    order: 8,
  },
  {
    name: "Entertainment & Media",
    namePt: "Entretenimento & Mídia",
    nameEn: "Entertainment & Media",
    nameEs: "Entretenimiento y Medios",
    nameFr: "Divertissement et Médias",
    description: "Streaming, jogos, produção de conteúdo, redes sociais",
    icon: "Tv",
    order: 9,
  },
  {
    name: "Real Estate",
    namePt: "Imobiliário",
    nameEn: "Real Estate",
    nameEs: "Bienes Raíces",
    nameFr: "Immobilier",
    description: "Venda e locação de imóveis, construção, proptech",
    icon: "Home",
    order: 10,
  },
];

// Seed data for Success Cases
const casesData = [
  {
    name: "Airbnb",
    company: "Airbnb Inc.",
    descriptionPt: "Marketplace de hospedagem que conecta anfitriões e viajantes, revolucionando a indústria hoteleira ao permitir que qualquer pessoa alugue seu espaço",
    descriptionEn: "Hospitality marketplace connecting hosts and travelers, revolutionizing the hotel industry by allowing anyone to rent their space",
    descriptionEs: "Mercado de alojamiento que conecta anfitriones y viajeros, revolucionando la industria hotelera",
    descriptionFr: "Marché d'hébergement connectant hôtes et voyageurs, révolutionnant l'industrie hôtelière",
    logoUrl: "https://cdn.worldvectorlogo.com/logos/airbnb-2.svg",
    foundedYear: 2008,
    keyInnovation: "Economia compartilhada aplicada à hospedagem",
    businessModel: "marketplace",
    order: 1,
  },
  {
    name: "Uber",
    company: "Uber Technologies Inc.",
    descriptionPt: "Plataforma de mobilidade urbana que conecta motoristas e passageiros através de um aplicativo, transformando o transporte nas cidades",
    descriptionEn: "Urban mobility platform connecting drivers and passengers through an app, transforming city transportation",
    descriptionEs: "Plataforma de movilidad urbana que conecta conductores y pasajeros a través de una aplicación",
    descriptionFr: "Plateforme de mobilité urbaine connectant conducteurs et passagers via une application",
    logoUrl: "https://cdn.worldvectorlogo.com/logos/uber.svg",
    foundedYear: 2009,
    keyInnovation: "Mobilidade sob demanda com algoritmos de matching",
    businessModel: "marketplace",
    order: 2,
  },
  {
    name: "Netflix",
    company: "Netflix Inc.",
    descriptionPt: "Plataforma de streaming que revolucionou o consumo de entretenimento, oferecendo conteúdo ilimitado sob demanda",
    descriptionEn: "Streaming platform that revolutionized entertainment consumption, offering unlimited on-demand content",
    descriptionEs: "Plataforma de streaming que revolucionó el consumo de entretenimiento con contenido ilimitado bajo demanda",
    descriptionFr: "Plateforme de streaming qui a révolutionné la consommation de divertissement avec du contenu illimité à la demande",
    logoUrl: "https://cdn.worldvectorlogo.com/logos/netflix-3.svg",
    foundedYear: 1997,
    keyInnovation: "Streaming de conteúdo + recomendações por IA",
    businessModel: "subscription",
    order: 3,
  },
  {
    name: "Nubank",
    company: "Nu Pagamentos S.A.",
    descriptionPt: "Fintech brasileira que democratizou serviços financeiros através de um banco 100% digital sem tarifas abusivas",
    descriptionEn: "Brazilian fintech that democratized financial services through a 100% digital bank without abusive fees",
    descriptionEs: "Fintech brasileña que democratizó servicios financieros a través de un banco 100% digital sin tarifas abusivas",
    descriptionFr: "Fintech brésilienne qui a démocratisé les services financiers via une banque 100% numérique sans frais abusifs",
    logoUrl: "https://cdn.worldvectorlogo.com/logos/nubank-3.svg",
    foundedYear: 2013,
    keyInnovation: "Banco digital sem burocraciascom UX excepcional",
    businessModel: "fintech",
    order: 4,
  },
  {
    name: "iFood",
    company: "iFood",
    descriptionPt: "Maior plataforma de delivery de comida da América Latina, conectando restaurantes, entregadores e consumidores",
    descriptionEn: "Largest food delivery platform in Latin America, connecting restaurants, delivery people and consumers",
    descriptionEs: "Mayor plataforma de entrega de comida en América Latina, conectando restaurantes, repartidores y consumidores",
    descriptionFr: "Plus grande plateforme de livraison de nourriture en Amérique latine, connectant restaurants, livreurs et consommateurs",
    logoUrl: "https://logodownload.org/wp-content/uploads/2020/02/ifood-logo.png",
    foundedYear: 2011,
    keyInnovation: "Logística inteligente para delivery de comida",
    businessModel: "marketplace",
    order: 5,
  },
  {
    name: "Spotify",
    company: "Spotify AB",
    descriptionPt: "Plataforma de streaming de música que transformou como as pessoas consomem música com modelo freemium",
    descriptionEn: "Music streaming platform that transformed how people consume music with freemium model",
    descriptionEs: "Plataforma de streaming de música que transformó cómo las personas consumen música con modelo freemium",
    descriptionFr: "Plateforme de streaming musical qui a transformé la façon dont les gens consomment la musique avec un modèle freemium",
    logoUrl: "https://cdn.worldvectorlogo.com/logos/spotify-2.svg",
    foundedYear: 2006,
    keyInnovation: "Streaming de música + playlists personalizadas por IA",
    businessModel: "freemium",
    order: 6,
  },
  {
    name: "Amazon",
    company: "Amazon.com Inc.",
    descriptionPt: "Maior e-commerce do mundo, começou vendendo livros e revolucionou o varejo com entrega rápida e variedade infinita",
    descriptionEn: "World's largest e-commerce, started selling books and revolutionized retail with fast delivery and infinite variety",
    descriptionEs: "Mayor comercio electrónico del mundo, comenzó vendiendo libros y revolucionó el comercio minorista",
    descriptionFr: "Plus grand commerce électronique au monde, a commencé par vendre des livres et révolutionné le commerce de détail",
    logoUrl: "https://cdn.worldvectorlogo.com/logos/amazon-1.svg",
    foundedYear: 1994,
    keyInnovation: "E-commerce escalável + logística ultrarrápida",
    businessModel: "ecommerce",
    order: 7,
  },
  {
    name: "Tesla",
    company: "Tesla Inc.",
    descriptionPt: "Fabricante de veículos elétricos que acelerou a transição mundial para energia sustentável através de design inovador",
    descriptionEn: "Electric vehicle manufacturer that accelerated the world's transition to sustainable energy through innovative design",
    descriptionEs: "Fabricante de vehículos eléctricos que aceleró la transición mundial a la energía sostenible",
    descriptionFr: "Fabricant de véhicules électriques qui a accéléré la transition mondiale vers l'énergie durable",
    logoUrl: "https://cdn.worldvectorlogo.com/logos/tesla-9.svg",
    foundedYear: 2003,
    keyInnovation: "Veículos elétricos premium + piloto automático",
    businessModel: "manufacturing",
    order: 8,
  },
  {
    name: "Duolingo",
    company: "Duolingo Inc.",
    descriptionPt: "Plataforma de aprendizado de idiomas gamificada que democratizou a educação linguística com metodologia divertida",
    descriptionEn: "Gamified language learning platform that democratized language education with fun methodology",
    descriptionEs: "Plataforma gamificada de aprendizaje de idiomas que democratizó la educación lingüística",
    descriptionFr: "Plateforme gamifiée d'apprentissage des langues qui a démocratisé l'éducation linguistique",
    logoUrl: "https://cdn.worldvectorlogo.com/logos/duolingo-2.svg",
    foundedYear: 2011,
    keyInnovation: "Gamificação aplicada ao aprendizado de idiomas",
    businessModel: "freemium",
    order: 9,
  },
  {
    name: "Canva",
    company: "Canva Pty Ltd",
    descriptionPt: "Plataforma de design gráfico simplificado que democratizou o design permitindo que qualquer pessoa crie conteúdo visual profissional",
    descriptionEn: "Simplified graphic design platform that democratized design allowing anyone to create professional visual content",
    descriptionEs: "Plataforma de diseño gráfico simplificado que democratizó el diseño permitiendo a cualquiera crear contenido visual profesional",
    descriptionFr: "Plateforme de conception graphique simplifiée qui a démocratisé le design permettant à quiconque de créer du contenu visuel professionnel",
    logoUrl: "https://cdn.worldvectorlogo.com/logos/canva-1.svg",
    foundedYear: 2012,
    keyInnovation: "Design gráfico intuitivo + templates prontos",
    businessModel: "freemium",
    order: 10,
  },
];

export async function seedAIData() {
  console.log("🌱 Seeding industry sectors and success cases...");

  try {
    // Seed Industry Sectors
    console.log("  📊 Seeding industry sectors...");
    const insertedSectors = await db.insert(industrySectors).values(sectorsData).returning();
    console.log(`  ✅ Inserted ${insertedSectors.length} industry sectors`);

    // Create a map of sector names to IDs for reference
    const sectorMap: Record<string, string> = {};
    insertedSectors.forEach((sector) => {
      sectorMap[sector.name] = sector.id;
    });

    // Link success cases to their sectors
    const casesWithSectors = casesData.map((caseData) => {
      let sectorId: string | undefined = undefined;

      // Map cases to sectors
      if (caseData.name === "Airbnb") sectorId = sectorMap["Tourism & Hospitality"];
      if (caseData.name === "Uber") sectorId = sectorMap["Technology & Software"];
      if (caseData.name === "Netflix") sectorId = sectorMap["Entertainment & Media"];
      if (caseData.name === "Nubank") sectorId = sectorMap["Financial Services"];
      if (caseData.name === "iFood") sectorId = sectorMap["Food & Restaurants"];
      if (caseData.name === "Spotify") sectorId = sectorMap["Entertainment & Media"];
      if (caseData.name === "Amazon") sectorId = sectorMap["Retail & E-commerce"];
      if (caseData.name === "Tesla") sectorId = sectorMap["Manufacturing & Industry"];
      if (caseData.name === "Duolingo") sectorId = sectorMap["Education & Training"];
      if (caseData.name === "Canva") sectorId = sectorMap["Technology & Software"];

      return {
        ...caseData,
        sectorId,
      };
    });

    // Seed Success Cases
    console.log("  🚀 Seeding success cases...");
    const insertedCases = await db.insert(successCases).values(casesWithSectors).returning();
    console.log(`  ✅ Inserted ${insertedCases.length} success cases`);

    console.log("🎉 AI data seeding completed successfully!");
    return { sectors: insertedSectors, cases: insertedCases };
  } catch (error) {
    console.error("❌ Error seeding AI data:", error);
    throw error;
  }
}

// Run seed if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedAIData()
    .then(() => {
      console.log("Done!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed:", error);
      process.exit(1);
    });
}
