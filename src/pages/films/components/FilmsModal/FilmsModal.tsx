import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { api, API_CONFIG } from "@/api/api";
import { POSTERS_BY_EPISODE } from "../FilmsPosterMap";

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
  const { data } = await api.get<FilmDetail>(`/films/${id}/`);
  return data;
};

type Props = {
  id?: string | null;
  onClose: () => void;
};

export const FilmsModal = ({ id, onClose }: Props) => {
  const { data, isLoading, isError }: UseQueryResult<FilmDetail, Error> =
    useQuery({
      queryKey: ["film", id],
      queryFn: () => fetchFilm(id!),
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

        {isError && (
          <div className="alert alert-error">
            <span>Error loading film details</span>
            <button className="btn btn-xs" onClick={onClose}>Close</button>
          </div>
        )}

        {data && (
          <div className="flex flex-col lg:flex-row gap-4">
            <figure className="w-full lg:w-1/3">
              <img
                src={
                  POSTERS_BY_EPISODE[data.episode_id] ??
                  `https://placehold.co/400x600?text=${encodeURIComponent(data.title)}`
                }
                alt={data.title}
                className="rounded-md object-cover"
              />
            </figure>

            <div className="w-full lg:w-2/3 space-y-1">
              <h3 className="text-2xl font-bold text-yellow-400">{data.title}</h3>
              <div className="mt-3 space-y-2 text-sm">
                <p><strong>Director:</strong> {data.director}</p>
                <p><strong>Producer(s):</strong> {data.producer}</p>
                <p><strong>Release:</strong> {data.release_date}</p>
                <div>
                  <strong>Opening crawl:</strong>
                  <p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed opacity-80">
                    {data.opening_crawl}
                  </p>
                </div>
                
                <div className="divider my-2"></div>
                <div className="flex gap-4 text-sm opacity-70">
                  <p><strong>Characters:</strong> {data.characters?.length ?? 0}</p>
                  <p><strong>Planets:</strong> {data.planets?.length ?? 0}</p>
                </div>
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