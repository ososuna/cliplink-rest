import mongoose, { Schema } from 'mongoose';

const urlSchema = new Schema(
  {
    name: {
      type: String,
    },
    shortId: {
      type: String,
      required: [true, 'short id is required'],
      unique: true,
    },
    originalUrl: {
      type: String,
      required: [true, 'original url is required'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true },
);

export const UrlModel = mongoose.model('Url', urlSchema);
