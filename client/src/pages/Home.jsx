import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import bgImage from "../assets/mainworldpic.webp";

function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-center px-6">
     
      <img
        src={bgImage}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover -z-10 brightness-75"
      />

      <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mt-8">
        Welcome to LOC SHARE 
      </h1>

      <p className="mt-6 max-w-2xl bg-slate-200/80 text-gray-800 rounded-lg p-4 shadow-md">
        Start sharing your live location and instantly generate a link. 
        Anyone with the link can track your location in real-time.
      </p>

      <div className="mt-12">
        <Link
          to="/share"
          className="flex items-center gap-3 px-6 py-3 rounded-lg border-2 bg-slate-500 hover:bg-slate-600 text-white font-bold shadow-md transition-all"
        >
          Start Sharing
          <FaArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
}

export default Home;
