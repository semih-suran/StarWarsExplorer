import { useState } from "react";
import { useFavoritesData } from "@/hooks/useFavoritesData";
import { ResourceLayout } from "@/components/ResourceLayout/ResourceLayout";
import { Card } from "@/components/Card/Card";
import { Alert } from "@/components/Alert/Alert";
import { placeholder } from "@/utilities/placeholder";
import { POSTERS_BY_EPISODE } from "@/pages/films/components/FilmsPosterMap";
import type { ResourceType } from "@/types";

import { PeopleModal } from "@/pages/people/components/PeopleModal/PeopleModal";
import { FilmsModal } from "@/pages/films/components/FilmsModal/FilmsModal";
import { PlanetsModal } from "@/pages/planets/components/PlanetsModal/PlanetsModal";
import { SpeciesModal } from "@/pages/species/components/SpeciesModal/SpeciesModal";
import { StarshipsModal } from "@/pages/starships/components/StarshipsModal/StarshipsModal";
import { VehiclesModal } from "@/pages/vehicles/components/VehiclesModal/VehiclesModal";

const getTypeFromUrl = (url: string): ResourceType => {
  const parts = url.split("/").filter(Boolean);
  const resource = parts[parts.length - 2]; 

  if (resource === "people") return "person";
  if (resource === "films") return "film";
  if (resource === "species") return "specie";
  return (resource.endsWith("s") ? resource.slice(0, -1) : resource) as ResourceType;
};

export const Favorites = () => {
  const { data: favorites, isLoading } = useFavoritesData();
  const [viewState, setViewState] = useState<{ id: string; type: ResourceType } | null>(null);

  const handleView = (url: string) => {
    const parts = url.split("/").filter(Boolean);
    const id = parts[parts.length - 1];
    const type = getTypeFromUrl(url);
    setViewState({ id, type });
  };

  const handleClose = () => setViewState(null);

  return (
    <ResourceLayout title="My Favorites" isLoading={isLoading} error={null}>
      {favorites.length === 0 ? (
        <Alert message="You haven't added any favorites yet. Go explore the galaxy!" type="info" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((item) => {
            if (!item?.url) return null;

            const parts = item.url.split("/").filter(Boolean);
            const id = parts[parts.length - 1];
            const type = getTypeFromUrl(item.url);
            const title = "title" in item ? item.title : item.name;
            const isFilm = type === "film";

            return (
              <Card
                key={item.url}
                id={id}
                url={item.url}
                title={title}
                type={type}
                image={
                  isFilm
                    ? POSTERS_BY_EPISODE[Number(id)]
                    : placeholder(title)
                }
                onView={() => handleView(item.url)}
              >
                <div className="badge badge-outline capitalize">{type}</div>
              </Card>
            );
          })}
        </div>
      )}

      {viewState?.type === "person" && (
        <PeopleModal id={viewState.id} onClose={handleClose} />
      )}
      {viewState?.type === "film" && (
        <FilmsModal id={viewState.id} onClose={handleClose} />
      )}
      {viewState?.type === "planet" && (
        <PlanetsModal id={viewState.id} onClose={handleClose} />
      )}
      {viewState?.type === "specie" && (
        <SpeciesModal id={viewState.id} onClose={handleClose} />
      )}
      {viewState?.type === "starship" && (
        <StarshipsModal id={viewState.id} onClose={handleClose} />
      )}
      {viewState?.type === "vehicle" && (
        <VehiclesModal id={viewState.id} onClose={handleClose} />
      )}
    </ResourceLayout>
  );
};

export default Favorites;