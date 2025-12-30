import { Card } from "@/components/Card/Card";
import type { IStarship } from "@/types";
import { getIdFromUrl } from "@/utilities/get-id-from-url";

type Props = {
  data: IStarship[];
  onView: (id: string) => void;
};

export const StarshipsList = ({ data, onView }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((starship) => {
        const id = getIdFromUrl(starship.url);
        return (
          <Card
            key={id}
            id={id}
            title={starship.name}
            onView={onView}
            type="starships"
            image={`https://placehold.co/400x400/000000/FFFFFF?text=${starship.name}`}
          >
            <p>Class: {starship.starship_class}</p>
            <p>Model: {starship.model}</p>
          </Card>
        );
      })}
    </div>
  );
};