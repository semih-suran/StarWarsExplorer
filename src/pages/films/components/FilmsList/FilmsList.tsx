import { Card } from "@/components/Card/Card";
import { POSTERS_BY_EPISODE } from "../FilmsPosterMap";
import type { Film } from "@/types/film";
import { getIdFromUrl } from "@/utilities/get-id-from-url";

type Props = {
  data?: Film[];
  onView?: (id: string) => void;
};

export const FilmsList = ({ data, onView }: Props) => {
  if (!data || data.length === 0) {
    return (
      <div className="col-span-full p-6 text-center text-sm text-muted">
        No results
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((film) => {
        const id = getIdFromUrl(film.url);
        const poster =
          POSTERS_BY_EPISODE[film.episode_id] ??
          "https://starwars-visualguide.com/assets/img/films/placeholder.jpg";

        return (
          <Card
            key={id}
            id={id}
            title={film.title}
            onView={onView}
            type="films"
            image={poster}
          >
            <p>Director: {film.director}</p>
            <p>Release: {film.release_date}</p>
          </Card>
        );
      })}
    </div>
  );
};