/**
 * Utility to dynamically load client logo images and metadata
 */

export interface LogoMetadata {
  filename: string;
  alt: string;
  imageUrl: string;
  linkUrl?: string;
}

/**
 * Generate alt text from filename
 * Example: "acme_corp.svg" -> "Acme Corp"
 */
export function generateAltText(filename: string): string {
  const nameWithoutExt = filename.replace(/\.(png|jpg|jpeg|svg|webp)$/i, '');
  const words = nameWithoutExt
    .split(/[_-]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
  return words.join(' ');
}

/**
 * Load all client logos from the public/client_logos directory
 * Uses a static list of known logo filenames
 */
export async function getClientLogos(): Promise<LogoMetadata[]> {
  try {
    // In Vite, files in the public directory are served at the root
    // We'll use a static list of logos for now (you can expand this)
    const logoFilenames = [
      'acme_corp.svg',
      'tech_solutions.svg',
      'global_industries.svg',
      'innovation_labs.svg',
      'mega_systems.svg',
      'prime_group.svg'
    ];

    const logos: LogoMetadata[] = [];
    const linkUrls: Record<string, string> = {};
    
    // Load optional link metadata first
    try {
      const linksData = await import('@/data/client_logo_links.json');
      Object.assign(linkUrls, linksData.default);
    } catch {
      // Links file is optional
    }
    
    // Create logo metadata for each file
    for (const filename of logoFilenames) {
      const imageUrl = `/client_logos/${filename}`;
      
      logos.push({
        filename,
        alt: generateAltText(filename),
        imageUrl,
        linkUrl: linkUrls[filename]
      });
    }

    return logos;
  } catch (error) {
    console.warn('Failed to load client logos:', error);
    return [];
  }
}
