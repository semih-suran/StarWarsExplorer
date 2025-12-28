import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { api } from "@/api/api";
import { placeholder } from "@/utilities/placeholder";
import type { ISpecie } from "@/types";
import { API_CONFIG } from "@/api/api";

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

export default function SpeciesModal({ id, onClose }: Props) {
  const { data, isLoading, isError }: UseQueryResult<ISpecie, Error> = useQuery(
    {
      queryKey: ["species", id],
      queryFn: () => fetchSpecies(id!),
      enabled: Boolean(id),
    staleTime: API_CONFIG.staleTime,
    }
  );

  if (!id) return null;

  return (
    <div
      className="modal modal-open"
      role="dialog"
      aria-modal="true"
      aria-labelledby="species-modal-title"
    >
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
            Error loading species details
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
              <img
                src={placeholder(data.name, 400)}
                alt={data.name}
                className="rounded-md"
              />
            </figure>

            <div className="w-full lg:w-2/3 space-y-1">
              <h3 id="species-modal-title" className="text-2xl font-bold">
                {data.name}
              </h3>

              <p>
                <strong>Classification:</strong> {data.classification}
              </p>
              <p>
                <strong>Designation:</strong> {data.designation}
              </p>
              <p>
                <strong>Average height:</strong> {data.average_height}
              </p>
              <p>
                <strong>Skin colours:</strong> {data.skin_colors}
              </p>
              <p>
                <strong>Hair colours:</strong> {data.hair_colors}
              </p>
              <p>
                <strong>Eye colours:</strong> {data.eye_colors}
              </p>
              <p>
                <strong>Average lifespan:</strong> {data.average_lifespan}
              </p>
              <p>
                <strong>Language:</strong> {data.language}
              </p>

              <p>
                <strong>Homeworld:</strong>{" "}
                {isPlanetObject(data.homeworld)
                  ? data.homeworld.name ?? "-"
                  : data.homeworld ?? "-"}
              </p>

              <p>
                <strong>People (count):</strong> {data.people?.length ?? 0}
              </p>
              <p>
                <strong>Films (count):</strong> {data.films?.length ?? 0}
              </p>

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
