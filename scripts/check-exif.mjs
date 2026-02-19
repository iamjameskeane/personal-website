import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagePath = path.join(__dirname, '../src/assets/Photos/DSCF1200.webp');

try {
    const metadata = await sharp(imagePath).metadata();
    console.log('Metadata keys:', Object.keys(metadata));
    if (metadata.exif) {
        console.log('EXIF data present:', true);
        console.log('EXIF size:', metadata.exif.length);
    } else {
        console.log('EXIF data present:', false);
    }
} catch (err) {
    console.error('Error reading metadata:', err);
}
