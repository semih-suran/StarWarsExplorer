import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { api } from "@/api/api";
import { placeholder } from "@/utilities/placeholder";
import type { IStarship } from "@/types";

const fetchStarship = async (id: string) => {
  const { data } = await api.get<IStarship>(`starships/${id}/`);
  return data;
};

type Props = {
  id?: string | null;
  onClose: () => void;
};

export default function StarshipsModal({ id, onClose }: Props) {
  const { data, isLoading, isError }: UseQueryResult<IStarship, Error> = useQuery({
    queryKey: ["starship", id],
    queryFn: () => fetchStarship(id!),
    enabled: Boolean(id),
    staleTime: 1000 * 60,
  });

  if (!id) return null;

  return (
    <div className="modal modal-open" role="dialog" aria-modal="true" aria-labelledby="starship-modal-title">
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
            Error loading starship details
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

            <div className="w-full lg:w-2/3 space-y-1">
              <h3 id="starship-modal-title" className="text-2xl font-bold">{data.name}</h3>

              <p><strong>Model:</strong> {data.model}</p>
              <p><strong>Starship class:</strong> {data.starship_class}</p>
              <p><strong>Manufacturer:</strong> {data.manufacturer}</p>
              <p><strong>Cost (credits):</strong> {data.cost_in_credits}</p>
              <p><strong>Max atmosphering speed:</strong> {data.max_atmosphering_speed}</p>
              <p><strong>Crew:</strong> {data.crew}</p>
              <p><strong>Passengers:</strong> {data.passengers}</p>
              <p><strong>Cargo capacity:</strong> {data.cargo_capacity}</p>
              <p><strong>Consumables:</strong> {data.consumables}</p>
              <p><strong>Hyperdrive rating:</strong> {data.hyperdrive_rating}</p>
              <p><strong>MGLT:</strong> {data.MGLT}</p>
              <p><strong>Films:</strong> {data.films?.length ?? 0}</p>

              <div className="modal-action mt-4">
                <button className="btn btn-ghost" onClick={onClose}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
