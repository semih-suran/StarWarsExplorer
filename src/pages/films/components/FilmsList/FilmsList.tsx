import { PosterCard } from "@/components/Card/PosterCard/PosterCard";
import { POSTERS_BY_EPISODE } from "../FilmsPosterMap";
import type { Film } from "@/types/film";

type Props = {
  data?: Film[];
  onView?: (id: string) => void;
};

export const FilmsList = ({ data, onView }: Props) => {
  if (!data || data.length === 0)
    return (
      <div className="col-span-full p-6 text-center text-sm text-muted">
        No results
      </div>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {data.map((film) => {
        const id = film.url.replace(/\/+$/, "").split("/").pop()!;
        const poster =
          POSTERS_BY_EPISODE[film.episode_id] ??
          `https://placehold.co/384x220?text=${encodeURIComponent(film.title)}`;

        return (
          <PosterCard
            key={film.url}
            title={film.title}
            testId="film-card"
            imageSrc={poster}
            imageAlt={`${film.title} poster`}
          >
            <p>Director: {film.director}</p>
            <p>Release: {film.release_date}</p>
            <div className="mt-2">
              <button
                className="btn btn-xs btn-primary"
                onClick={() => onView?.(id)}
                aria-label={`View ${film.title}`}
              >
                View
              </button>
            </div>
          </PosterCard>
        );
      })}
    </div>
  );
};
