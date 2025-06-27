-- SunoAid Civic Reporting System - Complete PostgreSQL Schema
-- Generated for Week 1 implementation with comprehensive models

-- Drop existing tables if they exist (in correct order to handle foreign key constraints)
DROP TABLE IF EXISTS comment_vote CASCADE;
DROP TABLE IF EXISTS attachment CASCADE;
DROP TABLE IF EXISTS issue_update CASCADE;
DROP TABLE IF EXISTS notification CASCADE;
DROP TABLE IF EXISTS comment CASCADE;
DROP TABLE IF EXISTS vote CASCADE;
DROP TABLE IF EXISTS issue CASCADE;
DROP TABLE IF EXISTS category CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;
DROP TABLE IF EXISTS department CASCADE;
DROP TABLE IF EXISTS location CASCADE;

-- Create Location table
CREATE TABLE location (
    id SERIAL PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    city VARCHAR(64) NOT NULL,
    province VARCHAR(64) NOT NULL,
    latitude FLOAT,
    longitude FLOAT,
    image_url VARCHAR(256),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Department table
CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    description TEXT,
    email VARCHAR(120),
    phone VARCHAR(20),
    website VARCHAR(256),
    head_of_department VARCHAR(128),
    location_id INTEGER REFERENCES location(id),
    coverage_areas JSONB,
    working_hours JSONB,
    emergency_contact VARCHAR(20),
    response_time_hours INTEGER,
    categories JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create User table with all enhanced fields
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password VARCHAR(128) NOT NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR(256),
    role VARCHAR(20) DEFAULT 'citizen',
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    email_verified_at TIMESTAMP,
    phone_verified_at TIMESTAMP,
    
    -- Location Information
    location_id INTEGER REFERENCES location(id),
    department_id INTEGER REFERENCES department(id),
    address TEXT,
    postal_code VARCHAR(10),
    
    -- Profile Information
    date_of_birth DATE,
    gender VARCHAR(20),
    occupation VARCHAR(100),
    bio TEXT,
    
    -- Preferences and Settings
    language_preference VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'UTC',
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    push_notifications BOOLEAN DEFAULT TRUE,
    
    -- Privacy Settings
    profile_visibility VARCHAR(20) DEFAULT 'public',
    show_real_name BOOLEAN DEFAULT TRUE,
    show_location BOOLEAN DEFAULT TRUE,
    
    -- Engagement Metrics
    reputation_score INTEGER DEFAULT 0,
    total_issues_reported INTEGER DEFAULT 0,
    total_votes_cast INTEGER DEFAULT 0,
    total_comments_made INTEGER DEFAULT 0,
    
    -- Account Security
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    last_password_change TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(32)
);

-- Create Category table
CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    description TEXT,
    icon VARCHAR(32),
    color VARCHAR(7),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Issue table with comprehensive fields
CREATE TABLE issue (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    user_id INTEGER NOT NULL REFERENCES "user"(id),
    location_id INTEGER NOT NULL REFERENCES location(id),
    category_id INTEGER NOT NULL REFERENCES category(id),
    
    -- Issue Classification
    severity VARCHAR(32) DEFAULT 'medium',
    status VARCHAR(32) DEFAULT 'open',
    priority INTEGER DEFAULT 0,
    tags JSONB,
    
    -- Location Details
    address VARCHAR(256),
    latitude FLOAT,
    longitude FLOAT,
    landmark_description TEXT,
    
    -- Media and Evidence
    media_urls JSONB,
    media_metadata JSONB,
    
    -- Engagement Metrics
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    bookmarks INTEGER DEFAULT 0,
    
    -- Issue Lifecycle
    first_reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    acknowledged_at TIMESTAMP,
    work_started_at TIMESTAMP,
    resolved_at TIMESTAMP,
    closed_at TIMESTAMP,
    estimated_resolution_date TIMESTAMP,
    actual_resolution_date TIMESTAMP,
    
    -- Administrative Fields
    resolved_by_id INTEGER REFERENCES "user"(id),
    assigned_to_id INTEGER REFERENCES "user"(id),
    assigned_department VARCHAR(100),
    reference_number VARCHAR(50) UNIQUE,
    admin_notes TEXT,
    internal_notes TEXT,
    resolution_description TEXT,
    resolution_cost DECIMAL(10, 2),
    
    -- Quality and Verification
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by_id INTEGER REFERENCES "user"(id),
    verified_at TIMESTAMP,
    is_duplicate BOOLEAN DEFAULT FALSE,
    duplicate_of_id INTEGER REFERENCES issue(id),
    
    -- Communication
    public_updates JSONB,
    contact_allowed BOOLEAN DEFAULT TRUE,
    anonymous_report BOOLEAN DEFAULT FALSE,
    
    -- Moderation
    is_flagged BOOLEAN DEFAULT FALSE,
    flag_reason VARCHAR(100),
    flagged_by_id INTEGER REFERENCES "user"(id),
    flagged_at TIMESTAMP,
    moderation_status VARCHAR(32) DEFAULT 'pending',
    moderated_by_id INTEGER REFERENCES "user"(id),
    moderated_at TIMESTAMP,
    
    -- Urgency and Impact
    urgency_level INTEGER DEFAULT 3,
    impact_radius FLOAT,
    affected_population INTEGER,
    economic_impact DECIMAL(12, 2),
    
    -- Weather and Environmental Context
    weather_conditions VARCHAR(100),
    temperature FLOAT,
    environmental_factors JSONB
);

