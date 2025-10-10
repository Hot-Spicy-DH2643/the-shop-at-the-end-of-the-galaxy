import mongoose from 'mongoose';

const CacheMetadataSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    lastUpdated: { type: Date, required: true },
    status: {
      type: String,
      enum: ['success', 'failed', 'in_progress'],
      default: 'success',
    },
    errorMessage: String,
    recordCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const CacheMetadata = mongoose.model(
  'CacheMetadata',
  CacheMetadataSchema
);
