import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { api } from "@/api/api";
import { placeholder } from "@/utilities/placeholder";

type PersonDetail = {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  films: string[];
  species: string[];
  vehicles: string[];
  starships: string[];
  url: string;
};

const fetchPerson = async (id: string) => {
  const { data } = await api.get<PersonDetail>(`/people/${id}/`);
  return data;
};

type Props = {
  id?: string | null;
  onClose: () => void;
};

export default function PeopleModal({ id, onClose }: Props) {
  const { data, isLoading, isError }: UseQueryResult<PersonDetail, Error> =
    useQuery({
      queryKey: ["person", id],
      queryFn: () => fetchPerson(id!),
      enabled: Boolean(id),
      staleTime: 1000 * 60,
    });

  if (!id) return null;

  return (
    <div className="modal modal-open" role="dialog" aria-modal="true" aria-labelledby="person-modal-title">
      <div className="modal-box max-w-3xl">
        <button
          type="button"
          className="btn btn-ghost btn-sm btn-circle absolute right-2 top-2"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        {isLoading && <div className="py-8">Loading…</div>}
        {isError && (
          <div className="alert alert-error">
            Error loading person details
            <div className="mt-2">
              <button className="btn btn-xs" onClick={() => onClose()}>
                Close
              </button>
            </div>
          </div>
        )}

        {data && (
          <div className="flex flex-col lg:flex-row gap-4">
            <figure className="w-full lg:w-1/3">
              <img src={placeholder(data.name, 400)} alt={data.name} className="rounded-md" />
            </figure>
            <div className="w-full lg:w-2/3">
              <h3 id="person-modal-title" className="text-2xl font-bold">{data.name}</h3>
              <div className="mt-2 space-y-1">
                <p><strong>Gender:</strong> {data.gender}</p>
                <p><strong>Birth year:</strong> {data.birth_year}</p>
                <p><strong>Height:</strong> {data.height} cm</p>
                <p><strong>Mass:</strong> {data.mass} kg</p>
                <p><strong>Hair colour:</strong> {data.hair_color}</p>
                <p><strong>Skin colour:</strong> {data.skin_color}</p>
                <p><strong>Eye colour:</strong> {data.eye_color}</p>
                <p><strong>Homeworld:</strong> {data.homeworld}</p>
                <p><strong>Films:</strong> {data.films.length}</p>
                <p><strong>Species:</strong> {data.species.length}</p>
                <p><strong>Vehicles:</strong> {data.vehicles.length}</p>
                <p><strong>Starships:</strong> {data.starships.length}</p>
              </div>

              <div className="modal-action mt-4">
                <button className="btn btn-ghost" onClick={onClose}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
