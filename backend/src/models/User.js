import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  coins: { type: Number, default: 200 },
  owned_asteroids: { type: [String], default: [] },
  is_starred: { type: [String], default: [] },
  followers: { type: [String], default: [] },
  followings: { type: [String], default: [] },
  cart: { type: [String], default: [] },
});

export const User = mongoose.model('User', userSchema);
