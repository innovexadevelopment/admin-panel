-- Demo Data for Admin Panel
-- Run this script in your Supabase SQL Editor to populate all tables with demo data

-- Clear existing data (optional - comment out if you want to keep existing data)
-- TRUNCATE TABLE hero_sections, services, projects, timeline_items, team_members, testimonials, impact_stats, gallery_images, contact_info, campaigns CASCADE;

-- HERO SECTIONS
INSERT INTO hero_sections (site, title, subtitle, primary_cta_label, primary_cta_url, secondary_cta_label, secondary_cta_url, overlay_opacity, order_index, is_active) VALUES
('company', 'Transform Your Business Today', 'We provide cutting-edge solutions to help your business grow and succeed in the digital age.', 'Get Started', 'https://example.com/get-started', 'Learn More', 'https://example.com/about', 0.4, 1, true),
('company', 'Innovation Meets Excellence', 'Delivering world-class services with a commitment to quality and customer satisfaction.', 'Contact Us', 'https://example.com/contact', 'View Services', 'https://example.com/services', 0.5, 2, true),
('ngo', 'Making a Difference Together', 'Join us in our mission to create positive change in communities around the world.', 'Donate Now', 'https://example.com/donate', 'Our Impact', 'https://example.com/impact', 0.4, 1, true),
('ngo', 'Empowering Communities', 'Building a better future through education, healthcare, and sustainable development.', 'Get Involved', 'https://example.com/volunteer', 'Our Programs', 'https://example.com/programs', 0.5, 2, true);

-- SERVICES
INSERT INTO services (site, title, short_description, long_description, icon, order_index) VALUES
('company', 'Web Development', 'Custom web solutions tailored to your business needs', 'We create responsive, scalable web applications using the latest technologies. Our team ensures your website is fast, secure, and optimized for search engines.', '💻', 1),
('company', 'Digital Marketing', 'Boost your online presence and reach more customers', 'Comprehensive digital marketing strategies including SEO, social media marketing, content creation, and paid advertising campaigns.', '📱', 2),
('company', 'Cloud Solutions', 'Scalable cloud infrastructure for modern businesses', 'Migrate to the cloud with confidence. We provide cloud consulting, migration services, and ongoing management for AWS, Azure, and GCP.', '☁️', 3),
('company', 'Consulting Services', 'Expert advice to help you make informed decisions', 'Strategic consulting to help your business grow. We analyze your current situation and provide actionable recommendations.', '📊', 4);

-- PROJECTS
INSERT INTO projects (site, title, slug, short_description, long_description, category, start_date, end_date, is_ongoing, highlight) VALUES
('company', 'E-Commerce Platform Redesign', 'ecommerce-platform-redesign', 'Complete redesign of a major e-commerce platform', 'We redesigned and rebuilt a major e-commerce platform, improving user experience and increasing conversion rates by 45%. The project involved modernizing the tech stack, implementing a new design system, and optimizing performance.', 'Web Development', '2024-01-15', '2024-06-30', false, true),
('company', 'Mobile App for Healthcare', 'mobile-app-healthcare', 'Native mobile application for healthcare providers', 'Developed a comprehensive mobile application for healthcare providers to manage patient records, schedule appointments, and communicate with patients securely.', 'Mobile Development', '2024-03-01', NULL, true, true),
('ngo', 'Education Initiative 2024', 'education-initiative-2024', 'Providing quality education to underprivileged children', 'Our education initiative aims to provide quality education to 10,000 underprivileged children across 50 schools. We provide books, learning materials, and teacher training programs.', 'Education', '2024-01-01', NULL, true, true),
('ngo', 'Clean Water Project', 'clean-water-project', 'Bringing clean water to rural communities', 'This project focuses on installing water wells and filtration systems in rural communities, providing access to clean drinking water for over 5,000 families.', 'Health & Sanitation', '2023-06-01', '2024-12-31', false, true);

