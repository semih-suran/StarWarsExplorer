import { Link } from "react-router-dom";

const CATEGORIES = [
  {
    title: "Films",
    path: "/films",
    img: "https://m.media-amazon.com/images/I/81cY-e6u0OL._SL1500_.jpg",
    description: "Explore the saga's legendary movies.",
  },
  {
    title: "People",
    path: "/people",
    img: "https://static.wikia.nocookie.net/starwars/images/1/14/Got_A_Bad_feeling.jpg",
    description: "Browse characters from the Star Wars universe.",
  },
  {
    title: "Planets",
    path: "/planets",
    img: "https://static.wikia.nocookie.net/starwars/images/4/4a/Alderaan.jpg",
    description: "Discover the worlds of the galaxy.",
  },
  {
    title: "Species",
    path: "/species",
    img: "https://static.wikia.nocookie.net/starwars/images/f/fc/WookieeWarriorsKashyyykDefenders-2025RepUnit.png",
    description: "Learn about the diverse alien species.",
  },
  {
    title: "Starships",
    path: "/starships",
    img: "https://static.wikia.nocookie.net/starwars/images/0/00/Xwing-ROOCE.png",
    description: "View the fastest ships in the galaxy.",
  },
  {
    title: "Vehicles",
    path: "/vehicles",
    img: "https://static.wikia.nocookie.net/starwars/images/2/27/Rebel_snowspeeder_SWL.png",
    description: "Check out the land and air vehicles.",
  },
];

export const Home = () => {
  return (
    <div className="container mx-auto p-4 animate-fade-in">
      <div className="text-center py-10 mb-8">
        <h1 className="text-5xl font-bold text-yellow-400 mb-4 drop-shadow-md">
          StarWars Explorer
        </h1>
        <p className="text-xl opacity-80 max-w-2xl mx-auto">
          Your ultimate guide to the galaxy far, far away. Access detailed records on
          characters, planets, starships, and more from the archives.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.title}
            to={cat.path}
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-yellow-400 cursor-pointer hover:-translate-y-1 group block"
          >
            <figure className="px-10 pt-10 overflow-hidden">
              <img
                src={cat.img}
                alt={cat.title}
                className="rounded-xl object-cover h-48 w-full group-hover:scale-105 transition-transform duration-500"
              />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title text-3xl text-yellow-400 font-bold">
                {cat.title}
              </h2>
              <p className="opacity-70 text-sm mb-4">{cat.description}</p>
              
              <div className="card-actions">
                <button className="btn btn-primary btn-sm btn-wide">
                  Explore {cat.title}
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;