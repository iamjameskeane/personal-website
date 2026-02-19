import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const photosDir = path.join(__dirname, '../src/assets/Photos');

console.log(`Scanning directory: ${photosDir}`);

try {
    const files = await fs.readdir(photosDir);
    const imageFiles = files.filter(file => /\.(jpg|jpeg|png|JPG|JPEG|PNG)$/i.test(file));

    console.log(`Found ${imageFiles.length} images to convert.`);

    for (const file of imageFiles) {
        const inputPath = path.join(photosDir, file);
        const outputPath = path.join(photosDir, `${path.parse(file).name}.webp`);

        try {
            await sharp(inputPath)
                .webp({ quality: 80 })
                .toFile(outputPath);

            console.log(`Converted: ${file} -> ${path.basename(outputPath)}`);

            // Optional: Remove original file after successful conversion
            await fs.unlink(inputPath);
            console.log(`Removed original: ${file}`);
        } catch (err) {
            console.error(`Error converting ${file}:`, err);
        }
    }

    console.log('Conversion complete!');
} catch (err) {
    console.error('Error reading directory:', err);
}
