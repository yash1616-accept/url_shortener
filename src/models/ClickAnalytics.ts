import mongoose from 'mongoose';

const ClickAnalyticsSchema = new mongoose.Schema({
    shortCode: { type: String, required: true, index: true },
    timestamp: { type: Date, default: Date.now },
    country: { type: String, default: 'Unknown' },
    city: { type: String, default: 'Unknown' },
    referrer: { type: String, default: 'Direct' },
    browser: { type: String, default: 'Unknown' },
    device: { type: String, default: 'Desktop' }, // Default to desktop if undefined
});

export default mongoose.models.ClickAnalytics || mongoose.model('ClickAnalytics', ClickAnalyticsSchema);
