import { Card } from '@/components/Card/Card';
import type { IPlanet } from '@/types';

type Props = {
  data?: IPlanet[];
  onView?: (id: string) => void;
};

export const PlanetsList = ({ data, onView }: Props) => {
  if (!data || data.length === 0)
    return <div className="col-span-full p-6 text-center text-sm text-muted">No results</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {data.map((planet) => {
        const id = planet.url.replace(/\/+$/, '').split('/').pop()!;
        return (
          <Card key={planet.url} title={planet.name} testId="planet-card">
            <p>Climate: {planet.climate}</p>
            <p>Terrain: {planet.terrain}</p>
            <p>Population: {planet.population}</p>

            <div className="mt-2">
              <button
                type="button"
                className="btn btn-xs btn-primary"
                onClick={() => onView?.(id)}
                aria-label={`View details for ${planet.name}`}
              >
                View
              </button>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
