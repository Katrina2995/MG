import { db } from "./db";
import { users, posts, tags, postTags } from "@shared/schema";
import { hashPassword } from "./auth";
import { sql } from "drizzle-orm";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Clear existing data
    console.log("Clearing existing data...");
    await db.delete(postTags);
    await db.delete(posts);
    await db.delete(tags);
    await db.delete(users);

    // Create users
    console.log("Creating users...");
    const [author, editor, admin] = await db.insert(users).values([
      {
        username: "john_author",
        email: "author@millergroup.com",
        passwordHash: await hashPassword("password123"),
        role: "AUTHOR" as const,
        bio: "Professional investigator and security consultant with 10+ years of experience.",
        isVerified: true,
      },
      {
        username: "sarah_editor",
        email: "editor@millergroup.com",
        passwordHash: await hashPassword("password123"),
        role: "EDITOR" as const,
        bio: "Senior editor with expertise in investigative journalism and content curation.",
        isVerified: true,
      },
      {
        username: "admin",
        email: "admin@millergroup.com",
        passwordHash: await hashPassword("admin123"),
        role: "ADMIN" as const,
        bio: "System administrator and blog manager.",
        isVerified: true,
      },
    ]).returning();

    console.log(`Created ${3} users`);

    // Create tags
    console.log("Creating tags...");
    const tagData = [
      { name: "Investigation", slug: "investigation" },
      { name: "Security", slug: "security" },
      { name: "Surveillance", slug: "surveillance" },
      { name: "Background Checks", slug: "background-checks" },
      { name: "Process Serving", slug: "process-serving" },
      { name: "Case Studies", slug: "case-studies" },
    ];

    const createdTags = await db.insert(tags).values(tagData).returning();
    console.log(`Created ${createdTags.length} tags`);

    // Create posts
    console.log("Creating posts...");
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const postData = [
      {
        title: "Modern Surveillance Techniques in Private Investigation",
        slug: "modern-surveillance-techniques",
        summary: "Explore the latest surveillance methods used in professional investigations, from GPS tracking to digital forensics.",
        content: `# Modern Surveillance Techniques in Private Investigation

In today's digital age, private investigation has evolved far beyond following suspects in unmarked vehicles. Modern investigators leverage cutting-edge technology to gather evidence efficiently and ethically.

## Digital Forensics

Digital forensics plays a crucial role in modern investigations. Investigators now examine:

- Computer hard drives and storage devices
- Mobile phone data and communications
- Social media activity and digital footprints
- Cloud storage and online accounts

## GPS Tracking

GPS tracking has revolutionized surveillance operations, allowing investigators to:

1. Monitor vehicle movements in real-time
2. Establish patterns of behavior
3. Provide verifiable location data
4. Reduce the need for physical surveillance

## Ethical Considerations

While technology provides powerful tools, professional investigators must always operate within legal boundaries and maintain the highest ethical standards.

*For professional investigation services, contact MILLERGROUP Intelligence.*`,
        htmlContent: `<h1>Modern Surveillance Techniques in Private Investigation</h1><p>In today's digital age, private investigation has evolved far beyond following suspects in unmarked vehicles...</p>`,
        status: "PUBLISHED" as const,
        authorId: author!.id,
        publishedAt: lastWeek,
        metaTitle: "Modern Surveillance Techniques | MILLERGROUP Intelligence",
        metaDescription: "Explore the latest surveillance methods used in professional investigations, from GPS tracking to digital forensics.",
        featuredImage: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=1200",
      },
      {
        title: "The Importance of Background Checks in Hiring",
        slug: "background-checks-hiring",
        summary: "Learn why comprehensive background checks are essential for making informed hiring decisions and protecting your business.",
        content: `# The Importance of Background Checks in Hiring

Hiring the wrong person can be costly for any organization. Comprehensive background checks help employers make informed decisions and protect their business interests.

## Why Background Checks Matter

### Risk Mitigation
- Verify credentials and work history
- Identify potential red flags
- Protect company assets

### Legal Compliance
- Meet industry-specific requirements
- Reduce liability exposure
- Ensure workplace safety

## What to Include

A thorough background check should cover:

1. **Criminal History** - County, state, and federal records
2. **Employment Verification** - Confirm previous positions and performance
3. **Education Verification** - Validate degrees and certifications
4. **Professional References** - Gather insights from past colleagues

## Professional Services

MILLERGROUP Intelligence provides comprehensive background screening services tailored to your specific needs.`,
        htmlContent: `<h1>The Importance of Background Checks in Hiring</h1><p>Hiring the wrong person can be costly for any organization...</p>`,
        status: "PUBLISHED" as const,
        authorId: author!.id,
        publishedAt: yesterday,
        metaTitle: "Background Checks in Hiring | MILLERGROUP Intelligence",
        metaDescription: "Learn why comprehensive background checks are essential for making informed hiring decisions and protecting your business.",
      },
      {
        title: "Process Serving: What You Need to Know",
        slug: "process-serving-guide",
        summary: "A comprehensive guide to process serving, including legal requirements, best practices, and common challenges.",
        content: `# Process Serving: What You Need to Know

Process serving is a critical component of the legal system, ensuring that individuals receive proper notification of legal proceedings.

## Legal Requirements

Process servers must adhere to strict legal guidelines:

- Serve documents to the correct party
- Follow state and local regulations
- Provide proof of service
- Maintain professional conduct

## Common Challenges

### Evasive Recipients
Some individuals actively avoid service. Professional process servers use skip tracing and surveillance techniques to locate and serve difficult recipients.

### Time Constraints
Legal deadlines require efficient service. Experienced process servers plan routes carefully and work flexible hours.

## Professional Advantage

MILLERGROUP Intelligence's certified process servers have extensive experience handling even the most challenging service assignments throughout Park City and Summit County.`,
        htmlContent: `<h1>Process Serving: What You Need to Know</h1><p>Process serving is a critical component of the legal system...</p>`,
        status: "PUBLISHED" as const,
        authorId: editor!.id,
        publishedAt: now,
        metaTitle: "Process Serving Guide | MILLERGROUP Intelligence",
        metaDescription: "A comprehensive guide to process serving, including legal requirements, best practices, and common challenges.",
      },
      {
        title: "Infidelity Investigations: Approach with Care",
        slug: "infidelity-investigations-guide",
        summary: "Understanding the sensitive nature of infidelity investigations and how professional investigators handle these delicate cases.",
        content: `# Infidelity Investigations: Approach with Care

Suspecting a partner of infidelity is emotionally challenging. Professional investigators provide clarity while maintaining discretion and empathy.

## Signs to Watch For

Common indicators that may warrant investigation:

- Unexplained absences or changes in schedule
- Secretive phone or computer use
- Emotional distance or behavioral changes
- Unusual expenses or financial discrepancies

## Investigation Process

### Consultation
We begin with a confidential consultation to understand your concerns and establish investigation goals.

### Surveillance
Discreet surveillance to document activities and gather evidence.

### Documentation
Comprehensive reporting with photographic or video evidence when applicable.

## Emotional Support

We understand the emotional toll these situations take. Our team approaches every case with compassion and professionalism.

*Contact MILLERGROUP Intelligence for a confidential consultation.*`,
        htmlContent: `<h1>Infidelity Investigations: Approach with Care</h1><p>Suspecting a partner of infidelity is emotionally challenging...</p>`,
        status: "REVIEW" as const,
        authorId: author!.id,
      },
      {
        title: "Corporate Security: Protecting Your Business Assets",
        slug: "corporate-security-guide",
        summary: "Essential security measures every business should implement to protect assets, data, and personnel.",
        content: `# Corporate Security: Protecting Your Business Assets

In an era of increasing security threats, businesses must take proactive measures to protect their assets, data, and personnel.

## Risk Assessment

Begin with a comprehensive security assessment:

- Identify vulnerabilities
- Evaluate current security measures
- Assess potential threats
- Develop mitigation strategies

## Key Security Measures

### Physical Security
- Access control systems
- Surveillance cameras
- Security personnel
- Secure storage facilities

### Digital Security
- Network security protocols
- Data encryption
- Employee training
- Incident response plans

### Personnel Security
- Background screening
- Security awareness training
- Visitor management
- Emergency procedures

## Ongoing Protection

Security is not a one-time effort. Regular audits and updates ensure continued protection against evolving threats.`,
        htmlContent: `<h1>Corporate Security: Protecting Your Business Assets</h1><p>In an era of increasing security threats...</p>`,
        status: "DRAFT" as const,
        authorId: editor!.id,
      },
    ];

    const createdPosts = await db.insert(posts).values(postData).returning();
    console.log(`Created ${createdPosts.length} posts`);

    // Associate tags with posts
    console.log("Associating tags with posts...");
    const postTagAssociations = [
      // Post 1: Modern Surveillance Techniques
      { postId: createdPosts[0].id, tagId: createdTags[0].id }, // Investigation
      { postId: createdPosts[0].id, tagId: createdTags[2].id }, // Surveillance
      
      // Post 2: Background Checks
      { postId: createdPosts[1].id, tagId: createdTags[3].id }, // Background Checks
      { postId: createdPosts[1].id, tagId: createdTags[1].id }, // Security
      
      // Post 3: Process Serving
      { postId: createdPosts[2].id, tagId: createdTags[4].id }, // Process Serving
      
      // Post 4: Infidelity Investigations
      { postId: createdPosts[3].id, tagId: createdTags[0].id }, // Investigation
      { postId: createdPosts[3].id, tagId: createdTags[5].id }, // Case Studies
      
      // Post 5: Corporate Security
      { postId: createdPosts[4].id, tagId: createdTags[1].id }, // Security
      { postId: createdPosts[4].id, tagId: createdTags[3].id }, // Background Checks
    ];

    await db.insert(postTags).values(postTagAssociations);
    console.log(`Created ${postTagAssociations.length} tag associations`);

    console.log("✅ Seeding completed successfully!");
    console.log("\nTest Accounts:");
    console.log("- Author: author@millergroup.com / password123");
    console.log("- Editor: editor@millergroup.com / password123");
    console.log("- Admin: admin@millergroup.com / admin123");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
