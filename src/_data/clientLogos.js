import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function() {
  const logosDir = path.join(__dirname, '../../public/client_logos');
  
  try {
    // Check if directory exists
    if (!fs.existsSync(logosDir)) {
      console.warn('Client logos directory not found:', logosDir);
      return [];
    }
    
    // Read all files in the directory
    const files = fs.readdirSync(logosDir);
    
    // Filter for image files and create logo objects
    const logos = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.svg', '.png', '.jpg', '.jpeg', '.webp'].includes(ext);
      })
      .map(file => {
        // Generate alt text from filename
        const nameWithoutExt = file.replace(/\.(svg|png|jpg|jpeg|webp)$/i, '');
        const altText = nameWithoutExt
          .split(/[_-]/)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
        
        return {
          filename: file,
          alt: altText,
          src: `/client_logos/${file}`
        };
      });
    
    return logos;
  } catch (error) {
    console.error('Error reading client logos:', error);
    return [];
  }
}
