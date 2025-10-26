-- Seed Success Cases for Industry Sectors
-- Execute this in Render Shell: psql $DATABASE_URL < server/seed-cases.sql

-- Technology & Software Cases
INSERT INTO success_cases (id, name, name_pt, name_en, name_es, name_fr, company, description, description_pt, description_en, description_es, description_fr, sector_id, logo_url, is_active)
VALUES 
('case_slack', 'Slack', 'Slack', 'Slack', 'Slack', 'Slack', 'Slack Technologies', 'Plataforma de comunicação empresarial que revolucionou a colaboração em equipe', 'Plataforma de comunicação empresarial que revolucionou a colaboração em equipe', 'Enterprise communication platform that revolutionized team collaboration', 'Plataforma de comunicación empresarial que revolucionó la colaboración en equipo', 'Plateforme de communication d''entreprise qui a révolutionné la collaboration en équipe', 'sector_tech', NULL, true),
('case_notion', 'Notion', 'Notion', 'Notion', 'Notion', 'Notion', 'Notion Labs', 'Workspace colaborativo all-in-one para notas, documentos e gestão de projetos', 'Workspace colaborativo all-in-one para notas, documentos e gestão de projetos', 'All-in-one collaborative workspace for notes, docs and project management', 'Espacio de trabajo colaborativo todo en uno para notas, documentos y gestión de proyectos', 'Espace de travail collaboratif tout-en-un pour notes, documents et gestion de projets', 'sector_tech', NULL, true),
('case_figma', 'Figma', 'Figma', 'Figma', 'Figma', 'Figma', 'Figma Inc.', 'Ferramenta de design colaborativo baseada na nuvem', 'Ferramenta de design colaborativo baseada na nuvem', 'Cloud-based collaborative design tool', 'Herramienta de diseño colaborativo basada en la nube', 'Outil de conception collaborative basé sur le cloud', 'sector_tech', NULL, true)

ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  company = EXCLUDED.company,
  description = EXCLUDED.description,
  sector_id = EXCLUDED.sector_id,
  is_active = EXCLUDED.is_active;

-- E-commerce & Retail Cases
INSERT INTO success_cases (id, name, name_pt, name_en, name_es, name_fr, company, description, description_pt, description_en, description_es, description_fr, sector_id, logo_url, is_active)
VALUES 
('case_shopify', 'Shopify', 'Shopify', 'Shopify', 'Shopify', 'Shopify', 'Shopify Inc.', 'Plataforma de e-commerce que facilita criar lojas online', 'Plataforma de e-commerce que facilita criar lojas online', 'E-commerce platform that makes it easy to create online stores', 'Plataforma de comercio electrónico que facilita crear tiendas en línea', 'Plateforme e-commerce facilitant la création de boutiques en ligne', 'sector_ecommerce', NULL, true),
('case_amazon', 'Amazon Marketplace', 'Amazon Marketplace', 'Amazon Marketplace', 'Amazon Marketplace', 'Amazon Marketplace', 'Amazon', 'Marketplace global que conecta vendedores a milhões de compradores', 'Marketplace global que conecta vendedores a milhões de compradores', 'Global marketplace connecting sellers to millions of buyers', 'Marketplace global que conecta vendedores con millones de compradores', 'Marketplace mondial connectant vendeurs et millions d''acheteurs', 'sector_ecommerce', NULL, true)

ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  company = EXCLUDED.company,
  description = EXCLUDED.description,
  sector_id = EXCLUDED.sector_id,
  is_active = EXCLUDED.is_active;

-- Healthcare & Wellness Cases
INSERT INTO success_cases (id, name, name_pt, name_en, name_es, name_fr, company, description, description_pt, description_en, description_es, description_fr, sector_id, logo_url, is_active)
VALUES 
('case_doctolib', 'Doctolib', 'Doctolib', 'Doctolib', 'Doctolib', 'Doctolib', 'Doctolib', 'Plataforma de agendamento médico e telemedicina', 'Plataforma de agendamento médico e telemedicina', 'Medical appointment and telemedicine platform', 'Plataforma de citas médicas y telemedicina', 'Plateforme de rendez-vous médicaux et télémédecine', 'sector_health', NULL, true),
('case_headspace', 'Headspace', 'Headspace', 'Headspace', 'Headspace', 'Headspace', 'Headspace Inc.', 'App de meditação e bem-estar mental', 'App de meditação e bem-estar mental', 'Meditation and mental wellness app', 'App de meditación y bienestar mental', 'Application de méditation et bien-être mental', 'sector_health', NULL, true)

ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  company = EXCLUDED.company,
  description = EXCLUDED.description,
  sector_id = EXCLUDED.sector_id,
  is_active = EXCLUDED.is_active;

-- Education & Training Cases
INSERT INTO success_cases (id, name, name_pt, name_en, name_es, name_fr, company, description, description_pt, description_en, description_es, description_fr, sector_id, logo_url, is_active)
VALUES 
('case_coursera', 'Coursera', 'Coursera', 'Coursera', 'Coursera', 'Coursera', 'Coursera Inc.', 'Plataforma de cursos online com universidades renomadas', 'Plataforma de cursos online com universidades renomadas', 'Online course platform with renowned universities', 'Plataforma de cursos en línea con universidades de renombre', 'Plateforme de cours en ligne avec universités renommées', 'sector_education', NULL, true),
('case_duolingo', 'Duolingo', 'Duolingo', 'Duolingo', 'Duolingo', 'Duolingo', 'Duolingo Inc.', 'App gamificado para aprendizado de idiomas', 'App gamificado para aprendizado de idiomas', 'Gamified language learning app', 'App gamificada para aprendizaje de idiomas', 'Application gamifiée d''apprentissage des langues', 'sector_education', NULL, true)

ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  company = EXCLUDED.company,
  description = EXCLUDED.description,
  sector_id = EXCLUDED.sector_id,
  is_active = EXCLUDED.is_active;

