export default function User() {
  return (
    <div>
      <h2 className="text-xl font-bold text-white">User</h2>
      <p className="text-white mt-2">Logged-in User Info</p>

      <button className="bg-blue-900 text-white px-4 py-3 text-sm sm:px-6 sm:py-2 sm:text-base rounded shadow hover:bg-blue-500 transition cursor-pointer mt-10">
        Change Info
      </button>
    </div>
  );
}
