import { gql } from '@apollo/client';

export const UPDATE_USER_NAME = gql`
  mutation UpdateUserName($uid: String!, $name: String!) {
    updateUserName(uid: $uid, name: $name) {
      uid
      name
    }
  }
`;

export const FOLLOW_USER = gql`
  mutation FollowUser($targetUid: String!) {
    followUser(targetUid: $targetUid)
  }
`;

export const UNFOLLOW_USER = gql`
  mutation UnfollowUser($targetUid: String!) {
    unfollowUser(targetUid: $targetUid)
  }
`;

export const TOGGLE_STARRED_ASTEROID = gql`
  mutation ToggleStarredAsteroid($asteroidId: String!) {
    toggleStarredAsteroid(asteroidId: $asteroidId)
  }
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($asteroidId: String!) {
    addToCart(asteroidId: $asteroidId)
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation removeFromCart($asteroidId: String!) {
    removeFromCart(asteroidId: $asteroidId)
  }
`;

export const CHECKOUT_CART = gql`
  mutation CheckoutCart {
    checkoutCart {
      success
      message
    }
  }
`;

export const CLAIM_DAILY_REWARD = gql`
  mutation ClaimDailyReward {
    claimDailyReward {
      success
      coinsEarned
      message
      nextClaimTime
    }
  }
`;