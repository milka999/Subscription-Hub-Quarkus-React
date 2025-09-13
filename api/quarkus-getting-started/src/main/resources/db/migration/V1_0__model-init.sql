-- V1.0__Initial_Schema_And_Data.sql
-- Initial database schema creation and sample data population
-- Location: src/main/resources/db/migration/V1.0__Initial_Schema_And_Data.sql

-- =====================================================
-- CREATE SEQUENCES
-- =====================================================

CREATE SEQUENCE IF NOT EXISTS hibernate_sequence START WITH 1000 INCREMENT BY 1;

-- =====================================================
-- CREATE TABLES
-- =====================================================

-- Service Providers table
CREATE TABLE service_providers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    contact_email VARCHAR(255) NOT NULL,
    website_url VARCHAR(500),
    cancellation_url VARCHAR(500),
    renewal_url VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Subscription Services/Providers table (plans offered by service providers)
CREATE TABLE subscription_services (
    id BIGSERIAL PRIMARY KEY,
    service_name VARCHAR(255) NOT NULL,
    service_description TEXT NOT NULL,
    service_cost DECIMAL(10,2) NOT NULL,
    subscription_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,
    CONSTRAINT fk_subscription_service_provider
        FOREIGN KEY (subscription_id)
        REFERENCES service_providers(id)
        ON DELETE CASCADE
);

-- Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    monthly_limit DECIMAL(10,2),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Subscriptions table
CREATE TABLE subscriptions (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    billing_cycle VARCHAR(50) NOT NULL CHECK (billing_cycle IN ('DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'YEARLY')),
    status VARCHAR(50) NOT NULL CHECK (status IN ('ACTIVE', 'CANCELLED', 'ON_HOLD', 'EXPIRED')),
    provider_id BIGINT,
    started_at DATE,
    due_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,
    CONSTRAINT fk_subscription_provider
        FOREIGN KEY (provider_id)
        REFERENCES subscription_services(id)
        ON DELETE SET NULL
);

-- User Subscriptions junction table
CREATE TABLE users_subscriptions (
    user_id BIGINT NOT NULL,
    subscriptions_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, subscriptions_id),
    CONSTRAINT fk_user_subscription_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_user_subscription_subscription
        FOREIGN KEY (subscriptions_id)
        REFERENCES subscriptions(id)
        ON DELETE CASCADE
);

-- =====================================================
-- CREATE INDEXES
-- =====================================================

CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_due_date ON subscriptions(due_date);
CREATE INDEX idx_subscriptions_user ON users_subscriptions(user_id);
CREATE INDEX idx_service_providers_name ON service_providers(name);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_deleted_at_service_providers ON service_providers(deleted_at);
CREATE INDEX idx_deleted_at_subscriptions ON subscriptions(deleted_at);
CREATE INDEX idx_deleted_at_users ON users(deleted_at);

-- =====================================================
-- INSERT SAMPLE DATA - SERVICE PROVIDERS
-- =====================================================

INSERT INTO service_providers (name, contact_email, website_url, cancellation_url, renewal_url, created_at) VALUES
-- Streaming Services
('Netflix', 'support@netflix.com', 'https://www.netflix.com', 'https://www.netflix.com/cancelplan', 'https://www.netflix.com/yourAccount', NOW()),
('Spotify', 'support@spotify.com', 'https://www.spotify.com', 'https://www.spotify.com/account/subscription/cancel', 'https://www.spotify.com/account/subscription', NOW()),
('Disney+', 'support@disneyplus.com', 'https://www.disneyplus.com', 'https://www.disneyplus.com/account/cancel', 'https://www.disneyplus.com/account/subscription', NOW()),
('HBO Max', 'support@hbomax.com', 'https://www.hbomax.com', 'https://www.hbomax.com/cancel', 'https://www.hbomax.com/settings/subscription', NOW()),
('Hulu', 'support@hulu.com', 'https://www.hulu.com', 'https://secure.hulu.com/account/cancel', 'https://secure.hulu.com/account', NOW()),
('Amazon Prime Video', 'support@amazon.com', 'https://www.primevideo.com', 'https://www.amazon.com/gp/primecentral', 'https://www.amazon.com/gp/primecentral', NOW()),
('Apple TV+', 'support@apple.com', 'https://tv.apple.com', 'https://tv.apple.com/settings/subscriptions', 'https://tv.apple.com/settings/subscriptions', NOW()),
('YouTube Premium', 'support@youtube.com', 'https://www.youtube.com/premium', 'https://www.youtube.com/paid_memberships', 'https://www.youtube.com/paid_memberships', NOW()),
('Paramount+', 'support@paramountplus.com', 'https://www.paramountplus.com', 'https://www.paramountplus.com/account/cancel', 'https://www.paramountplus.com/account', NOW()),
('Peacock', 'support@peacocktv.com', 'https://www.peacocktv.com', 'https://www.peacocktv.com/account/cancel', 'https://www.peacocktv.com/account', NOW()),

-- Music Services
('Apple Music', 'support@apple.com', 'https://music.apple.com', 'https://music.apple.com/settings/subscriptions', 'https://music.apple.com/settings/subscriptions', NOW()),
('YouTube Music', 'support@youtube.com', 'https://music.youtube.com', 'https://www.youtube.com/paid_memberships', 'https://www.youtube.com/paid_memberships', NOW()),
('Tidal', 'support@tidal.com', 'https://tidal.com', 'https://tidal.com/account/subscription', 'https://tidal.com/account/subscription', NOW()),
('Pandora', 'support@pandora.com', 'https://www.pandora.com', 'https://www.pandora.com/account/cancel', 'https://www.pandora.com/account/subscription', NOW()),

-- Cloud Storage
('Google One', 'support@google.com', 'https://one.google.com', 'https://one.google.com/storage', 'https://one.google.com/storage', NOW()),
('Dropbox', 'support@dropbox.com', 'https://www.dropbox.com', 'https://www.dropbox.com/account/plan', 'https://www.dropbox.com/account/plan', NOW()),
('iCloud+', 'support@apple.com', 'https://www.icloud.com', 'https://support.apple.com/billing', 'https://support.apple.com/billing', NOW()),
('Microsoft OneDrive', 'support@microsoft.com', 'https://onedrive.live.com', 'https://account.microsoft.com/services', 'https://account.microsoft.com/services', NOW()),

-- Productivity & Software
('Microsoft 365', 'support@microsoft.com', 'https://www.office.com', 'https://account.microsoft.com/services', 'https://account.microsoft.com/services', NOW()),
('Adobe Creative Cloud', 'support@adobe.com', 'https://www.adobe.com', 'https://account.adobe.com/plans', 'https://account.adobe.com/plans', NOW()),
('Notion', 'support@notion.so', 'https://www.notion.so', 'https://www.notion.so/settings/plans', 'https://www.notion.so/settings/plans', NOW()),
('Slack', 'support@slack.com', 'https://slack.com', 'https://slack.com/account/billing', 'https://slack.com/account/billing', NOW()),
('Zoom', 'support@zoom.us', 'https://zoom.us', 'https://zoom.us/account/billing', 'https://zoom.us/account/billing', NOW()),

-- Gaming
('Xbox Game Pass', 'support@xbox.com', 'https://www.xbox.com/gamepass', 'https://account.microsoft.com/services', 'https://account.microsoft.com/services', NOW()),
('PlayStation Plus', 'support@playstation.com', 'https://www.playstation.com/ps-plus', 'https://account.sonyentertainmentnetwork.com', 'https://account.sonyentertainmentnetwork.com', NOW()),
('Nintendo Switch Online', 'support@nintendo.com', 'https://www.nintendo.com/switch/online', 'https://accounts.nintendo.com', 'https://accounts.nintendo.com', NOW()),
('Steam', 'support@steampowered.com', 'https://store.steampowered.com', 'https://store.steampowered.com/account', 'https://store.steampowered.com/account', NOW()),

-- Fitness & Wellness
('Peloton', 'support@onepeloton.com', 'https://www.onepeloton.com', 'https://www.onepeloton.com/membership', 'https://www.onepeloton.com/membership', NOW()),
('Headspace', 'support@headspace.com', 'https://www.headspace.com', 'https://www.headspace.com/account', 'https://www.headspace.com/account', NOW()),
('Calm', 'support@calm.com', 'https://www.calm.com', 'https://www.calm.com/account', 'https://www.calm.com/account', NOW());

-- =====================================================
-- INSERT SAMPLE DATA - SUBSCRIPTION SERVICES/PLANS
-- =====================================================

-- Netflix Plans
INSERT INTO subscription_services (service_name, service_description, service_cost, subscription_id, created_at) VALUES
('Netflix Basic', 'HD streaming on 1 device, no ads', 6.99, 1, NOW()),
('Netflix Standard', 'Full HD streaming on 2 devices, no ads', 15.49, 1, NOW()),
('Netflix Premium', '4K HDR streaming on 4 devices, no ads', 22.99, 1, NOW()),

-- Spotify Plans
('Spotify Free', 'Free with ads, basic features', 0.00, 2, NOW()),
('Spotify Premium Individual', 'Ad-free music, offline downloads, unlimited skips', 10.99, 2, NOW()),
('Spotify Premium Duo', 'Premium for 2 accounts', 14.99, 2, NOW()),
('Spotify Premium Family', 'Premium for up to 6 accounts', 16.99, 2, NOW()),
('Spotify Premium Student', 'Discounted Premium for students', 5.99, 2, NOW()),

-- Disney+ Plans
('Disney+ Basic', 'With ads, HD streaming', 7.99, 3, NOW()),
('Disney+ Premium', 'No ads, 4K UHD & HDR, downloads', 13.99, 3, NOW()),
('Disney Bundle Trio Basic', 'Disney+, Hulu, ESPN+ with ads', 14.99, 3, NOW()),
('Disney Bundle Trio Premium', 'Disney+, Hulu, ESPN+ no ads', 24.99, 3, NOW()),

-- HBO Max Plans
('Max With Ads', '2 devices, Full HD, with ads', 9.99, 4, NOW()),
('Max Ad-Free', '2 devices, Full HD, no ads, 30 downloads', 15.99, 4, NOW()),
('Max Ultimate', '4 devices, 4K UHD, no ads, 100 downloads', 19.99, 4, NOW()),

-- Hulu Plans
('Hulu (With Ads)', 'Streaming library with ads', 7.99, 5, NOW()),
('Hulu (No Ads)', 'Streaming library without ads', 17.99, 5, NOW()),
('Hulu + Live TV', 'Live TV and streaming library with ads', 76.99, 5, NOW()),
('Hulu + Live TV (No Ads)', 'Live TV and streaming library without ads', 89.99, 5, NOW()),

-- Amazon Prime Video
('Prime Video', 'Standalone Prime Video subscription', 8.99, 6, NOW()),
('Amazon Prime', 'Prime Video + free shipping + more benefits', 14.99, 6, NOW()),
('Prime Student', 'Discounted Prime for students', 7.49, 6, NOW()),

-- Apple TV+
('Apple TV+', 'Original Apple content, 4K HDR', 9.99, 7, NOW()),
('Apple One Individual', 'Apple TV+, Music, iCloud+, Arcade', 19.95, 7, NOW()),
('Apple One Family', 'Apple services for up to 6 people', 25.95, 7, NOW()),
('Apple One Premier', 'All Apple services including News+ and Fitness+', 37.95, 7, NOW()),

-- YouTube Premium
('YouTube Premium Individual', 'Ad-free videos, background play, Music', 13.99, 8, NOW()),
('YouTube Premium Family', 'Premium for up to 5 family members', 22.99, 8, NOW()),
('YouTube Premium Student', 'Discounted Premium for students', 7.99, 8, NOW()),

-- Paramount+
('Paramount+ Essential', 'With limited ads', 5.99, 9, NOW()),
('Paramount+ with Showtime', 'No ads, Showtime content, downloads', 11.99, 9, NOW()),

-- Peacock
('Peacock Premium', 'With ads, full library', 5.99, 10, NOW()),
('Peacock Premium Plus', 'No ads, downloads, local NBC', 11.99, 10, NOW()),

-- Apple Music
('Apple Music Individual', 'Unlimited music streaming', 10.99, 11, NOW()),
('Apple Music Family', 'Music for up to 6 people', 16.99, 11, NOW()),
('Apple Music Student', 'Discounted for students', 5.99, 11, NOW()),

-- YouTube Music
('YouTube Music', 'Ad-free music streaming', 10.99, 12, NOW()),

-- Tidal
('Tidal HiFi', 'Lossless audio quality', 10.99, 13, NOW()),
('Tidal HiFi Plus', 'Master quality audio, Dolby Atmos', 19.99, 13, NOW()),

-- Pandora
('Pandora Plus', 'Ad-free radio, unlimited skips', 4.99, 14, NOW()),
('Pandora Premium', 'On-demand listening, offline mode', 9.99, 14, NOW()),

-- Google One
('Google One 100GB', '100 GB storage across Google services', 1.99, 15, NOW()),
('Google One 200GB', '200 GB storage, 3% back in Google Store', 2.99, 15, NOW()),
('Google One 2TB', '2 TB storage, VPN, 10% back in Google Store', 9.99, 15, NOW()),

-- Dropbox
('Dropbox Plus', '2 TB storage for 1 user', 11.99, 16, NOW()),
('Dropbox Family', '2 TB storage for up to 6 users', 19.99, 16, NOW()),
('Dropbox Professional', '3 TB storage, advanced features', 19.99, 16, NOW()),

-- iCloud+
('iCloud+ 50GB', '50 GB storage, Private Relay', 0.99, 17, NOW()),
('iCloud+ 200GB', '200 GB storage, share with family', 2.99, 17, NOW()),
('iCloud+ 2TB', '2 TB storage, share with family', 9.99, 17, NOW()),

-- Microsoft OneDrive
('Microsoft 365 Basic', '100 GB OneDrive, ad-free Outlook', 1.99, 18, NOW()),
('Microsoft 365 Personal', '1 TB OneDrive, Office apps, 1 user', 6.99, 18, NOW()),
('Microsoft 365 Family', '6 TB total (1 TB each), Office apps, 6 users', 9.99, 18, NOW()),

-- Microsoft 365 (Office)
('Microsoft 365 Personal', 'Office apps for 1 person', 69.99, 19, NOW()),
('Microsoft 365 Family', 'Office apps for up to 6 people', 99.99, 19, NOW()),
('Microsoft 365 Business Basic', 'Web and mobile apps, 1 TB OneDrive', 6.00, 19, NOW()),
('Microsoft 365 Business Standard', 'Desktop apps, 1 TB OneDrive', 12.50, 19, NOW()),

-- Adobe Creative Cloud
('Adobe Photography Plan', 'Photoshop, Lightroom, 20GB storage', 9.99, 20, NOW()),
('Adobe Single App', 'Choose one Creative Cloud app', 22.99, 20, NOW()),
('Adobe All Apps', 'Entire Creative Cloud collection', 59.99, 20, NOW()),
('Adobe Student', 'All Apps for students (first year)', 19.99, 20, NOW()),

-- Notion
('Notion Plus', 'Unlimited blocks, file uploads', 8.00, 21, NOW()),
('Notion Business', 'Advanced permissions, SAML SSO', 15.00, 21, NOW()),
('Notion Enterprise', 'Advanced security and controls', 25.00, 21, NOW()),

-- Slack
('Slack Pro', 'Unlimited message history, guest accounts', 7.25, 22, NOW()),
('Slack Business+', 'Advanced identity management, compliance', 12.50, 22, NOW()),

-- Zoom
('Zoom Pro', '100 participants, cloud recording', 14.99, 23, NOW()),
('Zoom Business', '300 participants, dedicated phone support', 21.99, 23, NOW()),

-- Xbox Game Pass
('Xbox Game Pass Core', 'Online multiplayer, 25+ games', 9.99, 24, NOW()),
('Xbox Game Pass for Console', 'Access to 100+ console games', 10.99, 24, NOW()),
('Xbox Game Pass Ultimate', 'Console + PC games, EA Play, cloud gaming', 16.99, 24, NOW()),

-- PlayStation Plus
('PlayStation Plus Essential', 'Online multiplayer, monthly games', 9.99, 25, NOW()),
('PlayStation Plus Extra', 'Essential + game catalog (400+ games)', 14.99, 25, NOW()),
('PlayStation Plus Premium', 'Extra + classic games, game trials', 17.99, 25, NOW()),

-- Nintendo Switch Online
('Nintendo Switch Online Individual', 'Online play, NES & SNES games', 3.99, 26, NOW()),
('Nintendo Switch Online Family', 'Up to 8 accounts', 34.99, 26, NOW()),
('Nintendo Switch Online + Expansion Pack', 'N64 & Sega Genesis games, DLC', 49.99, 26, NOW()),

-- Peloton
('Peloton App One', 'Access to classes without equipment', 12.99, 28, NOW()),
('Peloton App+', 'Full access with Peloton equipment', 44.00, 28, NOW()),

-- Headspace
('Headspace Monthly', 'Full access to meditation library', 12.99, 29, NOW()),
('Headspace Annual', 'Full access billed yearly', 69.99, 29, NOW()),

-- Calm
('Calm Premium Monthly', 'Full library of content', 14.99, 30, NOW()),
('Calm Premium Annual', 'Full library billed yearly', 69.99, 30, NOW());

-- =====================================================
-- INSERT SAMPLE DATA - TEST USERS
-- =====================================================

INSERT INTO users (username, password, email, monthly_limit, created_at) VALUES
('john_doe', '$2a$10$xQ1XDq0N7cLhGKaZUqZGu.5YvGz8GzJPRdZ42n4y3qU3oK9r6MnqO', 'john.doe@example.com', 200.00, NOW()),
('jane_smith', '$2a$10$xQ1XDq0N7cLhGKaZUqZGu.5YvGz8GzJPRdZ42n4y3qU3oK9r6MnqO', 'jane.smith@example.com', 150.00, NOW()),
('test_user', '$2a$10$xQ1XDq0N7cLhGKaZUqZGu.5YvGz8GzJPRdZ42n4y3qU3oK9r6MnqO', 'test@example.com', 100.00, NOW());
-- Note: Password for all test users is 'password123' (bcrypt hashed)

-- =====================================================
-- INSERT SAMPLE DATA - USER SUBSCRIPTIONS
-- =====================================================

-- Sample subscriptions for john_doe (user_id = 1)
INSERT INTO subscriptions (name, description, price, billing_cycle, status, provider_id, started_at, due_date, created_at) VALUES
('Netflix Premium', 'My Netflix family plan subscription', 22.99, 'MONTHLY', 'ACTIVE', 3, '2024-01-15', '2025-02-15', NOW()),
('Spotify Family', 'Spotify for the whole family', 16.99, 'MONTHLY', 'ACTIVE', 7, '2024-03-01', '2025-02-01', NOW()),
('Microsoft 365 Family', 'Office apps for everyone', 9.99, 'MONTHLY', 'ACTIVE', 75, '2024-06-01', '2025-02-01', NOW()),
('Disney+ Premium', 'Kids love it', 13.99, 'MONTHLY', 'ACTIVE', 10, '2024-08-15', '2025-02-15', NOW()),
('Adobe Photography', 'Photo editing tools', 9.99, 'MONTHLY', 'ON_HOLD', 77, '2024-09-01', '2025-02-01', NOW());

-- Link subscriptions to john_doe
INSERT INTO users_subscriptions (user_id, subscriptions_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5);

-- Sample subscriptions for jane_smith (user_id = 2)
INSERT INTO subscriptions (name, description, price, billing_cycle, status, provider_id, started_at, due_date, created_at) VALUES
('Hulu No Ads', 'Ad-free streaming', 17.99, 'MONTHLY', 'ACTIVE', 18, '2024-02-01', '2025-02-01', NOW()),
('Apple Music', 'My music streaming', 10.99, 'MONTHLY', 'ACTIVE', 47, '2024-04-15', '2025-02-15', NOW()),
('Dropbox Plus', 'Cloud storage for work', 11.99, 'MONTHLY', 'ACTIVE', 57, '2024-07-01', '2025-02-01', NOW()),
('Headspace', 'Meditation and mindfulness', 12.99, 'MONTHLY', 'CANCELLED', 94, '2024-10-01', '2024-12-01', NOW());

-- Link subscriptions to jane_smith
INSERT INTO users_subscriptions (user_id, subscriptions_id) VALUES
(2, 6), (2, 7), (2, 8), (2, 9);

-- Sample subscriptions for test_user (user_id = 3)
INSERT INTO subscriptions (name, description, price, billing_cycle, status, provider_id, started_at, due_date, created_at) VALUES
('YouTube Premium', 'No ads on YouTube', 13.99, 'MONTHLY', 'ACTIVE', 36, '2024-05-01', '2025-02-01', NOW()),
('Xbox Game Pass Ultimate', 'Gaming subscription', 16.99, 'MONTHLY', 'ACTIVE', 89, '2024-06-15', '2025-02-15', NOW()),
('Google One 2TB', 'Extra Google storage', 9.99, 'MONTHLY', 'ACTIVE', 55, '2024-11-01', '2025-02-01', NOW());

-- Link subscriptions to test_user
INSERT INTO users_subscriptions (user_id, subscriptions_id) VALUES
(3, 10), (3, 11), (3, 12);

-- =====================================================
-- GRANT PERMISSIONS (if needed)
-- =====================================================

-- Uncomment and modify if you need to grant specific permissions
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================