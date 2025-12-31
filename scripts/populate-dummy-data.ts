import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials')
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Create client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Helper to compress image to WebP <100KB
async function compressToWebP(inputPath: string, maxSizeKB: number = 100): Promise<Buffer> {
  let quality = 85
  let maxWidth = 1920
  
  while (quality >= 50) {
    let buffer = await sharp(inputPath)
      .resize(maxWidth, null, { withoutEnlargement: true })
      .webp({ quality })
      .toBuffer()
    
    if (buffer.length <= maxSizeKB * 1024) {
      console.log(`✅ Compressed to ${(buffer.length / 1024).toFixed(2)}KB at quality ${quality}`)
      return buffer
    }
    
    // Reduce quality and/or size
    quality -= 5
    if (quality < 60) {
      maxWidth = Math.max(1200, maxWidth - 200)
    }
  }
  
  // Final attempt with aggressive compression
  return await sharp(inputPath)
    .resize(1200, null, { withoutEnlargement: true })
    .webp({ quality: 50 })
    .toBuffer()
}

// Upload image and create media record
async function uploadImage(
  imagePath: string,
  websiteType: 'company' | 'ngo',
  folder: string,
  altText: string,
  isHero: boolean = false
): Promise<string> {
  console.log(`📤 Uploading ${path.basename(imagePath)} as ${isHero ? 'hero' : 'regular'} image to ${folder}...`)
  
  // Compress to WebP
  const compressedBuffer = await compressToWebP(imagePath)
  const fileName = `${isHero ? 'hero' : 'square'}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.webp`
  const filePath = `${websiteType}/${folder}/${fileName}`
  
  // Upload to storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('media')
    .upload(filePath, compressedBuffer, {
      contentType: 'image/webp',
      upsert: true,
    })
  
  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`)
  }
  
  // Get public URL
  const { data: urlData } = supabase.storage
    .from('media')
    .getPublicUrl(filePath)
  
  // Get image dimensions
  const metadata = await sharp(compressedBuffer).metadata()
  
  // Create media record
  const tableName = websiteType === 'company' ? 'company_media' : 'ngo_media'
  
  // Prepare insert data - ensure types match schema
  const insertData: any = {
    file_name: fileName,
    file_path: filePath,
    file_url: urlData.publicUrl,
    file_size: Number(compressedBuffer.length), // Ensure integer type
    mime_type: 'image/webp',
    type: 'image',
    folder_path: folder,
  }
  
  // Add optional fields only if they exist
  if (metadata.width) insertData.width = Number(metadata.width)
  if (metadata.height) insertData.height = Number(metadata.height)
  if (altText) insertData.alt_text = altText
  
  console.log(`📝 Inserting into ${tableName}...`)
  const { data: media, error: mediaError } = await supabase
    .from(tableName)
    .insert(insertData)
    .select()
    .single()
  
  if (mediaError) {
    console.error('❌ Full error:', JSON.stringify(mediaError, null, 2))
    console.error('Table:', tableName)
    console.error('Data keys:', Object.keys(insertData))
    throw new Error(`Media record creation failed: ${mediaError.message} (Code: ${mediaError.code || 'unknown'})`)
  }
  
  console.log(`✅ Uploaded: ${media.id}`)
  return media.id
}

// Realistic dummy data generators
const companyNames = [
  'TechCorp Solutions', 'Global Innovations Inc', 'Digital Dynamics', 'CloudBridge Systems',
  'NextGen Technologies', 'SmartSolutions Group', 'FutureWorks', 'InnovateHub'
]

const ngoNames = [
  'Hope Foundation', 'Community Care Network', 'Global Aid Initiative', 'Future Generations',
  'Unity for Change', 'Empowerment Alliance', 'Sustainable Futures', 'Together We Rise'
]

const personNames = [
  'Sarah Johnson', 'Michael Chen', 'Emily Rodriguez', 'David Thompson', 'Lisa Anderson',
  'James Wilson', 'Maria Garcia', 'Robert Brown', 'Jennifer Lee', 'Christopher Davis'
]

const roles = [
  'CEO', 'CTO', 'Marketing Director', 'Project Manager', 'Senior Developer',
  'Design Lead', 'Operations Manager', 'Business Analyst', 'Product Manager'
]

const services = [
  'Web Development', 'Mobile App Development', 'Cloud Infrastructure', 'Digital Marketing',
  'UI/UX Design', 'Data Analytics', 'E-commerce Solutions', 'Enterprise Software'
]

const programs = [
  'Education for All', 'Healthcare Access', 'Clean Water Initiative', 'Women Empowerment',
  'Youth Development', 'Environmental Conservation', 'Disaster Relief', 'Community Building'
]

const blogTitles = {
  company: [
    'The Future of Web Development: Trends to Watch in 2024',
    'How Cloud Infrastructure Transforms Business Operations',
    'Building Scalable Applications: Best Practices and Strategies',
    'Digital Transformation: A Guide for Modern Businesses',
    'The Role of AI in Modern Software Development',
    'Creating User-Centered Design: Principles and Implementation',
    'E-commerce Solutions: Driving Online Business Growth',
    'Mobile-First Development: Why It Matters in 2024'
  ],
  ngo: [
    'Making a Difference: Stories from the Field',
    'Education as a Tool for Social Change',
    'Building Sustainable Communities: Our Approach',
    'The Impact of Clean Water on Health and Development',
    'Empowering Women: Creating Opportunities for Growth',
    'Youth Programs: Investing in the Next Generation',
    'Environmental Conservation: Our Commitment to the Planet',
    'Community Resilience: Stories of Hope and Recovery'
  ]
}

const testimonials = {
  company: [
    {
      name: 'John Smith',
      role: 'CEO',
      company: 'TechStart Inc',
      content: 'Their team transformed our digital presence completely. The new platform increased our online engagement by 300% and streamlined our operations significantly. Professional, efficient, and results-driven.',
      rating: 5
    },
    {
      name: 'Amanda White',
      role: 'Marketing Director',
      company: 'Growth Partners',
      content: 'Working with them was a game-changer. They understood our vision and delivered beyond expectations. The mobile app they developed has become our primary revenue driver.',
      rating: 5
    },
    {
      name: 'Robert Martinez',
      role: 'Founder',
      company: 'InnovateLab',
      content: 'Exceptional service and technical expertise. They helped us scale our infrastructure to handle 10x traffic without any issues. Highly recommend for enterprise solutions.',
      rating: 5
    }
  ],
  ngo: [
    {
      name: 'Dr. Priya Sharma',
      role: 'Program Director',
      company: 'Health First Foundation',
      content: 'Their support has been instrumental in expanding our healthcare programs to rural communities. Thousands of families now have access to essential medical services thanks to this partnership.',
      rating: 5
    },
    {
      name: 'Michael O\'Brien',
      role: 'Volunteer Coordinator',
      company: 'Community Action Network',
      content: 'The impact of their programs is visible in every community we serve. The education initiatives have transformed lives and created opportunities for hundreds of children.',
      rating: 5
    },
    {
      name: 'Fatima Al-Hassan',
      role: 'Field Officer',
      company: 'Global Development Initiative',
      content: 'Their commitment to sustainable development is remarkable. The clean water projects have improved health outcomes and empowered communities to thrive independently.',
      rating: 5
    }
  ]
}

// Blog content for both websites (moved to shared scope)
const blogContent = {
  company: [
    `The landscape of web development continues to evolve at a rapid pace, with new frameworks, tools, and methodologies emerging regularly. In 2024, we're seeing a significant shift towards serverless architectures, edge computing, and AI-powered development tools. Modern web applications are becoming more sophisticated, requiring developers to stay current with the latest technologies and best practices.

One of the most significant trends is the adoption of frameworks that prioritize performance and developer experience. React, Next.js, and Vue.js continue to dominate, but we're also seeing growing interest in newer alternatives that offer improved performance characteristics. The focus on Core Web Vitals and user experience metrics has pushed developers to optimize every aspect of their applications.

Another key development is the integration of artificial intelligence into the development workflow. AI-powered code assistants are becoming standard tools, helping developers write code faster and with fewer errors. These tools are not replacing developers but augmenting their capabilities, allowing teams to focus on solving complex problems rather than writing boilerplate code.

The rise of microservices and containerization has also transformed how we build and deploy web applications. Docker and Kubernetes have become essential tools for managing complex application architectures, enabling teams to scale applications more effectively and deploy updates with minimal downtime.`,

    `Cloud infrastructure has revolutionized how businesses operate, providing unprecedented scalability, flexibility, and cost-effectiveness. Modern organizations are moving away from traditional on-premises solutions to cloud-based platforms that offer better performance and reduced operational overhead.

The benefits of cloud infrastructure extend far beyond simple cost savings. Businesses can now scale their operations up or down based on demand, ensuring they only pay for the resources they actually use. This elasticity is particularly valuable for companies experiencing rapid growth or seasonal fluctuations in demand.

Security is another critical advantage of modern cloud platforms. Leading providers invest heavily in security measures, often exceeding what most organizations could implement on their own. This includes advanced threat detection, automated backups, and compliance with various industry standards and regulations.

Cloud infrastructure also enables better collaboration and remote work capabilities. Teams can access resources from anywhere in the world, work on shared projects in real-time, and maintain consistent workflows regardless of physical location. This has become especially important in the post-pandemic work environment.`,

    `Building scalable applications requires careful planning and a deep understanding of both technical requirements and business objectives. Scalability isn't just about handling more users or data; it's about creating systems that can grow and adapt without requiring complete redesigns.

The foundation of scalable applications lies in proper architecture design. This includes choosing the right database solutions, implementing effective caching strategies, and designing APIs that can handle increasing loads. Microservices architecture has become a popular approach, allowing different parts of an application to scale independently based on their specific needs.

Performance optimization is crucial for scalability. This involves everything from database query optimization to implementing content delivery networks (CDNs) for static assets. Every millisecond of response time matters when dealing with high-traffic applications, and small optimizations can have significant cumulative effects.

Monitoring and observability are essential for maintaining scalable applications. Teams need comprehensive logging, metrics, and alerting systems to identify bottlenecks and performance issues before they impact users. Modern observability tools provide real-time insights into application performance, helping teams make data-driven decisions about scaling and optimization.`
  ],
  ngo: [
    `Our field work has taken us to communities across multiple continents, where we've witnessed firsthand the transformative power of education. In rural areas where access to quality education was previously limited, our programs have opened doors to opportunities that were once unimaginable.

One particularly inspiring story comes from a small village in Southeast Asia, where we established a learning center that now serves over 200 children. The center provides not just basic education, but also computer literacy, English language skills, and vocational training for older students. Many graduates have gone on to pursue higher education or start their own businesses, creating a ripple effect of positive change throughout the community.

The key to our success has been working closely with local communities to understand their specific needs and challenges. We don't impose solutions from the outside; instead, we collaborate with community leaders, parents, and educators to develop programs that are culturally appropriate and sustainable. This participatory approach ensures that our initiatives have lasting impact long after our direct involvement ends.

Measuring the impact of education programs goes beyond enrollment numbers. We track learning outcomes, student retention rates, and most importantly, the long-term success of our graduates. The data shows that students who complete our programs are significantly more likely to continue their education, find employment, and contribute positively to their communities.`,

    `Education is one of the most powerful tools for creating lasting social change. When communities have access to quality education, they gain the knowledge and skills needed to improve their circumstances, break cycles of poverty, and build better futures for themselves and their children.

Our education programs focus on more than just literacy and numeracy. We work to develop critical thinking skills, creativity, and problem-solving abilities that students can apply throughout their lives. This holistic approach to education prepares students not just for exams, but for the challenges and opportunities they'll encounter in the real world.

One of the biggest challenges we face is ensuring that education is accessible to all, regardless of gender, socioeconomic status, or geographic location. In many of the communities we serve, traditional barriers have prevented certain groups from accessing education. We work to break down these barriers through scholarships, flexible learning schedules, and programs specifically designed for marginalized populations.

The impact of our education initiatives extends beyond individual students. Educated individuals become agents of change in their communities, sharing knowledge, starting businesses, and advocating for improvements. This multiplier effect means that investing in education creates returns that continue to grow over time, making it one of the most effective ways to create sustainable social change.`
  ]
}

// Main population function
async function populateData() {
  console.log('🚀 Starting data population...\n')
  
  // Verify service role has access
  console.log('🔍 Verifying database access...')
  const { data: testData, error: testError } = await supabase
    .from('company_media')
    .select('id')
    .limit(1)
  
  if (testError) {
    if (testError.code === '42P01') {
      console.error('❌ Table company_media does not exist. Please apply the database schema first.')
      process.exit(1)
    } else if (testError.code === '42501') {
      console.error('❌ Permission denied. Please verify:')
      console.error('   1. SUPABASE_SERVICE_ROLE_KEY is correct (starts with eyJ...)')
      console.error('   2. The service role key matches the Supabase project')
      console.error('   3. RLS policies allow service role access')
      console.error(`   Error: ${testError.message}`)
      process.exit(1)
    } else {
      console.warn('⚠️  Warning:', testError.message)
    }
  } else {
    console.log('✅ Database access verified\n')
  }
  
  const imagesDir = path.join(process.cwd(), 'aa')
  const bannerPath = path.join(imagesDir, 'banner.avif')
  const squarePath = path.join(imagesDir, 'square.jpg')
  
  if (!fs.existsSync(bannerPath) || !fs.existsSync(squarePath)) {
    console.error('❌ Images not found in aa/ directory')
    process.exit(1)
  }
  
  // Upload images for both websites
  console.log('📸 Processing images...\n')
  
  const imageIds: {
    company: { hero: string; square: string }
    ngo: { hero: string; square: string }
  } = {
    company: { hero: '', square: '' },
    ngo: { hero: '', square: '' }
  }
  
  // Upload hero images (banner)
  imageIds.company.hero = await uploadImage(bannerPath, 'company', 'pages', 'Hero banner image', true)
  imageIds.ngo.hero = await uploadImage(bannerPath, 'ngo', 'pages', 'Hero banner image', true)
  
  // Upload square images
  imageIds.company.square = await uploadImage(squarePath, 'company', 'pages', 'Square image', false)
  imageIds.ngo.square = await uploadImage(squarePath, 'ngo', 'pages', 'Square image', false)
  
  // Upload more square images for different folders
  const companySquareIds: string[] = [imageIds.company.square]
  const ngoSquareIds: string[] = [imageIds.ngo.square]
  
  for (const folder of ['blogs', 'team', 'testimonials', 'partners', 'programs']) {
    companySquareIds.push(await uploadImage(squarePath, 'company', folder, `${folder} image`, false))
    ngoSquareIds.push(await uploadImage(squarePath, 'ngo', folder, `${folder} image`, false))
  }
  
  console.log('\n✅ Images uploaded successfully\n')
  
  // Populate data for Company website
  console.log('🏢 Populating Company (Innovexa) data...\n')
  await populateCompanyData(imageIds.company.hero, companySquareIds)
  
  // Populate data for NGO website
  console.log('\n❤️ Populating NGO (DUAF) data...\n')
  await populateNgoData(imageIds.ngo.hero, ngoSquareIds)
  
  console.log('\n✅ Data population completed successfully!')
}

async function populateCompanyData(heroImageId: string, squareImageIds: string[]) {
  console.log('🧹 Cleaning up existing company data...')
  
  // Delete existing data in reverse order of dependencies
  await supabase.from('company_content_blocks').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('company_sections').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('company_pages').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('company_blogs').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('company_services').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('company_projects').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('company_team').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('company_testimonials').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('company_partners').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  
  // Create pages
  const pages = [
    {
      slug: 'home',
      title: 'Home',
      status: 'published' as const,
      is_homepage: true,
      order_index: 0
    },
    {
      slug: 'about',
      title: 'About Us',
      status: 'published' as const,
      is_homepage: false,
      order_index: 1
    },
    {
      slug: 'services',
      title: 'Our Services',
      status: 'published' as const,
      is_homepage: false,
      order_index: 2
    },
    {
      slug: 'work',
      title: 'Our Work',
      status: 'published' as const,
      is_homepage: false,
      order_index: 3
    },
    {
      slug: 'contact',
      title: 'Contact Us',
      status: 'published' as const,
      is_homepage: false,
      order_index: 4
    }
  ]
  
  // Delete existing pages first (to avoid conflicts)
  await supabase.from('company_pages').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  
  const { data: companyPages, error: pagesError } = await supabase
    .from('company_pages')
    .insert(pages)
    .select()
  
  if (pagesError) {
    console.error('Error creating company pages:', pagesError)
    throw new Error(`Failed to create company pages: ${pagesError.message}`)
  }
  
  if (!companyPages) throw new Error('Failed to create company pages')
  
  // Get hero image URL
  const { data: heroMedia } = await supabase
    .from('company_media')
    .select('file_url')
    .eq('id', heroImageId)
    .single()
  
  // Create sections and content blocks for homepage
  const homepage = companyPages.find(p => p.is_homepage)
  if (homepage && heroMedia) {
    // Hero section
    const { data: heroSection } = await supabase
      .from('company_sections')
      .insert({
        page_id: homepage.id,
        title: 'Hero Section',
        type: 'hero',
        order_index: 0,
        is_visible: true,
        background_image_url: heroMedia.file_url,
      })
      .select()
      .single()
    
    if (heroSection) {
      await supabase.from('company_content_blocks').insert([
        {
          section_id: heroSection.id,
          type: 'heading',
          order_index: 0,
          content: { text: 'Innovative Solutions for Modern Businesses', level: 1 },
          is_visible: true
        },
        {
          section_id: heroSection.id,
          type: 'paragraph',
          order_index: 1,
          content: { text: 'We deliver cutting-edge technology solutions that drive growth and transform businesses. Our expertise spans web development, cloud infrastructure, and digital innovation.' },
          is_visible: true
        },
        {
          section_id: heroSection.id,
          type: 'cta',
          order_index: 2,
          content: { text: 'Get Started', url: '/contact', style: 'primary' },
          is_visible: true
        }
      ])
    }
  }
  
  // Create services/programs
  const servicesData = services.map((service, idx) => ({
    slug: service.toLowerCase().replace(/\s+/g, '-'),
    title: service,
    description: `Comprehensive ${service.toLowerCase()} solutions tailored to your business needs. We deliver innovative approaches and cutting-edge technology to drive your success.`,
    content: `Our ${service.toLowerCase()} services are designed to help businesses achieve their goals through strategic implementation and expert guidance. We combine industry best practices with innovative solutions to deliver measurable results. Our team of experienced professionals works closely with clients to understand their unique challenges and develop customized strategies that align with their objectives.`,
    featured_image_id: squareImageIds[0],
    category: 'Technology',
    status: 'published' as const,
    is_featured: idx < 3,
    order_index: idx
  }))
  
  const { data: companyServices } = await supabase
    .from('company_services')
    .insert(servicesData)
    .select()
  
  // Create projects
  const projects = [
    {
      slug: 'enterprise-platform-development',
      title: 'Enterprise Platform Development',
      description: 'Built a scalable cloud-based platform for a Fortune 500 company, handling millions of transactions daily.',
      content: 'This comprehensive project involved developing a robust enterprise platform that transformed our client\'s digital infrastructure. We implemented microservices architecture, ensuring high availability and scalability. The platform now processes over 5 million transactions daily with 99.9% uptime. Key features include real-time analytics, automated workflows, and seamless third-party integrations. The solution reduced operational costs by 40% and improved customer satisfaction scores significantly.',
      featured_image_id: squareImageIds[0],
      client_name: 'TechCorp Solutions',
      category: 'Enterprise Software',
      status: 'published' as const,
      is_featured: true,
      order_index: 0,
      results_metrics: { cost_reduction: '40%', uptime: '99.9%', transactions: '5M daily' }
    },
    {
      slug: 'e-commerce-transformation',
      title: 'E-commerce Platform Transformation',
      description: 'Complete redesign and migration of legacy e-commerce system to modern cloud infrastructure.',
      content: 'We transformed an outdated e-commerce platform into a modern, high-performance solution. The project involved complete system redesign, data migration, and implementation of advanced features including AI-powered recommendations, personalized shopping experiences, and mobile-first responsive design. The new platform increased conversion rates by 65% and reduced page load times by 80%. Mobile sales increased by 150%, and customer retention improved significantly.',
      featured_image_id: squareImageIds[1],
      client_name: 'RetailMax Inc',
      category: 'E-commerce',
      status: 'published' as const,
      is_featured: true,
      order_index: 1,
      results_metrics: { conversion_increase: '65%', load_time_reduction: '80%', mobile_sales: '+150%' }
    }
  ]
  
  await supabase.from('company_projects').insert(projects)
  
  // Create blog posts with detailed content
  const blogPosts = blogTitles.company.map((title, idx) => ({
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    title,
    excerpt: `Discover insights and best practices in ${title.split(':')[0].toLowerCase()}. Learn from industry experts and stay ahead of the curve with actionable strategies and real-world examples.`,
    content: blogContent.company[idx % blogContent.company.length] || `This comprehensive article explores the latest trends and developments in the field. We dive deep into practical applications, real-world case studies, and actionable strategies that businesses can implement immediately. Our analysis is based on extensive research and industry experience, providing readers with valuable insights that can drive meaningful change in their organizations.`,
    featured_image_id: squareImageIds[2],
    status: 'published' as const,
    published_at: new Date(Date.now() - idx * 7 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['technology', 'business', 'innovation'],
    category: 'Technology',
    view_count: Math.floor(Math.random() * 1000) + 100
  }))
  
  await supabase.from('company_blogs').insert(blogPosts)
  
  // Create team members
  const teamMembers = personNames.slice(0, 6).map((name, idx) => ({
    name,
    role: roles[idx],
    bio: `${name} brings over ${10 + idx * 2} years of experience in ${roles[idx].toLowerCase()}. With a proven track record of delivering successful projects and leading high-performing teams, ${name.split(' ')[0]} is passionate about driving innovation and excellence.`,
    email: `${name.toLowerCase().replace(' ', '.')}@innovexa.com`,
    photo_id: squareImageIds[3],
    is_visible: true,
    order_index: idx
  }))
  
  await supabase.from('company_team').insert(teamMembers)
  
  // Create testimonials
  const testimonialsData = testimonials.company.map((testimonial, idx) => ({
    name: testimonial.name,
    role: testimonial.role,
    company: testimonial.company,
    content: testimonial.content,
    photo_id: squareImageIds[4],
    rating: testimonial.rating,
    is_featured: idx === 0,
    is_visible: true,
    order_index: idx
  }))
  
  await supabase.from('company_testimonials').insert(testimonialsData)
  
  // Create partners
  const partners = companyNames.slice(0, 6).map((name, idx) => ({
    name,
    description: `Strategic partner in ${['Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing', 'Education'][idx]} sector.`,
    logo_id: squareImageIds[5],
    website_url: `https://${name.toLowerCase().replace(/\s+/g, '')}.com`,
    category: 'Technology Partners',
    is_visible: true,
    order_index: idx
  }))
  
  await supabase.from('company_partners').insert(partners)
  
  console.log('✅ Company data populated')
}

