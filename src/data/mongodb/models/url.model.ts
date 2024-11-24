import mongoose, { Schema } from 'mongoose';

const urlSchema = new Schema({
  name: {
    type: String,
  },
  shortId: {
    type: String,
    required: [true, 'short ID is required'],
    unique: true
  },
  originalUrl: {
    type: String,
    required: [true, 'original URL is required']
  }
});

export const UrlModel = mongoose.model('Url', urlSchema);