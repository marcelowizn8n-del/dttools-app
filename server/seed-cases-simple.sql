-- Simple Success Cases Seed (only basic columns)
-- Execute: psql $DATABASE_URL < server/seed-cases-simple.sql

INSERT INTO success_cases (id, name, company, sector_id, is_active) VALUES 
('case_slack', 'Slack', 'Slack Technologies', 'sector_tech', true),
('case_notion', 'Notion', 'Notion Labs', 'sector_tech', true),
('case_figma', 'Figma', 'Figma Inc.', 'sector_tech', true),
('case_shopify', 'Shopify', 'Shopify Inc.', 'sector_ecommerce', true),
('case_amazon', 'Amazon Marketplace', 'Amazon', 'sector_ecommerce', true),
('case_doctolib', 'Doctolib', 'Doctolib', 'sector_health', true),
('case_headspace', 'Headspace', 'Headspace Inc.', 'sector_health', true),
('case_coursera', 'Coursera', 'Coursera Inc.', 'sector_education', true),
('case_duolingo', 'Duolingo', 'Duolingo Inc.', 'sector_education', true),
('case_nubank', 'Nubank', 'Nu Holdings', 'sector_finance', true),
('case_stripe', 'Stripe', 'Stripe Inc.', 'sector_finance', true),
('case_ifood', 'iFood', 'iFood', 'sector_food', true),
('case_doordash', 'DoorDash', 'DoorDash Inc.', 'sector_food', true),
('case_spotify', 'Spotify', 'Spotify AB', 'sector_entertainment', true),
('case_netflix', 'Netflix', 'Netflix Inc.', 'sector_entertainment', true),
('case_airbnb', 'Airbnb', 'Airbnb Inc.', 'sector_travel', true),
('case_booking', 'Booking.com', 'Booking Holdings', 'sector_travel', true)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  company = EXCLUDED.company, 
  sector_id = EXCLUDED.sector_id,
  is_active = EXCLUDED.is_active;