-- TIMELINE ITEMS
INSERT INTO timeline_items (site, title, subtitle, location, description, start_date, end_date, is_current, type, order_index) VALUES
('company', 'Company Founded', 'The beginning of our journey', 'New York, USA', 'Founded with a vision to transform businesses through technology', '2015-01-15', NULL, false, 'milestone', 1),
('company', 'First Major Client', 'Landing our first enterprise client', 'San Francisco, USA', 'Secured our first major enterprise client, marking a significant milestone in our growth', '2016-03-20', NULL, false, 'milestone', 2),
('company', 'International Expansion', 'Opening offices in Europe and Asia', 'Multiple Locations', 'Expanded operations to serve clients globally with new offices in London, Berlin, and Singapore', '2018-06-01', NULL, false, 'milestone', 3),
('company', 'Current Growth Phase', 'Scaling operations and team', 'Global', 'Currently in a rapid growth phase, expanding our team and service offerings', '2020-01-01', NULL, true, 'experience', 4),
('ngo', 'Organization Established', 'Foundation of our NGO', 'Delhi, India', 'Established with a mission to create positive social impact', '2010-05-10', NULL, false, 'milestone', 1),
('ngo', 'First Community Program', 'Launching our first community initiative', 'Mumbai, India', 'Launched our first community program focusing on education and healthcare', '2011-08-15', NULL, false, 'milestone', 2),
('ngo', 'International Recognition', 'Receiving global awards', 'Global', 'Received recognition from international organizations for our impactful work', '2018-11-20', NULL, false, 'milestone', 3),
('ngo', 'Current Operations', 'Ongoing community development', 'Multiple Locations', 'Currently operating in 15 countries with over 50 active programs', '2020-01-01', NULL, true, 'experience', 4);

-- TEAM MEMBERS
INSERT INTO team_members (site, name, role, bio, order_index) VALUES
('company', 'John Smith', 'CEO & Founder', 'With over 15 years of experience in technology and business, John leads our company with a vision for innovation and excellence.', 1),
('company', 'Sarah Johnson', 'CTO', 'Sarah is a technology expert with a passion for building scalable solutions. She has led numerous successful projects.', 2),
('company', 'Michael Chen', 'Head of Design', 'Michael brings creativity and user-centered thinking to every project, ensuring exceptional user experiences.', 3),
('company', 'Emily Davis', 'Marketing Director', 'Emily drives our marketing strategy with data-driven insights and creative campaigns that deliver results.', 4),
('ngo', 'Dr. Priya Sharma', 'Executive Director', 'Dr. Sharma has dedicated her life to social causes, with over 20 years of experience in community development.', 1),
('ngo', 'Ahmed Hassan', 'Program Manager', 'Ahmed manages our field operations, ensuring programs are delivered effectively to communities in need.', 2),
('ngo', 'Maria Rodriguez', 'Fundraising Coordinator', 'Maria leads our fundraising efforts, building relationships with donors and partners worldwide.', 3),
('ngo', 'David Kim', 'Education Specialist', 'David develops and implements educational programs that transform lives in underserved communities.', 4);

-- TESTIMONIALS
INSERT INTO testimonials (site, name, role, organization, quote, order_index) VALUES
('company', 'Robert Williams', 'CEO', 'TechCorp Inc.', 'Working with this team transformed our business. Their expertise and dedication are unmatched. Highly recommended!', 1),
('company', 'Lisa Anderson', 'Marketing Director', 'Global Brands', 'The digital marketing campaign they created exceeded all our expectations. Our sales increased by 60% in just 3 months.', 2),
('company', 'James Wilson', 'Founder', 'StartupXYZ', 'They understood our vision and delivered beyond expectations. The web platform they built is exactly what we needed.', 3),
('ngo', 'Fatima Ali', 'Community Leader', 'Rural Development Association', 'This organization has made a real difference in our community. Their education programs have transformed hundreds of lives.', 1),
('ngo', 'Carlos Mendez', 'Volunteer', 'Local Community', 'I have been volunteering with them for 3 years. The impact they create is incredible and inspiring.', 2),
('ngo', 'Aisha Patel', 'Beneficiary', 'Education Program', 'Thanks to their support, I was able to complete my education and now I am helping others in my community.', 3);

