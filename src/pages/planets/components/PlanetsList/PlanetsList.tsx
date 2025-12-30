import { Card } from "@/components/Card/Card";
import type { IPlanet } from "@/types";
import { getIdFromUrl } from "@/utilities/get-id-from-url";

type Props = {
  data: IPlanet[];
  onView: (id: string) => void;
};

export const PlanetsList = ({ data, onView }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((planet) => {
        const id = getIdFromUrl(planet.url);
        return (
          <Card
            key={id}
            id={id}
            title={planet.name}
            onView={onView}
            type="planets"
            image={`https://placehold.co/400x400/000000/FFFFFF?text=${planet.name}`}
          >
            <p>Terrain: {planet.terrain}</p>
            <p>Population: {planet.population}</p>
          </Card>
        );
      })}
    </div>
  );
};