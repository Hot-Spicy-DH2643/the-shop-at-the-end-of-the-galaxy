// fectching data from the server, we can replace the fetch location later
export interface UserType {
  id: string;
  name: string;
  username: string;
  email: string;
}

export async function getUser(): Promise<UserType> {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users', {
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Failed to fetch');

    const users: UserType[] = await response.json();
    const foundUser = users.find(user => user.id == '10');

    console.log(users);
    console.log(foundUser);

    if (!foundUser) {
      throw new Error('User not found');
    }

    return foundUser;
  } catch (error) {
    throw error;
  }
}
