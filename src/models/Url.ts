import mongoose from 'mongoose';

const UrlSchema = new mongoose.Schema({
    originalUrl: { type: String, required: true },
    shortCode: { type: String, required: true, unique: true },
    clicks: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    webhookUrl: { type: String, default: null },
    gaMeasurementId: { type: String, default: null },
    gaApiSecret: { type: String, default: null },
    ownerId: { type: String, required: true, index: true }, // Added for multi-tenant isolation
});

// Prevent Mongoose from recompiling the model if it already exists
export default mongoose.models.Url || mongoose.model('Url', UrlSchema);