import mongoose from 'mongoose';

const friendSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  name: { type: String, required: true },
});

const userAsteroidSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  is_potentially_hazardous_asteroid: { type: Boolean, required: true },
  price: { type: Number, required: true },
  size: { type: Number, required: true },
});

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  coins: { type: Number, default: 200 },
  owned_asteroids: { type: [userAsteroidSchema], default: [] },
  starred_asteroids: { type: [userAsteroidSchema], default: [] },
  followers: { type: [friendSchema], default: [] },
  following: { type: [friendSchema], default: [] },
  cart_asteroids: { type: [userAsteroidSchema], default: [] },
});

export const User = mongoose.model('User', userSchema);
