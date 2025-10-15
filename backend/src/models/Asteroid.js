import mongoose from 'mongoose';

const CloseApproachSchema = new mongoose.Schema(
  {
    close_approach_date: String,
    close_approach_date_full: String,
    epoch_date_close_approach: Number,
    relative_velocity: {
      kilometers_per_second: String,
      kilometers_per_hour: String,
      miles_per_hour: String,
    },
    miss_distance: {
      astronomical: String,
      lunar: String,
      kilometers: String,
      miles: String,
    },
    orbiting_body: String,
  },
  { _id: false }
);

const EstimatedDiameterSchema = new mongoose.Schema(
  {
    kilometers: {
      estimated_diameter_min: Number,
      estimated_diameter_max: Number,
    },
    meters: {
      estimated_diameter_min: Number,
      estimated_diameter_max: Number,
    },
    miles: {
      estimated_diameter_min: Number,
      estimated_diameter_max: Number,
    },
    feet: {
      estimated_diameter_min: Number,
      estimated_diameter_max: Number,
    },
  },
  { _id: false }
);

const OrbitalDataSchema = new mongoose.Schema(
  {
    orbit_id: String,
    orbit_determination_date: String,
    first_observation_date: String,
    last_observation_date: String,
    data_arc_in_days: Number,
    observations_used: Number,
    orbit_uncertainty: String,
    minimum_orbit_intersection: String,
    jupiter_tisserand_invariant: String,
    epoch_osculation: String,
    eccentricity: String,
    semi_major_axis: String,
    inclination: String,
    ascending_node_longitude: String,
    orbital_period: String,
    perihelion_distance: String,
    perihelion_argument: String,
    aphelion_distance: String,
    perihelion_time: String,
    mean_anomaly: String,
    mean_motion: String,
    equinox: String,
    orbit_class: {
      orbit_class_type: String,
      orbit_class_description: String,
      orbit_class_range: String,
    },
  },
  { _id: false }
);

const AsteroidSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    neo_reference_id: { type: String, required: true },
    name: { type: String, required: true },
    nasa_jpl_url: String,
    absolute_magnitude_h: Number,
    estimated_diameter: EstimatedDiameterSchema,
    is_potentially_hazardous_asteroid: Boolean,
    close_approach_data: [CloseApproachSchema],
    is_sentry_object: Boolean,
    orbital_data: OrbitalDataSchema,
    // Additional shop-specific fields
    price: { type: Number, default: 0 },
    size: Number,
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
AsteroidSchema.index({ neo_reference_id: 1 });
AsteroidSchema.index({ is_potentially_hazardous_asteroid: 1 });
AsteroidSchema.index({ 'close_approach_data.close_approach_date': 1 });

// Additional indexes for filtering
AsteroidSchema.index({ size: 1 });
AsteroidSchema.index({ price: 1 });
AsteroidSchema.index({ 'orbital_data.orbit_class.orbit_class_type': 1 });

export const Asteroid = mongoose.model('Asteroid', AsteroidSchema);
