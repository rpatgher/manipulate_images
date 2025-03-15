// file: optimized_image_processor.js

const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');

/**
 * Procesa y optimiza imágenes en un directorio, aplicando:
 * - Redimensionamiento a 500px de ancho.
 * - Optimización de calidad para formatos JPEG, PNG, WebP y AVIF.
 * 
 * @param {string} inputDir - Directorio donde están las imágenes originales.
 * @param {string} outputDir - Directorio donde se guardarán las imágenes procesadas.
 */
async function processAndOptimizeImages(inputDir, outputDir) {
    try {
        // Crear directorio de salida si no existe
        await fs.ensureDir(outputDir);

        // Leer archivos del directorio de entrada
        const files = await fs.readdir(inputDir);

        // Filtrar solo imágenes válidas
        const validExtensions = ['.png', '.jpg', '.jpeg'];
        const imageFiles = files.filter(file => 
            validExtensions.includes(path.extname(file).toLowerCase())
        );

        let totalImages = 0;

        for (const file of imageFiles) {
            const filePath = path.join(inputDir, file);
            const fileName = path.parse(file).name;

            // Crear salida base para las imágenes procesadas
            const outputBase = path.join(outputDir, fileName);

            // Redimensionar y optimizar para cada formato
            // Redimensionar y guardar como JPEG optimizado
            const resizedJPEG = `${outputBase}.jpg`;
            await sharp(filePath)
                .resize({ width: 1080 })
                .jpeg({
                    quality: 85, // Alta calidad con buen nivel de compresión
                    mozjpeg: true // Usa el optimizador MozJPEG
                })
                .toFile(resizedJPEG);

            // Redimensionar y guardar como PNG optimizado
            const resizedPNG = `${outputBase}.png`;
            await sharp(filePath)
                .resize({ width: 1080 })
                .png({
                    compressionLevel: 9, // Máxima compresión sin pérdida
                    adaptiveFiltering: true // Mejorar calidad visual
                })
                .toFile(resizedPNG);

            // Redimensionar y guardar como WebP optimizado
            const resizedWebP = `${outputBase}.webp`;
            await sharp(filePath)
                .resize({ width: 1080 })
                .webp({
                    quality: 85, // Alta calidad
                    effort: 6 // Nivel de esfuerzo de compresión (0-6)
                })
                .toFile(resizedWebP);

            // Redimensionar y guardar como AVIF optimizado
            const resizedAVIF = `${outputBase}.avif`;
            await sharp(filePath)
                .resize({ width: 1080 })
                .avif({
                    quality: 50, // Alta eficiencia sin pérdida perceptible
                    effort: 4 // Nivel de esfuerzo de compresión (0-6)
                })
                .toFile(resizedAVIF);

            console.log(`Procesado y optimizado: ${file}`);
            totalImages++;
        }

        console.log(`${totalImages} imágenes han sido procesadas y optimizadas.`);
    } catch (error) {
        console.error('Error procesando imágenes:', error);
    }
}


// Ejemplo de uso
// const inputDir = '/Users/remypatgher/Desktop/marea_cozumel/marea_cozumel/src/assets/img/apartments/Type_D'; // Cambiar al directorio de entrada
// const outputDir = '/Users/remypatgher/Desktop/marea_cozumel/marea_cozumel/public/img/apartments/Type_D'; // Cambiar al directorio de salida
const inputDir = './img'; // Cambiar al directorio de entrada
const outputDir = './optimized_img'; // Cambiar al directorio de salida
processAndOptimizeImages(inputDir, outputDir);
