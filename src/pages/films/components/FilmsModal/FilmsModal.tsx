import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { api } from "@/api/api";
import { POSTERS_BY_EPISODE } from "../FilmsPosterMap";
import { API_CONFIG } from "@/api/api";

type FilmDetail = {
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: string;
  url: string;
  characters?: string[];
  planets?: string[];
  starships?: string[];
  vehicles?: string[];
  species?: string[];
  films?: string[];
};

const fetchFilm = async (id: string) => {
  const { data } = await api.get<FilmDetail>(`films/${id}/`);
  return data;
};

type Props = {
  id?: string | null;
  onClose: () => void;
};

export default function FilmsModal({ id, onClose }: Props) {
  const { data, isLoading, isError }: UseQueryResult<FilmDetail, Error> =
    useQuery({
      queryKey: ["film", id],
      queryFn: () => fetchFilm(id!),
      enabled: Boolean(id),
    staleTime: API_CONFIG.staleTime,
    });

  if (!id) return null;

  return (
    <div
      className="modal modal-open"
      role="dialog"
      aria-modal="true"
      aria-labelledby="film-modal-title"
    >
      <div className="modal-box max-w-3xl">
        <button
          type="button"
          className="btn btn-ghost btn-sm btn-circle absolute right-2 top-2"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        {isLoading && <div className="py-8">Loading…</div>}

        {isError && (
          <div className="alert alert-error">
            Error loading film details
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
                src={
                  POSTERS_BY_EPISODE[data.episode_id] ??
                  `https://placehold.co/400x600?text=${encodeURIComponent(
                    data.title
                  )}`
                }
                alt={data.title}
                className="rounded-md"
              />
            </figure>

            <div className="w-full lg:w-2/3">
              <h3 id="film-modal-title" className="text-2xl font-bold">
                {`${data.title}`}
              </h3>

              <div className="mt-3 space-y-2 text-sm">
                <p>
                  <strong>Director:</strong> {data.director}
                </p>
                <p>
                  <strong>Producer(s):</strong> {data.producer}
                </p>
                <p>
                  <strong>Release:</strong> {data.release_date}
                </p>
                <div>
                  <strong>Opening crawl:</strong>
                  <p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed">
                    {data.opening_crawl}
                  </p>
                </div>
                <p>
                  <strong>Characters:</strong> {data.characters?.length ?? 0}
                </p>
                <p>
                  <strong>Planets:</strong> {data.planets?.length ?? 0}
                </p>
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
