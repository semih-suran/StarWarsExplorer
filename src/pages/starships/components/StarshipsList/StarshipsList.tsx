import { Card } from "@/components/Card/Card";
import type { IStarship } from "@/types";

type Props = {
  data?: IStarship[];
  onView?: (id: string) => void;
};

export const StarshipsList = ({ data, onView }: Props) => {
  if (!data || data.length === 0)
    return <div className="col-span-full p-6 text-center text-sm text-muted">No results</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {data.map((s) => {
        const id = s.url.replace(/\/+$/, "").split("/").pop()!;
        return (
          <Card key={s.url} title={s.name} testId="starship-card">
            <p>Model: {s.model}</p>
            <p>Class: {s.starship_class}</p>
            <p>Manufacturer: {s.manufacturer}</p>

            <div className="mt-2">
              <button
                type="button"
                className="btn btn-xs btn-primary"
                onClick={() => onView?.(id)}
                aria-label={`View details for ${s.name}`}
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
