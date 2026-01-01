import { Card } from "@/components/Card/Card";
import type { ISpecie } from "@/types";

type Props = {
  data: ISpecie[];
  onView: (id: string) => void;
};

export const SpeciesList = ({ data, onView }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((item) => (
        <Card
          key={item.url}
          id={item.url.split("/").filter(Boolean).pop()!}
          url={item.url}
          title={item.name}
          type="species"
          onView={onView}
          image={`https://placehold.co/400x400/000000/FFFFFF?text=${item.name}`}
        >
          <div className="flex gap-2 mt-2">
            <div className="badge badge-primary badge-outline">{item.classification}</div>
            <div className="badge badge-secondary badge-outline">{item.language}</div>
          </div>
        </Card>
      ))}
    </div>
  );
};