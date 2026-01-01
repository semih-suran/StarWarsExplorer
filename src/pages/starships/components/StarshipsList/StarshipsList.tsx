import { Card } from "@/components/Card/Card";
import type { IStarship } from "@/types";

type Props = {
  data: IStarship[];
  onView: (id: string) => void;
};

export const StarshipsList = ({ data, onView }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((item) => (
        <Card
          key={item.url}
          id={item.url.split("/").filter(Boolean).pop()!}
          url={item.url}
          title={item.name}
          type="starships"
          onView={onView}
          image={`https://placehold.co/400x400/000000/FFFFFF?text=${item.name}`}
        >
          <div className="flex flex-col gap-1 mt-2">
            <div className="text-xs opacity-70">Class: {item.starship_class}</div>
            <div className="badge badge-accent badge-outline">{item.manufacturer.split(",")[0]}</div>
          </div>
        </Card>
      ))}
    </div>
  );
};