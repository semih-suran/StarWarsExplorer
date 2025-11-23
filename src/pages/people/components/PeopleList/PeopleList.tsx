import { Card } from "@/components/Card/Card";
import type { IPeople } from "@/types";

type Props = {
  data?: IPeople[];
  onView?: (id: string) => void;
};

export const PeopleList = ({ data, onView }: Props) => {
  if (!data || data.length === 0)
    return (
      <div className="col-span-full p-6 text-center text-sm text-muted">
        No results
      </div>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {data.map((person) => {
        const id = person.url.replace(/\/+$/, "").split("/").pop()!;
        return (
          <Card key={person.url} title={person.name} testId="person-card">
            <p>Height: {person.height}</p>
            <p>Mass: {person.mass}</p>
            <p>Gender: {person.gender}</p>
            <p>Birth Year: {person.birth_year}</p>

            <div className="mt-2">
              <button
                type="button"
                className="btn btn-xs btn-primary"
                onClick={() => onView?.(id)}
                aria-label={`View details for ${person.name}`}
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
