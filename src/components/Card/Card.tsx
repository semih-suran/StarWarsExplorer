import { useFavoritesStore } from "@/store/useFavoritesStore";
import { useSelectionStore } from "@/store/useSelectionStore";
import { cn } from "@/utilities/cn";
import type { ResourceType } from "@/types";

interface CardProps {
  id: string;
  url: string;
  title: string;
  image?: string;
  children?: React.ReactNode;
  onView?: (id: string) => void;
  type: ResourceType; 
}

export const Card = ({ id, url, title, image, children, onView, type }: CardProps) => {
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const isFavorite = useFavoritesStore((s) => s.isFavorite(url));

  const toggleSelection = useSelectionStore((s) => s.toggleSelection);
  const isSelected = useSelectionStore((s) => s.selectedItems.some((i) => i.id === id));

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(url);
  };

  const handleSelectionToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    toggleSelection({ 
      id, 
      name: title, 
      type,
      url 
    });
  };

  return (
    <div 
      className={cn(
        "card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-yellow-400 relative h-full flex flex-col",
        isSelected && "ring-4 ring-warning scale-[1.02] z-10"
      )}
    >
      <div className="absolute top-4 right-4 z-20">
        <input 
          type="checkbox"
          className="checkbox checkbox-warning checkbox-lg border-2 border-warning bg-base-100/50 shadow-md backdrop-blur-sm"
          checked={isSelected}
          onChange={handleSelectionToggle}
          aria-label={`Select ${title} for comparison`}
        />
      </div>

      {image && (
        <figure className="px-10 pt-10 shrink-0">
          <img 
            src={image} 
            alt={title} 
            className="rounded-xl object-cover h-48 w-full transition-transform hover:scale-105 duration-500" 
          />
        </figure>
      )}
      
      <div className="card-body items-center text-center grow">
        <h2 
          className="card-title text-yellow-400 font-bold text-2xl w-full block truncate text-center" 
          title={title}
        >
          {title}
        </h2>
        
        <div className="text-sm opacity-70 mb-4">{children}</div>
        
        <div className="card-actions justify-end w-full gap-2 items-center mt-auto">
           <button
            onClick={handleFavoriteToggle}
            className={cn(
              "btn btn-circle btn-ghost btn-sm transition-colors",
              isFavorite ? "text-red-500" : "text-gray-400 hover:text-red-300"
            )}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          <button 
            className="btn btn-warning btn-sm px-6"
            onClick={() => onView && onView(id)}
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};