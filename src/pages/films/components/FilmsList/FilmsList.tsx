import { Card } from "@/components/Card/Card";
import type { IFilm } from "@/types";
import { POSTERS_BY_EPISODE } from "../FilmsPosterMap";

type Props = {
  data: IFilm[];
  onView?: (id: string) => void;
};

export const FilmsList = ({ data, onView }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((item) => {
        const poster =
          POSTERS_BY_EPISODE[item.episode_id] ??
          `https://placehold.co/400x600/000000/FFFFFF?text=${item.title}`;

        return (
          <Card
            key={item.url}
            id={item.url.split("/").filter(Boolean).pop()!}
            url={item.url}
            title={item.title}
            type="film"
            onView={onView}
            image={poster}
          >
            <div className="flex flex-wrap justify-center gap-2 mt-2 w-full">
              <div className="badge badge-outline">Episode {item.episode_id}</div>
              <div className="badge badge-outline">{item.release_date}</div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};