import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { api } from '@/api/api';
import { placeholder } from '@/utilities/placeholder';
import { API_CONFIG } from '@/api/api';

type PlanetDetail = {
  name: string;
  rotation_period: string;
  orbital_period: string;
  diameter: string;
  climate: string;
  gravity: string;
  terrain: string;
  surface_water: string;
  population: string;
  residents: string[];
  films: string[];
  url: string;
};

const fetchPlanet = async (id: string) => {
  const { data } = await api.get<PlanetDetail>(`planets/${id}/`);
  return data;
};

type Props = {
  id?: string | null;
  onClose: () => void;
};

export default function PlanetsModal({ id, onClose }: Props) {
  const { data, isLoading, isError }: UseQueryResult<PlanetDetail, Error> =
    useQuery({
      queryKey: ['planet', id],
      queryFn: () => fetchPlanet(id!),
      enabled: Boolean(id),
    staleTime: API_CONFIG.staleTime, // 1 minute
    });

  if (!id) return null;

  return (
    <div className="modal modal-open" role="dialog" aria-modal="true">
      <div className="modal-box max-w-3xl">
        <button
          type="button"
          className="btn btn-ghost btn-sm btn-circle absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>

        {isLoading && <div className="py-8">Loading…</div>}
        {isError && (
          <div className="alert alert-error">
            Error loading planet details
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
              <h3 className="text-2xl font-bold">{data.name}</h3>
              <p><strong>Rotation period:</strong> {data.rotation_period}</p>
              <p><strong>Orbital period:</strong> {data.orbital_period}</p>
              <p><strong>Diameter:</strong> {data.diameter}</p>
              <p><strong>Climate:</strong> {data.climate}</p>
              <p><strong>Gravity:</strong> {data.gravity}</p>
              <p><strong>Terrain:</strong> {data.terrain}</p>
              <p><strong>Surface water:</strong> {data.surface_water}</p>
              <p><strong>Population:</strong> {data.population}</p>
              <p><strong>Residents:</strong> {data.residents.length}</p>
              <p><strong>Films:</strong> {data.films.length}</p>

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
