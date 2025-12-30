import { Card } from "@/components/Card/Card";
import type { IPeople } from "@/types";
import { getIdFromUrl } from "@/utilities/get-id-from-url";

type Props = {
  data: IPeople[];
  onView: (id: string) => void;
};

export const PeopleList = ({ data, onView }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((person) => {
        const id = getIdFromUrl(person.url);
        return (
          <Card
            key={id}
            id={id}
            title={person.name}
            onView={onView}
            type="people"
            image={`https://placehold.co/400x400/000000/FFFFFF?text=${person.name}`}
          >
            <p>Gender: {person.gender}</p>
            <p>Birth Year: {person.birth_year}</p>
          </Card>
        );
      })}
    </div>
  );
};