import mongoose, { Schema } from 'mongoose';

const resetPasswordTokenSchema = new Schema({
  token: {
    type: String,
    required: [true, 'token is required'],
    unique: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'user is required'],
  },
  active: {
    type: Boolean,
    required: true,
    default: true
  },
  expiresAt: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

export const ResetPasswordTokenModel = mongoose.model('ResetPasswordToken', resetPasswordTokenSchema);