import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  coins: { type: Number, default: 1000 },
  owned_asteroid_ids: { type: [String], default: [] },
  starred_asteroid_ids: { type: [String], default: [] },
  follower_ids: { type: [String], default: [] },
  following_ids: { type: [String], default: [] },
  cart_asteroid_ids: { type: [String], default: [] },
});

export const User = mongoose.model('User', userSchema);
