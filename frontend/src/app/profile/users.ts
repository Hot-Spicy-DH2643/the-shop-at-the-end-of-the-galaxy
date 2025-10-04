import axios from 'axios';

export interface AsteroidType {
  id: string;
  isMyfavotire: boolean;
}
export interface UserType {
  id: string;
  name: string;
  username: string;
  email: string;
  coins: number;
  owned_asteroids: AsteroidType[];
}

export async function getUser(): Promise<UserType> {
  const baseUrl = 'http://localhost:3000';

  try {
    const response = await axios.get<UserType>(`${baseUrl}/userFakeData.json`);
    if (!response.status) throw new Error('Failed to fetch');

    const user: UserType = await response.data;

    console.log(user);

    return user;
  } catch (error) {
    throw error;
  }
}
