-- SunoAid Database Schema
-- This file creates the complete database structure for the SunoAid Civic Reporting System
-- VERSION 2.0: Updated 'locations' table to support hierarchical data.

-- Drop tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS votes CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS issues CASCADE;
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
DROP FUNCTION IF EXISTS update_comments_count CASCADE;


-- Create Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color_code VARCHAR(7) DEFAULT '#3B82F6',
    icon_name VARCHAR(50) DEFAULT 'folder',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Locations table (UPDATED SCHEMA)
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    
    -- NEW COLUMNS FOR HIERARCHY AND FILTERING
    type VARCHAR(50), -- e.g., 'province', 'city', 'district', 'barangay'
    parent_id INTEGER REFERENCES locations(id) ON DELETE SET NULL, -- Self-referencing key for hierarchy
    is_active BOOLEAN NOT NULL DEFAULT TRUE, -- For soft-deleting locations
    
    -- Original columns, can be useful for display purposes
    city VARCHAR(100) NOT NULL,
    province VARCHAR(100) NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Issues table
CREATE TABLE issues (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'open',
    severity VARCHAR(20) DEFAULT 'medium',
    address TEXT,
    latitude FLOAT,
    longitude FLOAT,
    media_urls JSONB DEFAULT '[]'::jsonb,
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE NULL,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    location_id INTEGER REFERENCES locations(id) ON DELETE SET NULL
);

-- Create Votes table
CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('up', 'down')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    issue_id INTEGER NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    UNIQUE(user_id, issue_id)
);

-- Create Comments table
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    issue_id INTEGER NOT NULL REFERENCES issues(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_issues_user_id ON issues(user_id);
CREATE INDEX idx_issues_category_id ON issues(category_id);
CREATE INDEX idx_issues_location_id ON issues(location_id);
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_severity ON issues(severity);
CREATE INDEX idx_issues_created_at ON issues(created_at);
CREATE INDEX idx_locations_parent_id ON locations(parent_id); -- NEW INDEX
CREATE INDEX idx_votes_user_id ON votes(user_id);
CREATE INDEX idx_votes_issue_id ON votes(issue_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_issue_id ON comments(issue_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);

-- Insert sample data
INSERT INTO users (name, email, password) VALUES 
('Demo User', 'demo@test.com', 'demo'),
('Admin User', 'admin@sunoaid.com', 'admin'),
('John Doe', 'john@example.com', 'john');

INSERT INTO categories (name, description, color_code, icon_name) VALUES 
('Infrastructure', 'Roads, sidewalks, bridges, and general infrastructure', '#EF4444', 'construction'),
('Sanitation', 'Waste management, garbage, and cleanliness', '#10B981', 'trash-2'),
('Water Supply', 'Water leaks, drainage, and water-related issues', '#3B82F6', 'droplet'),
('Electricity', 'Power outages, street lights, and electrical problems', '#F59E0B', 'zap'),
('Transportation', 'Public transit, traffic, and transportation issues', '#8B5CF6', 'bus'),
('Healthcare', 'Public health facilities and medical emergencies', '#EF4444', 'heart'),
('Education', 'Schools, libraries, and educational facilities', '#06B6D4', 'book'),
('Environment', 'Parks, trees, pollution, and environmental concerns', '#10B981', 'leaf'),
('Security', 'Public safety, crime, and security concerns', '#F59E0B', 'shield'),
('Other', 'General civic issues not covered by other categories', '#6B7280', 'more-horizontal');

-- UPDATED HIERARCHICAL LOCATIONS SAMPLE DATA
-- Note: The IDs are sequential (1, 2, 3, etc.)
INSERT INTO locations (name, type, city, province, parent_id) VALUES 
-- Top Level: Provinces (ID: 1-2)
('Ontario', 'province', 'Ontario', 'Canada', NULL),
('Quebec', 'province', 'Quebec', 'Canada', NULL),
-- Second Level: Cities, children of provinces (ID: 3-5)
('Toronto', 'city', 'Toronto', 'Ontario', 1),
('Montreal', 'city', 'Montreal', 'Quebec', 2),
('Vancouver', 'city', 'Vancouver', 'British Columbia', NULL), -- Example of a city without a province parent
-- Third Level: Districts, children of cities (ID: 6-9)
('Downtown Core', 'district', 'Toronto', 'Ontario', 3),
('North York', 'district', 'Toronto', 'Ontario', 3),
('Old Montreal', 'district', 'Montreal', 'Quebec', 4),
('Plateau-Mont-Royal', 'district', 'Montreal', 'Quebec', 4);


-- UPDATED ISSUES SAMPLE DATA WITH CORRECTED LOCATION IDs
INSERT INTO issues (title, description, user_id, category_id, location_id, severity, address, upvotes, downvotes, views) VALUES 
('Pothole on Main Street', 'Large pothole causing damage to vehicles near the intersection of Main St and 1st Ave', 1, 1, 6, 'high', '123 Main Street, Toronto, ON', 15, 2, 45), -- Location: Downtown Core (ID 6)
('Broken streetlight in park', 'Streetlight has been out for over a week, making the area unsafe at night', 2, 4, 7, 'medium', 'Central Park, 456 Park Ave, Toronto, ON', 8, 1, 23), -- Location: North York (ID 7)
('Water leak on residential street', 'Continuous water leak from underground pipe flooding the sidewalk', 3, 3, 8, 'critical', '789 Elm Street, Montreal, QC', 22, 0, 67); -- Location: Old Montreal (ID 8)


-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at on issues
CREATE TRIGGER update_issues_updated_at BEFORE UPDATE ON issues
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update comments_count when comments are added/removed
CREATE OR REPLACE FUNCTION update_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE issues SET comments_count = comments_count + 1 WHERE id = NEW.issue_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE issues SET comments_count = comments_count - 1 WHERE id = OLD.issue_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Triggers to automatically update comments_count
CREATE TRIGGER update_comments_count_insert AFTER INSERT ON comments
    FOR EACH ROW EXECUTE FUNCTION update_comments_count();

CREATE TRIGGER update_comments_count_delete AFTER DELETE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_comments_count();