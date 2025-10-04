import axios from 'axios';
export interface UserType {
  id: string;
  name: string;
  username: string;
  email: string;
  coins: number;
  owned_astroids: [string];
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
