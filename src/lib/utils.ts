import crypto from 'crypto';
import mongoose from 'mongoose';

const BASE62 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/**
 * Generates a random Base62 string of the specified length.
 */
export function generateShortCode(length: number = 6): string {
    let result = '';
    const randomBytes = crypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
        result += BASE62[randomBytes[i] % 62];
    }
    return result;
}

/**
 * Validates if the provided string is a syntactically correct URL 
 * using standard web protocols (http or https).
 */
export function isValidUrl(urlString: string): boolean {
    try {
        const url = new URL(urlString);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (e) {
        return false;
    }
}

/**
 * Generates a unique short code, retrying if a collision occurs.
 * @param model - The Mongoose model to query against for uniqueness
 * @param length - The length of the short code to generate
 * @param maxRetries - Maximum number of attempts before failing
 */
export async function generateUniqueShortCode(
    model: mongoose.Model<any>, 
    length: number = 6, 
    maxRetries: number = 5
): Promise<string> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        const shortCode = generateShortCode(length);
        
        // Check if the short code already exists in the database
        const existing = await model.findOne({ shortCode }).select('_id').lean();
        
        if (!existing) {
            return shortCode; // Found a unique one!
        }
        
        // Collision detected, loop will continue to retry
    }
    
    throw new Error('Failed to generate a unique short code after maximum retries. Consider increasing the code length.');
}
