import { Card } from "@/components/Card/Card";
import type { IPeople } from "@/types";

type Props = {
  data: IPeople[];
  onView: (id: string) => void;
};

export const PeopleList = ({ data, onView }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((item) => (
        <Card
          key={item.url}
          id={item.url.split("/").filter(Boolean).pop()!}
          url={item.url}
          title={item.name}
          type="person"
          onView={onView}
          image={`https://placehold.co/400x400/000000/FFFFFF?text=${item.name}`}
        >
          <div className="flex flex-wrap justify-center gap-2 mt-2 w-full">
             <div className="badge badge-outline">Gender: {item.gender}</div>
            <div className="badge badge-outline">Birth Year: {item.birth_year}</div>
          </div>
        </Card>
      ))}
    </div>
  );
};