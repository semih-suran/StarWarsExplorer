import { Card } from "@/components/Card/Card";
import type { IVehicle } from "@/types";
import { getIdFromUrl } from "@/utilities/get-id-from-url";

type Props = {
  data: IVehicle[];
  onView: (id: string) => void;
};

export const VehiclesList = ({ data, onView }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((vehicle) => {
        const id = getIdFromUrl(vehicle.url);
        return (
          <Card
            key={id}
            id={id}
            title={vehicle.name}
            onView={onView}
            type="vehicles"
            image={`https://placehold.co/400x400/000000/FFFFFF?text=${vehicle.name}`}
          >
            <p>Class: {vehicle.vehicle_class}</p>
            <p>Model: {vehicle.model}</p>
          </Card>
        );
      })}
    </div>
  );
};