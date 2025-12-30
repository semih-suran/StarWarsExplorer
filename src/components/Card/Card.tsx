import { useFavoritesStore, type FavoriteItem } from "@/store/useFavoritesStore";
import { cn } from "@/utilities/cn";

interface CardProps {
  id: string;
  title: string;
  image?: string;
  children?: React.ReactNode;
  onView?: (id: string) => void;
  type: FavoriteItem["type"]; 
}

export const Card = ({ id, title, image, children, onView, type }: CardProps) => {
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const liked = isFavorite(id, type);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (liked) {
      removeFavorite(id, type);
    } else {
      addFavorite({ id, name: title, type, image });
    }
  };

  return (
    <div 
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-yellow-400"
    >
      {image && (
        <figure className="px-10 pt-10">
          <img src={image} alt={title} className="rounded-xl object-cover h-48 w-full" />
        </figure>
      )}
      <div className="card-body items-center text-center">
        <h2 className="card-title text-primary">{title}</h2>
        <div className="text-sm opacity-70 mb-4">{children}</div>
        
        <div className="card-actions justify-end w-full gap-2 items-center">
           <button
            onClick={toggleFavorite}
            className={cn(
              "btn btn-circle btn-ghost btn-sm",
              liked ? "text-red-500" : "text-gray-400"
            )}
            aria-label={liked ? "Remove from favorites" : "Add to favorites"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill={liked ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>

          <button 
            className="btn btn-primary btn-sm"
            onClick={() => onView && onView(id)}
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};