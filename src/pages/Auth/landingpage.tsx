import { Link } from "react-router-dom";
import {
  TwitterIcon,
  YoutubeIcon,
  GithubIcon,
  SlackIcon,
  DiscordIcon
} from "../../Icons/IconsImport";

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="flex justify-between items-center p-6 bg-white shadow">
        <div className="text-2xl font-bold text-purple-600">Brainly</div>
        <div className="flex space-x-4">
          <Link to="/login" className="text-gray-600 hover:text-purple-600">
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center p-6 justify-center text-center">
        <h1 className="text-4xl font-bold text-gray-800 ">Welcome to Brainly</h1>
        <p className="mt-3 text-gray-600 max-w-2xl">
          Organize your links, share ideas, and build your digital brain. Never
          lose a thought again.
        </p>

        <div className="mt-8 overflow-hidden w-full">
          <div className="flex animate-slide space-x-8 justify-center">
            <TwitterIcon />
            <YoutubeIcon />
            <GithubIcon/>
            <DiscordIcon/>
            <SlackIcon/>
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 text-gray-600 p-4 text-center">
        &copy; {new Date().getFullYear()} Brainly. All Rights Reserved.
      </footer>
    </div>
  );
}