-- Financial Services Cases
INSERT INTO success_cases (id, name, name_pt, name_en, name_es, name_fr, company, description, description_pt, description_en, description_es, description_fr, sector_id, logo_url, is_active)
VALUES 
('case_nubank', 'Nubank', 'Nubank', 'Nubank', 'Nubank', 'Nubank', 'Nu Holdings', 'Fintech brasileira que revolucionou o mercado bancário', 'Fintech brasileira que revolucionou o mercado bancário', 'Brazilian fintech that revolutionized the banking market', 'Fintech brasileña que revolucionó el mercado bancario', 'Fintech brésilienne qui a révolutionné le marché bancaire', 'sector_finance', NULL, true),
('case_stripe', 'Stripe', 'Stripe', 'Stripe', 'Stripe', 'Stripe', 'Stripe Inc.', 'Plataforma de pagamentos online para negócios digitais', 'Plataforma de pagamentos online para negócios digitais', 'Online payment platform for digital businesses', 'Plataforma de pagos en línea para negocios digitales', 'Plateforme de paiement en ligne pour entreprises numériques', 'sector_finance', NULL, true)

ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  company = EXCLUDED.company,
  description = EXCLUDED.description,
  sector_id = EXCLUDED.sector_id,
  is_active = EXCLUDED.is_active;

-- Food & Restaurants Cases
INSERT INTO success_cases (id, name, name_pt, name_en, name_es, name_fr, company, description, description_pt, description_en, description_es, description_fr, sector_id, logo_url, is_active)
VALUES 
('case_ifood', 'iFood', 'iFood', 'iFood', 'iFood', 'iFood', 'iFood', 'Marketplace de delivery de comida líder no Brasil', 'Marketplace de delivery de comida líder no Brasil', 'Leading food delivery marketplace in Brazil', 'Marketplace de entrega de comida líder en Brasil', 'Marketplace leader de livraison de nourriture au Brésil', 'sector_food', NULL, true),
('case_doordash', 'DoorDash', 'DoorDash', 'DoorDash', 'DoorDash', 'DoorDash', 'DoorDash Inc.', 'Plataforma de delivery de restaurantes e mercados', 'Plataforma de delivery de restaurantes e mercados', 'Restaurant and grocery delivery platform', 'Plataforma de entrega de restaurantes y supermercados', 'Plateforme de livraison de restaurants et supermarchés', 'sector_food', NULL, true)

ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  company = EXCLUDED.company,
  description = EXCLUDED.description,
  sector_id = EXCLUDED.sector_id,
  is_active = EXCLUDED.is_active;

-- Entertainment & Media Cases
INSERT INTO success_cases (id, name, name_pt, name_en, name_es, name_fr, company, description, description_pt, description_en, description_es, description_fr, sector_id, logo_url, is_active)
VALUES 
('case_spotify', 'Spotify', 'Spotify', 'Spotify', 'Spotify', 'Spotify', 'Spotify AB', 'Plataforma de streaming de música com algoritmos personalizados', 'Plataforma de streaming de música com algoritmos personalizados', 'Music streaming platform with personalized algorithms', 'Plataforma de streaming de música con algoritmos personalizados', 'Plateforme de streaming musical avec algorithmes personnalisés', 'sector_entertainment', NULL, true),
('case_netflix', 'Netflix', 'Netflix', 'Netflix', 'Netflix', 'Netflix', 'Netflix Inc.', 'Serviço de streaming de filmes e séries sob demanda', 'Serviço de streaming de filmes e séries sob demanda', 'On-demand movies and series streaming service', 'Servicio de streaming de películas y series bajo demanda', 'Service de streaming de films et séries à la demande', 'sector_entertainment', NULL, true)

ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  company = EXCLUDED.company,
  description = EXCLUDED.description,
  sector_id = EXCLUDED.sector_id,
  is_active = EXCLUDED.is_active;

-- Travel & Hospitality Cases
INSERT INTO success_cases (id, name, name_pt, name_en, name_es, name_fr, company, description, description_pt, description_en, description_es, description_fr, sector_id, logo_url, is_active)
VALUES 
('case_airbnb', 'Airbnb', 'Airbnb', 'Airbnb', 'Airbnb', 'Airbnb', 'Airbnb Inc.', 'Marketplace de acomodações alternativas e experiências locais', 'Marketplace de acomodações alternativas e experiências locais', 'Alternative accommodations and local experiences marketplace', 'Marketplace de alojamientos alternativos y experiencias locales', 'Marketplace d''hébergements alternatifs et expériences locales', 'sector_travel', NULL, true),
('case_booking', 'Booking.com', 'Booking.com', 'Booking.com', 'Booking.com', 'Booking.com', 'Booking Holdings', 'Plataforma global de reservas de hotéis e acomodações', 'Plataforma global de reservas de hotéis e acomodações', 'Global hotel and accommodation booking platform', 'Plataforma global de reservas de hoteles y alojamientos', 'Plateforme mondiale de réservation d''hôtels et hébergements', 'sector_travel', NULL, true)

ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  company = EXCLUDED.company,
  description = EXCLUDED.description,
  sector_id = EXCLUDED.sector_id,
  is_active = EXCLUDED.is_active;
