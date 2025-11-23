import { Card } from "@/components/Card/Card";
import type { ISpecie } from "@/types";

type Props = {
  data?: ISpecie[];
  onView?: (id: string) => void;
};

export const SpeciesList = ({ data, onView }: Props) => {
  if (!data || data.length === 0)
    return (
      <div className="col-span-full p-6 text-center text-sm text-muted">
        No results
      </div>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {data.map((specie) => {
        const id = specie.url.replace(/\/+$/, "").split("/").pop()!;
        return (
          <Card key={specie.url} title={specie.name} testId="species-card">
            <p>Classification: {specie.classification}</p>
            <p>Designation: {specie.designation}</p>
            <p>Language: {specie.language}</p>

            <div className="mt-2">
              <button
                type="button"
                className="btn btn-xs btn-primary"
                onClick={() => onView?.(id)}
                aria-label={`View details for ${specie.name}`}
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