-- Create Vote table
CREATE TABLE vote (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "user"(id),
    issue_id INTEGER NOT NULL REFERENCES issue(id),
    vote_type VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, issue_id)
);

-- Create Comment table with enhanced fields
CREATE TABLE comment (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    user_id INTEGER NOT NULL REFERENCES "user"(id),
    issue_id INTEGER NOT NULL REFERENCES issue(id),
    parent_id INTEGER REFERENCES comment(id),
    
    -- Comment Features
    is_edited BOOLEAN DEFAULT FALSE,
    edit_history JSONB,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_solution BOOLEAN DEFAULT FALSE,
    
    -- Engagement
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    
    -- Moderation
    is_flagged BOOLEAN DEFAULT FALSE,
    flag_reason VARCHAR(100),
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP,
    deleted_by_id INTEGER REFERENCES "user"(id),
    
    -- Media attachments
    media_urls JSONB,
    
    -- Mentions and tags
    mentioned_users JSONB,
    hashtags JSONB
);

-- Create Comment Vote table
CREATE TABLE comment_vote (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "user"(id),
    comment_id INTEGER NOT NULL REFERENCES comment(id),
    vote_type VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, comment_id)
);

-- Create Issue Update table
CREATE TABLE issue_update (
    id SERIAL PRIMARY KEY,
    issue_id INTEGER NOT NULL REFERENCES issue(id),
    user_id INTEGER NOT NULL REFERENCES "user"(id),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    update_type VARCHAR(32) NOT NULL,
    old_status VARCHAR(32),
    new_status VARCHAR(32),
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Media attachments for updates
    media_urls JSONB,
    
    -- Progress tracking
    progress_percentage INTEGER,
    estimated_completion TIMESTAMP,
    
    -- Additional update data
    update_data JSONB
);

-- Create Notification table
CREATE TABLE notification (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "user"(id),
    title VARCHAR(128) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(32) NOT NULL,
    priority VARCHAR(20) DEFAULT 'normal',
    related_issue_id INTEGER REFERENCES issue(id),
    related_comment_id INTEGER REFERENCES comment(id),
    related_user_id INTEGER REFERENCES "user"(id),
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    
    -- Delivery status
    email_sent BOOLEAN DEFAULT FALSE,
    sms_sent BOOLEAN DEFAULT FALSE,
    push_sent BOOLEAN DEFAULT FALSE,
    email_sent_at TIMESTAMP,
    sms_sent_at TIMESTAMP,
    push_sent_at TIMESTAMP,
    
    -- Action tracking
    action_url VARCHAR(256),
    action_taken BOOLEAN DEFAULT FALSE,
    action_taken_at TIMESTAMP,
    
    -- Additional data
    notification_data JSONB
);

-- Create Attachment table
CREATE TABLE attachment (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(256) NOT NULL,
    original_filename VARCHAR(256) NOT NULL,
    file_url VARCHAR(512) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size INTEGER,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_by_id INTEGER NOT NULL REFERENCES "user"(id),
    
    -- Associations
    issue_id INTEGER REFERENCES issue(id),
    comment_id INTEGER REFERENCES comment(id),
    update_id INTEGER REFERENCES issue_update(id),
    
    -- Media metadata
    width INTEGER,
    height INTEGER,
    duration FLOAT,
    thumbnail_url VARCHAR(512),
    
    -- Processing status
    processing_status VARCHAR(32) DEFAULT 'uploaded',
    processed_at TIMESTAMP,
    
    -- Security and moderation
    is_scanned BOOLEAN DEFAULT FALSE,
    scan_result VARCHAR(32),
    is_approved BOOLEAN DEFAULT TRUE
);

