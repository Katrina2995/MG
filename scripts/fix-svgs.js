import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logosDir = path.join(__dirname, '../public/client_logos');

console.log('Processing SVG files to add viewBox attributes...\n');

const files = fs.readdirSync(logosDir).filter(file => file.endsWith('.svg'));

files.forEach(file => {
  const filePath = path.join(logosDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Check if viewBox already exists
  if (content.includes('viewBox=')) {
    console.log(`✓ ${file} - already has viewBox`);
    return;
  }
  
  // Try to extract width and height from SVG tag
  const svgTagMatch = content.match(/<svg[^>]*>/);
  if (!svgTagMatch) {
    console.log(`✗ ${file} - could not find SVG tag`);
    return;
  }
  
  const svgTag = svgTagMatch[0];
  const widthMatch = svgTag.match(/width=["']([^"']+)["']/);
  const heightMatch = svgTag.match(/height=["']([^"']+)["']/);
  
  if (widthMatch && heightMatch) {
    const width = parseFloat(widthMatch[1]);
    const height = parseFloat(heightMatch[1]);
    
    if (!isNaN(width) && !isNaN(height)) {
      // Add viewBox to existing SVG tag
      const newSvgTag = svgTag.replace('<svg', `<svg viewBox="0 0 ${width} ${height}"`);
      content = content.replace(svgTag, newSvgTag);
      
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`✓ ${file} - added viewBox="0 0 ${width} ${height}"`);
    } else {
      console.log(`✗ ${file} - invalid width/height values`);
    }
  } else {
    // No width/height found, add default viewBox
    const newSvgTag = svgTag.replace('<svg', `<svg viewBox="0 0 200 200"`);
    content = content.replace(svgTag, newSvgTag);
    
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`⚠ ${file} - added default viewBox="0 0 200 200" (no width/height found)`);
  }
});

console.log('\nDone! All SVG files processed.');
