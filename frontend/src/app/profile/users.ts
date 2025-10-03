import axios from 'axios';

// fectching data from the server, we can replace the fetch location later
export interface UserType {
  id: string;
  name: string;
  username: string;
  email: string;
  coins: number;
  owned_astroids: [string];
}

export async function getUser(): Promise<UserType> {
  try {
    const response = await axios.get<UserType>('/userFakeData.json');
    if (!response.status) throw new Error('Failed to fetch');

    const user: UserType = await response.data;

    console.log(user);

    return user;
  } catch (error) {
    throw error;
  }
}
