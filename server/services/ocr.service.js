import Tesseract from 'tesseract.js';
import fs from 'fs';

export const extractTextFromImage = async (imagePath) => {
  try {
    const { data: { text } } = await Tesseract.recognize(
      imagePath,
      'eng', // Defaulting to English, can add 'hin' if needed
      { logger: m => console.log(m) }
    );
    
    // Clean up temporary image file after processing
    fs.unlink(imagePath, (err) => {
      if (err) console.error(`Failed to delete temporary file: ${imagePath}`, err);
    });

    return text.trim();
  } catch (error) {
    console.error('OCR Error:', error);
    
    // Clean up temporary image file on error
    if (fs.existsSync(imagePath)) {
      fs.unlink(imagePath, (err) => {
        if (err) console.error(`Failed to delete temporary file: ${imagePath}`, err);
      });
    }
    
    throw new Error('Failed to extract text from image');
  }
};
