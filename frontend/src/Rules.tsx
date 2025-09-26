import { Link } from "react-router-dom";

const Rules = () => {
  return (
    <div className="bg-black/50 w-screen h-screen flex flex-col items-center justify-center text-white">
      <h1 className="text-5xl font-bold mb-8">Rules</h1>
      <ul className="text-2xl list-disc list-inside">
        <li>Find all the chests.</li>
        <li>Unlock them with the correct codes.</li>
        <li>Collect the coins inside.</li>
        <li>The one with the most coins at the end wins.</li>
        <li>No cheating.</li>
        <li>Have fun.</li>
      </ul>
      <Link to="/main" className="mt-8 text-2xl text-yellow-400 hover:underline">Back to the game</Link>
    </div>
  );
};

export default Rules;
