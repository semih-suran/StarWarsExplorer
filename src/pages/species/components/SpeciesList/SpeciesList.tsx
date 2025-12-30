import { Card } from "@/components/Card/Card";
import type { ISpecie } from "@/types";
import { getIdFromUrl } from "@/utilities/get-id-from-url";

type Props = {
  data: ISpecie[];
  onView: (id: string) => void;
};

export const SpeciesList = ({ data, onView }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((specie) => {
        const id = getIdFromUrl(specie.url);
        return (
          <Card
            key={id}
            id={id}
            title={specie.name}
            onView={onView}
            type="species"
            image={`https://placehold.co/400x400/000000/FFFFFF?text=${specie.name}`}
          >
            <p>Classification: {specie.classification}</p>
            <p>Designation: {specie.designation}</p>
          </Card>
        );
      })}
    </div>
  );
};