-- IMPACT STATS
INSERT INTO impact_stats (site, label, value, suffix, description, icon, order_index) VALUES
('company', 'Projects Completed', 250, '+', 'Successfully delivered projects across various industries', '🎯', 1),
('company', 'Happy Clients', 180, '+', 'Satisfied clients who trust us with their business', '😊', 2),
('company', 'Team Members', 45, '', 'Talented professionals working together', '👥', 3),
('company', 'Countries Served', 25, '', 'Global reach with clients worldwide', '🌍', 4),
('ngo', 'Lives Impacted', 50000, '+', 'People whose lives have been positively changed', '❤️', 1),
('ngo', 'Programs Active', 50, '+', 'Active programs running across multiple countries', '📋', 2),
('ngo', 'Communities Served', 200, '+', 'Communities benefiting from our initiatives', '🏘️', 3),
('ngo', 'Volunteers', 500, '+', 'Dedicated volunteers supporting our mission', '🤝', 4);

-- GALLERY IMAGES (NGO only)
INSERT INTO gallery_images (site, title, description, image_path, taken_at, order_index) VALUES
('ngo', 'Education Program', 'Children learning in our education center', 'ngo/gallery/education-1.jpg', '2024-01-15', 1),
('ngo', 'Healthcare Camp', 'Free medical camp in rural area', 'ngo/gallery/healthcare-1.jpg', '2024-02-20', 2),
('ngo', 'Community Meeting', 'Community members discussing development plans', 'ngo/gallery/community-1.jpg', '2024-03-10', 3),
('ngo', 'Water Well Installation', 'Installing a new water well in a village', 'ngo/gallery/water-1.jpg', '2024-04-05', 4);

-- CONTACT INFO
INSERT INTO contact_info (site, email, phone, address, map_embed_url, socials) VALUES
('company', 'contact@company.com', '+1 (555) 123-4567', '123 Business Street, Suite 100, New York, NY 10001, USA', 'https://www.google.com/maps/embed?pb=...', '{"twitter": "https://twitter.com/company", "linkedin": "https://linkedin.com/company/company", "facebook": "https://facebook.com/company"}'),
('ngo', 'info@ngo.org', '+91 98765 43210', '456 Service Road, Community Center, Delhi 110001, India', 'https://www.google.com/maps/embed?pb=...', '{"twitter": "https://twitter.com/ngo", "instagram": "https://instagram.com/ngo", "facebook": "https://facebook.com/ngo"}');

-- CAMPAIGNS (NGO only)
INSERT INTO campaigns (site, title, slug, short_description, long_description, goal_amount, raised_amount, is_active) VALUES
('ngo', 'Education for All 2024', 'education-for-all-2024', 'Providing quality education to 10,000 children', 'This campaign aims to provide quality education, books, and learning materials to 10,000 underprivileged children across 50 schools. Your donation will help us reach more children and create lasting impact.', 100000, 45000, true),
('ngo', 'Clean Water Initiative', 'clean-water-initiative', 'Bringing clean water to 5,000 families', 'Help us install water wells and filtration systems in rural communities. This initiative will provide access to clean drinking water for over 5,000 families, improving health and quality of life.', 75000, 32000, true),
('ngo', 'Healthcare Access Program', 'healthcare-access-program', 'Free healthcare for underserved communities', 'Our healthcare program provides free medical camps, vaccinations, and health education to underserved communities. Support us in bringing healthcare to those who need it most.', 50000, 18000, true);

-- CONTACT MESSAGES
INSERT INTO contact_messages (site, name, email, subject, message, status) VALUES
('company', 'Alice Brown', 'alice@example.com', 'Inquiry about Services', 'I am interested in learning more about your web development services. Could you please provide more information?', 'new'),
('company', 'Bob Miller', 'bob@example.com', 'Project Proposal', 'We have a project that might be a good fit. Would like to schedule a call to discuss.', 'seen'),
('company', 'Carol White', 'carol@example.com', 'Partnership Opportunity', 'We are looking for a technology partner for our upcoming project. Let us know if you are interested.', 'new'),
('ngo', 'Rahul Kumar', 'rahul@example.com', 'Volunteer Application', 'I would like to volunteer for your education programs. Please let me know how I can help.', 'new'),
('ngo', 'Sneha Patel', 'sneha@example.com', 'Donation Inquiry', 'I would like to make a donation. Can you provide more details about how the funds will be used?', 'seen'),
('ngo', 'Amit Singh', 'amit@example.com', 'Program Information', 'I am interested in learning more about your healthcare programs in rural areas.', 'new');

