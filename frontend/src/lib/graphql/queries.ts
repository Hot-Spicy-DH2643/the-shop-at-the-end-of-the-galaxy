import { gql } from '@apollo/client';

// GraphQL query to fetch asteroids with pagination
export const GET_ASTEROIDS = gql`
  query GetAsteroids($page: Int, $pageSize: Int, $filters: AsteroidFilters) {
    asteroids(page: $page, pageSize: $pageSize, filters: $filters) {
      asteroids {
        id
        neo_reference_id
        name
        owner {
          uid
          name
        }
        nasa_jpl_url
        absolute_magnitude_h
        estimated_diameter {
          kilometers {
            estimated_diameter_min
            estimated_diameter_max
          }
          meters {
            estimated_diameter_min
            estimated_diameter_max
          }
          miles {
            estimated_diameter_min
            estimated_diameter_max
          }
          feet {
            estimated_diameter_min
            estimated_diameter_max
          }
        }
        is_potentially_hazardous_asteroid
        close_approach_data {
          close_approach_date
          close_approach_date_full
          epoch_date_close_approach
          relative_velocity {
            kilometers_per_second
            kilometers_per_hour
            miles_per_hour
          }
          miss_distance {
            astronomical
            lunar
            kilometers
            miles
          }
          orbiting_body
        }
        is_sentry_object
        orbital_data {
          orbit_id
          orbit_determination_date
          first_observation_date
          last_observation_date
          data_arc_in_days
          observations_used
          orbit_uncertainty
          minimum_orbit_intersection
          jupiter_tisserand_invariant
          epoch_osculation
          eccentricity
          semi_major_axis
          inclination
          ascending_node_longitude
          orbital_period
          perihelion_distance
          perihelion_argument
          aphelion_distance
          perihelion_time
          mean_anomaly
          mean_motion
          equinox
          orbit_class {
            orbit_class_type
            orbit_class_description
            orbit_class_range
          }
        }
        price
        size
      }
      totalCount
      page
      pageSize
      totalPages
    }
  }
`;

// GraphQL query to fetch a single asteroid by ID
export const GET_ASTEROID_BY_ID = gql`
  query GetAsteroid($id: String!) {
    asteroid(id: $id) {
      id
      neo_reference_id
      name
      nasa_jpl_url
      absolute_magnitude_h
      estimated_diameter {
        kilometers {
          estimated_diameter_min
          estimated_diameter_max
        }
        meters {
          estimated_diameter_min
          estimated_diameter_max
        }
      }
      is_potentially_hazardous_asteroid
      close_approach_data {
        close_approach_date
        close_approach_date_full
        epoch_date_close_approach
        relative_velocity {
          kilometers_per_second
          kilometers_per_hour
        }
        miss_distance {
          astronomical
          kilometers
        }
        orbiting_body
      }
      is_sentry_object
      orbital_data {
        orbit_id
        eccentricity
        semi_major_axis
        inclination
        orbital_period
        orbit_class {
          orbit_class_type
          orbit_class_description
          orbit_class_range
        }
      }
      price
      size
      owner {
        uid
        name
      }
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query GetUserById($uid: String!) {
    user(uid: $uid) {
      uid
      name
      coins
      owned_asteroids {
        id
        name
        is_potentially_hazardous_asteroid
        price
        size
        close_approach_data {
          close_approach_date
          close_approach_date_full
          epoch_date_close_approach
          relative_velocity {
            kilometers_per_second
            kilometers_per_hour
          }
          miss_distance {
            astronomical
            kilometers
          }
          orbiting_body
        }
        orbital_data {
          orbit_id
          eccentricity
          semi_major_axis
          inclination
          orbital_period
          orbit_class {
            orbit_class_type
            orbit_class_description
            orbit_class_range
          }
        }
      }
      starred_asteroids {
        id
        name
        is_potentially_hazardous_asteroid
        price
        size
      }
      followers {
        uid
        name
      }
      following {
        uid
        name
      }
      cart_asteroids {
        id
        name
        price
        size
        owner {
          uid
          name
        }
      }
    }
  }
`;

export const CHECK_DAILY_CLAIM = gql`
  query CheckDailyClaim {
    checkDailyClaim {
      isAvailable
      nextClaimTime
      coinsToEarn
    }
  }
`;