import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { api, API_CONFIG } from "@/api/api";
import { placeholder } from "@/utilities/placeholder";
import type { ISpecie } from "@/types";

const fetchSpecies = async (id: string) => {
  const { data } = await api.get<ISpecie>(`species/${id}/`);
  return data;
};

type Props = {
  id?: string | null;
  onClose: () => void;
};

const isPlanetObject = (v: unknown): v is { name?: string } =>
  typeof v === "object" && v !== null && "name" in v;

export const SpeciesModal = ({ id, onClose }: Props) => {
  const { data, isLoading, isError }: UseQueryResult<ISpecie, Error> = useQuery({
    queryKey: ["species", id],
    queryFn: () => fetchSpecies(id!),
    enabled: Boolean(id),
    staleTime: API_CONFIG.staleTime,
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

        {isLoading && <div className="py-8 text-center">Loading details...</div>}
        {isError && <div className="alert alert-error">Error loading species details</div>}

        {data && (
          <div className="flex flex-col lg:flex-row gap-4">
            <figure className="w-full lg:w-1/3">
              <img src={placeholder(data.name, 400)} alt={data.name} className="rounded-md object-cover" />
            </figure>
            <div className="w-full lg:w-2/3 space-y-1">
              <h3 className="text-2xl font-bold text-yellow-400">{data.name}</h3>
              <p><strong>Classification:</strong> {data.classification}</p>
              <p><strong>Designation:</strong> {data.designation}</p>
              <p><strong>Avg Height:</strong> {data.average_height}cm</p>
              <p><strong>Skin Colors:</strong> {data.skin_colors}</p>
              <p><strong>Hair Colors:</strong> {data.hair_colors}</p>
              <p><strong>Eye Colors:</strong> {data.eye_colors}</p>
              <p><strong>Avg Lifespan:</strong> {data.average_lifespan}</p>
              <p><strong>Language:</strong> {data.language}</p>
              <p>
                <strong>Homeworld:</strong>{" "}
                {isPlanetObject(data.homeworld) ? data.homeworld.name ?? "-" : data.homeworld ?? "-"}
              </p>
              
              <div className="divider my-2"></div>
              <div className="flex gap-4 text-sm opacity-70">
                <p><strong>Films:</strong> {data.films?.length ?? 0}</p>
                <p><strong>People:</strong> {data.people?.length ?? 0}</p>
              </div>

              <div className="modal-action mt-4">
                <button className="btn btn-ghost" onClick={onClose}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};