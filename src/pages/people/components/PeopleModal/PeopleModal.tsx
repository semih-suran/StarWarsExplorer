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
  const { data } = await api.get<PersonDetail>(`/people/${id}`);
  return data;
};

type Props = {
  id?: string | null;
  onClose: () => void;
};

export const PeopleModal = ({ id, onClose }: Props) => {
  const { data, isLoading, isError }: UseQueryResult<PersonDetail, Error> =
    useQuery({
      queryKey: ["person", id],
      queryFn: () => fetchPerson(id!),
      enabled: Boolean(id),
      staleTime: 1000 * 60,
    });

  if (!id) return null;

  return (
    <div
      className="modal modal-open"
      role="dialog"
      aria-modal="true"
      aria-labelledby="person-modal-title"
    >
      <div className="modal-box max-w-3xl relative">
        <button
          type="button"
          className="btn btn-ghost btn-sm btn-circle absolute right-2 top-2"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        {isLoading && (
          <div className="py-8 text-center">Loading details...</div>
        )}

        {isError && (
          <div className="alert alert-error">
            <span>Error loading person details.</span>
            <button className="btn btn-xs" onClick={onClose}>
              Close
            </button>
          </div>
        )}

        {data && (
          <div className="flex flex-col lg:flex-row gap-6">
            <figure className="w-full lg:w-1/3 flex-shrink-0">
              <img
                src={placeholder(data.name, 400)}
                alt={data.name}
                className="rounded-xl shadow-lg w-full h-auto object-cover"
              />
            </figure>

            <div className="w-full lg:w-2/3">
              <h3 id="person-modal-title" className="text-3xl font-bold mb-4">
                {data.name}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <p>
                  <span className="font-semibold opacity-70">Gender:</span>{" "}
                  {data.gender}
                </p>
                <p>
                  <span className="font-semibold opacity-70">Birth Year:</span>{" "}
                  {data.birth_year}
                </p>
                <p>
                  <span className="font-semibold opacity-70">Height:</span>{" "}
                  {data.height} cm
                </p>
                <p>
                  <span className="font-semibold opacity-70">Mass:</span>{" "}
                  {data.mass} kg
                </p>
                <p>
                  <span className="font-semibold opacity-70">Hair Color:</span>{" "}
                  {data.hair_color}
                </p>
                <p>
                  <span className="font-semibold opacity-70">Skin Color:</span>{" "}
                  {data.skin_color}
                </p>
                <p>
                  <span className="font-semibold opacity-70">Eye Color:</span>{" "}
                  {data.eye_color}
                </p>
              </div>
              
              <div className="divider my-2"></div>
              <div className="flex gap-4 text-sm opacity-70">
                <p><strong>Films:</strong> {data.films.length ?? 0}</p>
                <p><strong>Vehicles:</strong> {data.vehicles.length ?? 0}</p>
                <p><strong>Starships:</strong> {data.starships.length ?? 0}</p>
              </div>

              <div className="modal-action mt-6">
                <button className="btn" onClick={onClose}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};