-- Create indexes for better performance
CREATE INDEX idx_user_email ON "user"(email);
CREATE INDEX idx_user_location ON "user"(location_id);
CREATE INDEX idx_user_department ON "user"(department_id);
CREATE INDEX idx_issue_user ON issue(user_id);
CREATE INDEX idx_issue_location ON issue(location_id);
CREATE INDEX idx_issue_category ON issue(category_id);
CREATE INDEX idx_issue_status ON issue(status);
CREATE INDEX idx_issue_severity ON issue(severity);
CREATE INDEX idx_issue_created_at ON issue(created_at);
CREATE INDEX idx_vote_user_issue ON vote(user_id, issue_id);
CREATE INDEX idx_comment_issue ON comment(issue_id);
CREATE INDEX idx_comment_user ON comment(user_id);
CREATE INDEX idx_comment_parent ON comment(parent_id);
CREATE INDEX idx_notification_user ON notification(user_id);
CREATE INDEX idx_notification_read ON notification(is_read);
CREATE INDEX idx_attachment_issue ON attachment(issue_id);
CREATE INDEX idx_attachment_comment ON attachment(comment_id);

-- Insert default categories
INSERT INTO category (name, description, icon, color) VALUES
('Infrastructure', 'Roads, bridges, utilities', 'bi-tools', '#3B82F6'),
('Sanitation', 'Waste management, cleanliness', 'bi-trash', '#10B981'),
('Water Supply', 'Water shortage, quality issues', 'bi-droplet', '#06B6D4'),
('Electricity', 'Power outages, electrical issues', 'bi-lightning-charge', '#F59E0B'),
('Transportation', 'Public transport, traffic', 'bi-bus-front', '#8B5CF6'),
('Healthcare', 'Medical facilities, health services', 'bi-heart-pulse', '#EF4444'),
('Education', 'Schools, educational resources', 'bi-book', '#EC4899'),
('Environment', 'Pollution, environmental concerns', 'bi-tree', '#22C55E'),
('Security', 'Safety, crime, security issues', 'bi-shield', '#6B7280'),
('Other', 'Other civic issues', 'bi-three-dots', '#9CA3AF');

-- Insert sample locations
INSERT INTO location (name, city, province, latitude, longitude) VALUES
('Gulberg', 'Lahore', 'Punjab', 31.5204, 74.3587),
('DHA', 'Karachi', 'Sindh', 24.8607, 67.0011),
('F-6', 'Islamabad', 'ICT', 33.6844, 73.0479),
('Saddar', 'Rawalpindi', 'Punjab', 33.5977, 73.0515),
('Blue Area', 'Islamabad', 'ICT', 33.7077, 73.0563),
('Clifton', 'Karachi', 'Sindh', 24.8138, 67.0299),
('Model Town', 'Lahore', 'Punjab', 31.5580, 74.3187),
('Nazimabad', 'Karachi', 'Sindh', 24.9343, 67.0350),
('G-9', 'Islamabad', 'ICT', 33.6693, 73.0363),
('Johar Town', 'Lahore', 'Punjab', 31.4692, 74.2805);

-- Insert sample departments
INSERT INTO department (name, description, email, phone, location_id, response_time_hours, is_active) VALUES
('Water and Sanitation Agency', 'Responsible for water supply and waste management', 'wasa@lahore.gov.pk', '+92-42-99211234', 1, 24, true),
('Karachi Electric', 'Electricity distribution and maintenance', 'complaints@ke.com.pk', '+92-21-99213456', 2, 12, true),
('Capital Development Authority', 'Urban planning and development', 'info@cda.gov.pk', '+92-51-99214567', 3, 48, true),
('Traffic Engineering Bureau', 'Traffic management and road safety', 'teb@punjab.gov.pk', '+92-42-99215678', 1, 8, true),
('Solid Waste Management', 'Waste collection and disposal', 'swm@sindh.gov.pk', '+92-21-99216789', 2, 24, true);

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to tables with updated_at column
CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "user" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_issue_updated_at BEFORE UPDATE ON issue FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comment_updated_at BEFORE UPDATE ON comment FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_department_updated_at BEFORE UPDATE ON department FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions (adjust as needed for your database user)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;

-- Display table creation summary
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Display total record counts
SELECT 'Categories' as table_name, COUNT(*) as record_count FROM category
UNION ALL
SELECT 'Locations' as table_name, COUNT(*) as record_count FROM location
UNION ALL
SELECT 'Departments' as table_name, COUNT(*) as record_count FROM department
UNION ALL
SELECT 'Users' as table_name, COUNT(*) as record_count FROM "user"
UNION ALL
SELECT 'Issues' as table_name, COUNT(*) as record_count FROM issue;

COMMIT;
