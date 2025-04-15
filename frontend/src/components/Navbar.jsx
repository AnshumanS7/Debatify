import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow p-4 flex justify-between">
      <h1 className="font-bold text-xl text-indigo-600">Debatify</h1>
      <div className="space-x-4">
        <Link to="/" className="text-gray-700 hover:text-indigo-500">Home</Link>
        <Link to="/quiz" className="text-gray-700 hover:text-indigo-500">Quiz</Link>
        <Link to="/debate" className="text-gray-700 hover:text-indigo-500">Debate Room</Link>
      </div>
    </nav>
  );
};

export default Navbar;
