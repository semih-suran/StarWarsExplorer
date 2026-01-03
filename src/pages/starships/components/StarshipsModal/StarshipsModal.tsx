import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { api, API_CONFIG } from "@/api/api";
import { placeholder } from "@/utilities/placeholder";
import type { IStarship } from "@/types";

const fetchStarship = async (id: string) => {
  const { data } = await api.get<IStarship>(`/starships/${id}/`);
  return data;
};

type Props = {
  id?: string | null;
  onClose: () => void;
};

export const StarshipsModal = ({ id, onClose }: Props) => {
  const { data, isLoading, isError }: UseQueryResult<IStarship, Error> = useQuery({
    queryKey: ["starship", id],
    queryFn: () => fetchStarship(id!),
    enabled: Boolean(id),
    staleTime: API_CONFIG.staleTime,
  });

  if (!id) return null;

  return (
    <div className="modal modal-open" role="dialog" aria-modal="true">
      <div className="modal-box max-w-3xl relative">
        <button
          type="button"
          className="btn btn-ghost btn-sm btn-circle absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>

        {isLoading && <div className="py-8 text-center">Loading details...</div>}
        {isError && <div className="alert alert-error">Error loading starship details</div>}

        {data && (
          <div className="flex flex-col lg:flex-row gap-4">
            <figure className="w-full lg:w-1/3">
              <img src={placeholder(data.name, 400)} alt={data.name} className="rounded-md object-cover" />
            </figure>
            <div className="w-full lg:w-2/3 space-y-1">
              <h3 className="text-2xl font-bold text-yellow-400">{data.name}</h3>
              <p><strong>Model:</strong> {data.model}</p>
              <p><strong>Class:</strong> {data.starship_class}</p>
              <p><strong>Manufacturer:</strong> {data.manufacturer}</p>
              <p><strong>Cost:</strong> {data.cost_in_credits} credits</p>
              <p><strong>Max Speed:</strong> {data.max_atmosphering_speed}</p>
              <p><strong>Crew:</strong> {data.crew}</p>
              <p><strong>Cargo Capacity:</strong> {data.cargo_capacity}</p>
              <p><strong>Consumables:</strong> {data.consumables}</p>
              <p><strong>Hyperdrive:</strong> {data.hyperdrive_rating}</p>
              <p><strong>MGLT:</strong> {data.MGLT}</p>

              <div className="divider my-2"></div>
              <div className="flex gap-4 text-sm opacity-70">
                <p><strong>Films:</strong> {data.films?.length ?? 0}</p>
                <p><strong>Passengers:</strong> {data.passengers ?? 0}</p>
              </div>
              <div className="modal-action mt-4">
                <button className="btn btn-ghost" onClick={onClose}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};