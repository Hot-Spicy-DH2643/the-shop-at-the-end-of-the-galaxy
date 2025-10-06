import { UserType } from '../users';

interface UserProps {
  user: UserType;
}

export default function User({ user }: UserProps) {
  return (
    <div className="text-white">
      <h2 className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-300 bg-clip-text text-transparent drop-shadow-lg">
        User Information
      </h2>
      <br />

      <table className="border-separate border-spacing-x-10 -ml-10 border-spacing-y-2">
        <tbody>
          <tr>
            <td className="font-bold">User ID:</td>
            <td>{user.id}</td>
          </tr>
          <tr>
            <td className="font-bold">Name:</td>
            <td>{user.name}</td>
          </tr>
          <tr>
            <td className="font-bold">Username:</td>
            <td>{user.username}</td>
          </tr>
          <tr>
            <td className="font-bold">Email:</td>
            <td>{user.email}</td>
          </tr>
          <tr>
            <td className="font-bold text-yellow-300">Conins:</td>
            <td>0</td>
          </tr>
        </tbody>
      </table>
      <button className="bg-blue-900 text-white px-6 py-2 mt-8 rounded shadow hover:bg-blue-500 transition cursor-pointer">
        Change Infomation
      </button>
    </div>
  );
}
