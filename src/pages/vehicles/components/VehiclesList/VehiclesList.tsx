import { Card } from "@/components/Card/Card";
import type { IVehicle } from "@/types";

type Props = {
  data?: IVehicle[];
  onView?: (id: string) => void;
};

export const VehiclesList = ({ data, onView }: Props) => {
  if (!data || data.length === 0)
    return <div className="col-span-full p-6 text-center text-sm text-muted">No results</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {data.map((v) => {
        const id = v.url.replace(/\/+$/, "").split("/").pop()!;
        return (
          <Card key={v.url} title={v.name} testId="vehicle-card">
            <p>Model: {v.model}</p>
            <p>Class: {v.vehicle_class}</p>
            <p>Manufacturer: {v.manufacturer}</p>

            <div className="mt-2">
              <button
                type="button"
                className="btn btn-xs btn-primary"
                onClick={() => onView?.(id)}
                aria-label={`View details for ${v.name}`}
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
