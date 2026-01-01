import { useState } from "react";
import { Card } from "@/components/Card/Card";
import { Alert } from "@/components/Alert/Alert";
import { Loading } from "@/components/Loading/Loading";
import { useFavoritesData } from "@/hooks/useFavoritesData";
import { PeopleModal } from "@/pages/people/components/PeopleModal/PeopleModal";
import { FilmsModal } from "@/pages/films/components/FilmsModal/FilmsModal";
import { PlanetsModal } from "@/pages/planets/components/PlanetsModal/PlanetsModal";
import { SpeciesModal } from "@/pages/species/components/SpeciesModal/SpeciesModal";
import { StarshipsModal } from "@/pages/starships/components/StarshipsModal/StarshipsModal";
import { VehiclesModal } from "@/pages/vehicles/components/VehiclesModal/VehiclesModal";

import type { 
  IPeople, 
  IFilm, 
  IPlanet, 
  ISpecie, 
  IStarship, 
  IVehicle 
} from "@/types";

type FavoriteItem = IPeople | IFilm | IPlanet | ISpecie | IStarship | IVehicle;

export const Favorites = () => {
  const { data: favorites, isLoading } = useFavoritesData();
  
  const [viewState, setViewState] = useState<{ id: string; type: string } | null>(null);

  const handleView = (url: string) => {
    const parts = url.split("/");
    const id = parts[parts.length - 1] || parts[parts.length - 2];
    const type = parts[parts.length - 2] || parts[parts.length - 3];
    setViewState({ id, type });
  };

  const handleClose = () => {
    setViewState(null);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-5xl font-bold text-yellow-400 mb-8 drop-shadow-md text-center">
        My Favorites
      </h1>

      {favorites.length === 0 ? (
        <Alert message="You haven't added any favorites yet. Go explore the galaxy!" type="info" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((item: FavoriteItem) => {
            if (!item?.url) return null;

            const parts = item.url.split("/");
            const id = parts[parts.length - 1] || parts[parts.length - 2];
            const type = parts[parts.length - 2] || parts[parts.length - 3];
            const title = "title" in item ? item.title : item.name;

            return (
              <Card
                key={item.url}
                id={id}
                url={item.url}
                title={title}
                type={type}
                image={`https://placehold.co/400x400/000000/FFFFFF?text=${title}`}
                onView={() => handleView(item.url)}
              >
                <div className="badge badge-outline capitalize">{type}</div>
              </Card>
            );
          })}
        </div>
      )}

      {viewState?.type === "people" && (
        <PeopleModal id={viewState.id} onClose={handleClose} />
      )}
      {viewState?.type === "films" && (
        <FilmsModal id={viewState.id} onClose={handleClose} />
      )}
      {viewState?.type === "planets" && (
        <PlanetsModal id={viewState.id} onClose={handleClose} />
      )}
      {viewState?.type === "species" && (
        <SpeciesModal id={viewState.id} onClose={handleClose} />
      )}
      {viewState?.type === "starships" && (
        <StarshipsModal id={viewState.id} onClose={handleClose} />
      )}
      {viewState?.type === "vehicles" && (
        <VehiclesModal id={viewState.id} onClose={handleClose} />
      )}
    </div>
  );
};

export default Favorites;