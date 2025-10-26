import { db } from "./db";
import { industrySectors } from "@shared/schema";
import { sql } from "drizzle-orm";

const sectors = [
  {
    id: "sector_tech",
    name: "Technology & Software",
    namePt: "Tecnologia & Software",
    nameEn: "Technology & Software",
    nameEs: "Tecnología y Software",
    nameFr: "Technologie et Logiciels",
    description: "SaaS, aplicativos móveis, plataformas digitais, desenvolvimento de software",
    descriptionPt: "SaaS, aplicativos móveis, plataformas digitais, desenvolvimento de software",
    descriptionEn: "SaaS, mobile apps, digital platforms, software development",
    descriptionEs: "SaaS, aplicaciones móviles, plataformas digitales, desarrollo de software",
    descriptionFr: "SaaS, applications mobiles, plateformes numériques, développement logiciel",
    icon: "Laptop",
    isActive: true,
  },
  {
    id: "sector_ecommerce",
    name: "E-commerce & Retail",
    namePt: "E-commerce & Varejo",
    nameEn: "E-commerce & Retail",
    nameEs: "Comercio Electrónico y Minorista",
    nameFr: "E-commerce et Commerce de Détail",
    description: "Lojas online, marketplaces, varejo digital, comércio eletrônico",
    descriptionPt: "Lojas online, marketplaces, varejo digital, comércio eletrônico",
    descriptionEn: "Online stores, marketplaces, digital retail, e-commerce",
    descriptionEs: "Tiendas en línea, mercados, comercio digital, comercio electrónico",
    descriptionFr: "Boutiques en ligne, places de marché, commerce numérique, e-commerce",
    icon: "ShoppingCart",
    isActive: true,
  },
  {
    id: "sector_health",
    name: "Healthcare & Wellness",
    namePt: "Saúde & Bem-estar",
    nameEn: "Healthcare & Wellness",
    nameEs: "Salud y Bienestar",
    nameFr: "Santé et Bien-être",
    description: "Hospitais, clínicas, aplicativos de saúde, fitness e bem-estar",
    descriptionPt: "Hospitais, clínicas, aplicativos de saúde, fitness e bem-estar",
    descriptionEn: "Hospitals, clinics, health apps, fitness and wellness",
    descriptionEs: "Hospitales, clínicas, aplicaciones de salud, fitness y bienestar",
    descriptionFr: "Hôpitaux, cliniques, applications de santé, fitness et bien-être",
    icon: "Heart",
    isActive: true,
  },
  {
    id: "sector_education",
    name: "Education & Training",
    namePt: "Educação & Treinamento",
    nameEn: "Education & Training",
    nameEs: "Educación y Formación",
    nameFr: "Éducation et Formation",
    description: "Escolas, universidades, cursos online, plataformas de aprendizado",
    descriptionPt: "Escolas, universidades, cursos online, plataformas de aprendizado",
    descriptionEn: "Schools, universities, online courses, learning platforms",
    descriptionEs: "Escuelas, universidades, cursos en línea, plataformas de aprendizaje",
    descriptionFr: "Écoles, universités, cours en ligne, plateformes d'apprentissage",
    icon: "GraduationCap",
    isActive: true,
  },
  {
    id: "sector_finance",
    name: "Financial Services",
    namePt: "Serviços Financeiros",
    nameEn: "Financial Services",
    nameEs: "Servicios Financieros",
    nameFr: "Services Financiers",
    description: "Bancos, fintechs, investimentos, pagamentos digitais, seguros",
    descriptionPt: "Bancos, fintechs, investimentos, pagamentos digitais, seguros",
    descriptionEn: "Banks, fintechs, investments, digital payments, insurance",
    descriptionEs: "Bancos, fintechs, inversiones, pagos digitales, seguros",
    descriptionFr: "Banques, fintechs, investissements, paiements numériques, assurances",
    icon: "DollarSign",
    isActive: true,
  },
  {
    id: "sector_food",
    name: "Food & Restaurants",
    namePt: "Alimentação & Restaurantes",
    nameEn: "Food & Restaurants",
    nameEs: "Alimentación y Restaurantes",
    nameFr: "Alimentation et Restaurants",
    description: "Restaurantes, delivery, food trucks, produtos alimentícios",
    descriptionPt: "Restaurantes, delivery, food trucks, produtos alimentícios",
    descriptionEn: "Restaurants, delivery, food trucks, food products",
    descriptionEs: "Restaurantes, delivery, food trucks, productos alimenticios",
    descriptionFr: "Restaurants, livraison, food trucks, produits alimentaires",
    icon: "Utensils",
    isActive: true,
  },
  {
    id: "sector_entertainment",
    name: "Entertainment & Media",
    namePt: "Entretenimento & Mídia",
    nameEn: "Entertainment & Media",
    nameEs: "Entretenimiento y Medios",
    nameFr: "Divertissement et Médias",
    description: "Streaming, jogos, produção de conteúdo, redes sociais",
    descriptionPt: "Streaming, jogos, produção de conteúdo, redes sociais",
    descriptionEn: "Streaming, games, content production, social networks",
    descriptionEs: "Streaming, juegos, producción de contenido, redes sociales",
    descriptionFr: "Streaming, jeux, production de contenu, réseaux sociaux",
    icon: "Tv",
    isActive: true,
  },
  {
    id: "sector_travel",
    name: "Travel & Hospitality",
    namePt: "Viagens & Hospitalidade",
    nameEn: "Travel & Hospitality",
    nameEs: "Viajes y Hospitalidad",
    nameFr: "Voyages et Hospitalité",
    description: "Hotéis, turismo, agências de viagem, plataformas de reservas",
    descriptionPt: "Hotéis, turismo, agências de viagem, plataformas de reservas",
    descriptionEn: "Hotels, tourism, travel agencies, booking platforms",
    descriptionEs: "Hoteles, turismo, agencias de viajes, plataformas de reservas",
    descriptionFr: "Hôtels, tourisme, agences de voyage, plateformes de réservation",
    icon: "Plane",
    isActive: true,
  },
];

async function seedSectors() {
  console.log("🌱 Seeding industry sectors...");

  for (const sector of sectors) {
    await db
      .insert(industrySectors)
      .values(sector)
      .onConflictDoUpdate({
        target: industrySectors.id,
        set: {
          name: sector.name,
          namePt: sector.namePt,
          nameEn: sector.nameEn,
          nameEs: sector.nameEs,
          nameFr: sector.nameFr,
          description: sector.description,
          descriptionPt: sector.descriptionPt,
          descriptionEn: sector.descriptionEn,
          descriptionEs: sector.descriptionEs,
          descriptionFr: sector.descriptionFr,
          icon: sector.icon,
          isActive: sector.isActive,
        },
      });
    console.log(`✅ Updated sector: ${sector.name}`);
  }

  console.log("🎉 Industry sectors seeded successfully!");
  console.log("Done!");
  process.exit(0);
}

seedSectors().catch((error) => {
  console.error("❌ Error seeding sectors:", error);
  process.exit(1);
});