async function populateNgoData(heroImageId: string, squareImageIds: string[]) {
  console.log('🧹 Cleaning up existing NGO data...')
  
  // Delete existing data in reverse order of dependencies
  await supabase.from('ngo_content_blocks').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('ngo_sections').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('ngo_pages').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('ngo_blogs').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('ngo_programs').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('ngo_impact_stats').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('ngo_team').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('ngo_testimonials').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('ngo_partners').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  
  // Create pages
  const pages = [
    {
      slug: 'home',
      title: 'Home',
      status: 'published' as const,
      is_homepage: true,
      order_index: 0
    },
    {
      slug: 'about',
      title: 'About Us',
      status: 'published' as const,
      is_homepage: false,
      order_index: 1
    },
    {
      slug: 'programs',
      title: 'Our Programs',
      status: 'published' as const,
      is_homepage: false,
      order_index: 2
    },
    {
      slug: 'impact',
      title: 'Our Impact',
      status: 'published' as const,
      is_homepage: false,
      order_index: 3
    },
    {
      slug: 'get-involved',
      title: 'Get Involved',
      status: 'published' as const,
      is_homepage: false,
      order_index: 4
    }
  ]
  
  const { data: ngoPages } = await supabase
    .from('ngo_pages')
    .insert(pages)
    .select()
  
  if (!ngoPages) throw new Error('Failed to create NGO pages')
  
  // Get hero image URL
  const { data: heroMedia } = await supabase
    .from('ngo_media')
    .select('file_url')
    .eq('id', heroImageId)
    .single()
  
  // Create sections and content blocks for homepage
  const homepage = ngoPages.find(p => p.is_homepage)
  if (homepage && heroMedia) {
    // Hero section
    const { data: heroSection } = await supabase
      .from('ngo_sections')
      .insert({
        page_id: homepage.id,
        title: 'Hero Section',
        type: 'hero',
        order_index: 0,
        is_visible: true,
        background_image_url: heroMedia.file_url,
      })
      .select()
      .single()
    
    if (heroSection) {
      await supabase.from('ngo_content_blocks').insert([
        {
          section_id: heroSection.id,
          type: 'heading',
          order_index: 0,
          content: { text: 'Creating Lasting Impact in Communities Worldwide', level: 1 },
          is_visible: true
        },
        {
          section_id: heroSection.id,
          type: 'paragraph',
          order_index: 1,
          content: { text: 'We work tirelessly to create positive change through education, healthcare, and community development programs. Join us in making a difference.' },
          is_visible: true
        },
        {
          section_id: heroSection.id,
          type: 'cta',
          order_index: 2,
          content: { text: 'Get Involved', url: '/get-involved', style: 'primary' },
          is_visible: true
        }
      ])
    }
  }
  
  // Create programs
  const programsData = programs.map((program, idx) => ({
    slug: program.toLowerCase().replace(/\s+/g, '-'),
    title: program,
    description: `Our ${program.toLowerCase()} program addresses critical needs in communities worldwide, creating lasting positive change through sustainable solutions and collaborative partnerships.`,
    content: `The ${program} initiative represents our commitment to creating meaningful impact in the communities we serve. Through strategic partnerships, community engagement, and evidence-based approaches, we work to address root causes and build sustainable solutions. Our program has reached thousands of beneficiaries across multiple regions, creating opportunities for growth, development, and empowerment. We measure our success not just in numbers, but in the lasting positive changes we help create.`,
    featured_image_id: squareImageIds[0],
    category: 'Community Development',
    status: 'published' as const,
    is_featured: idx < 3,
    order_index: idx
  }))
  
  await supabase.from('ngo_programs').insert(programsData)
  
  // Create impact stats
  const impactStats = [
    { label: 'People Helped', value: '50,000+', category: 'Community', order_index: 0, is_visible: true },
    { label: 'Programs Active', value: '12', category: 'Programs', order_index: 1, is_visible: true },
    { label: 'Countries Reached', value: '8', category: 'Global', order_index: 2, is_visible: true },
    { label: 'Years of Service', value: '15+', category: 'History', order_index: 3, is_visible: true }
  ]
  
  await supabase.from('ngo_impact_stats').insert(impactStats)
  
  // Create blog posts with detailed content
  const blogPosts = blogTitles.ngo.map((title, idx) => ({
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    title,
    excerpt: `Read about our ongoing efforts to create positive change and the impact we're making in communities around the world. Discover the stories behind our programs and the people whose lives have been transformed.`,
    content: blogContent.ngo[idx % blogContent.ngo.length] || `This article shares insights from our field work and the lessons we've learned along the way. We explore the challenges, successes, and the people whose lives have been touched by our programs. Through detailed narratives and data-driven analysis, we provide a comprehensive view of our impact and the ongoing work needed to create sustainable change.`,
    featured_image_id: squareImageIds[2],
    status: 'published' as const,
    published_at: new Date(Date.now() - idx * 7 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['impact', 'community', 'development'],
    category: 'Impact Stories',
    view_count: Math.floor(Math.random() * 500) + 50
  }))
  
  await supabase.from('ngo_blogs').insert(blogPosts)
  
  // Create team members
  const teamMembers = personNames.slice(0, 6).map((name, idx) => ({
    name,
    role: ['Executive Director', 'Program Manager', 'Field Coordinator', 'Community Outreach', 'Development Officer', 'Operations Manager'][idx],
    bio: `${name} has dedicated ${8 + idx} years to social impact work, focusing on ${['strategic development', 'program implementation', 'community engagement', 'partnership building', 'fundraising', 'operational excellence'][idx]}. Their passion for creating positive change drives our mission forward.`,
    email: `${name.toLowerCase().replace(' ', '.')}@duaf.org`,
    photo_id: squareImageIds[3],
    is_visible: true,
    order_index: idx
  }))
  
  await supabase.from('ngo_team').insert(teamMembers)
  
  // Create testimonials
  const testimonialsData = testimonials.ngo.map((testimonial, idx) => ({
    name: testimonial.name,
    role: testimonial.role,
    company: testimonial.company,
    content: testimonial.content,
    photo_id: squareImageIds[4],
    rating: testimonial.rating,
    is_featured: idx === 0,
    is_visible: true,
    order_index: idx
  }))
  
  await supabase.from('ngo_testimonials').insert(testimonialsData)
  
  // Create partners
  const partners = ngoNames.slice(0, 6).map((name, idx) => ({
    name,
    description: `Collaborative partner working together to create sustainable impact in ${['education', 'healthcare', 'environment', 'community development', 'youth programs', 'disaster relief'][idx]}.`,
    logo_id: squareImageIds[5],
    website_url: `https://${name.toLowerCase().replace(/\s+/g, '')}.org`,
    category: 'Strategic Partners',
    is_visible: true,
    order_index: idx
  }))
  
  await supabase.from('ngo_partners').insert(partners)
  
  console.log('✅ NGO data populated')
}

// Run the script
populateData().catch(console.error)

