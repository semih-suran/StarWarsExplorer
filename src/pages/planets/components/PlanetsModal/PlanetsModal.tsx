import { useQuery, type UseQueryResult, useQueryClient } from '@tanstack/react-query';
import { api, API_CONFIG } from '@/api/api';
import { queryKeys } from "@/api/queryKeys";
import { placeholder } from '@/utilities/placeholder';
import type { IPlanet, SWAPIList } from "@/types";

type Props = {
  id?: string | null;
  onClose: () => void;
};

export const PlanetsModal = ({ id, onClose }: Props) => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError }: UseQueryResult<IPlanet, Error> =
    useQuery({
      queryKey: queryKeys.planets.detail(id!),
      queryFn: () => api.planets.get(id!),
      enabled: Boolean(id),
      staleTime: API_CONFIG.staleTime,
      placeholderData: () => {
        if (!id) return undefined;
        const listData = queryClient.getQueryData<SWAPIList<IPlanet> | IPlanet[]>(
          queryKeys.planets.all
        );
        
        let items: IPlanet[] = [];
        if (Array.isArray(listData)) {
          items = listData;
        } else if (listData) {
          items = listData.results;
        }
        
        return items.find((p) => p.url.includes(`/${id}/`));
      }
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
        {isError && (
          <div className="alert alert-error">
            <span>Error loading planet details</span>
            <button className="btn btn-xs" onClick={onClose}>Close</button>
          </div>
        )}

        {data && (
          <div className="flex flex-col lg:flex-row gap-4">
            <figure className="w-full lg:w-1/3">
              <img src={placeholder(data.name, 400)} alt={data.name} className="rounded-md object-cover" />
            </figure>
            <div className="w-full lg:w-2/3 space-y-1">
              <h3 className="text-2xl font-bold text-yellow-400">{data.name}</h3>
              <p><strong>Rotation:</strong> {data.rotation_period} hours</p>
              <p><strong>Orbit:</strong> {data.orbital_period} days</p>
              <p><strong>Diameter:</strong> {data.diameter} km</p>
              <p><strong>Climate:</strong> {data.climate}</p>
              <p><strong>Gravity:</strong> {data.gravity}</p>
              <p><strong>Terrain:</strong> {data.terrain}</p>
              <p><strong>Surface Water:</strong> {data.surface_water}%</p>
              <p><strong>Population:</strong> {data.population}</p>
              
              <div className="divider my-2"></div>
              <div className="flex gap-4 text-sm opacity-70">
                <p><strong>Films: </strong> {data.films.length ?? 0}</p>
                <p><strong>Residents: </strong> {data.residents.length ?? 0}</p>
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