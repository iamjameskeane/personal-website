import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagePath = path.join(__dirname, '../src/assets/Photos/DSCF3507.webp');

console.log(`Rotating image: ${imagePath}`);

try {
    // Rotate -90 degrees (270 degrees)
    const buffer = await sharp(imagePath)
        .rotate(-90)
        .toBuffer();

    await sharp(buffer).toFile(imagePath);
    console.log('Rotation successful!');
} catch (err) {
    console.error('Error rotating image:', err);
}
