import { useState } from "react";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { Card } from "@/components/Card/Card";
import { Alert } from "@/components/Alert/Alert";

import { PeopleModal } from "@/pages/people/components/PeopleModal/PeopleModal";
import FilmsModal from "@/pages/films/components/FilmsModal/FilmsModal";
import PlanetsModal from "@/pages/planets/components/PlanetsModal/PlanetsModal";
import SpeciesModal from "@/pages/species/components/SpeciesModal/SpeciesModal";
import StarshipsModal from "@/pages/starships/components/StarshipsModal/StarshipsModal";
import VehiclesModal from "@/pages/vehicles/components/VehiclesModal/VehiclesModal";

export const Favorites = () => {
  const { favorites } = useFavoritesStore();
  
  const [viewState, setViewState] = useState<{ id: string; type: string } | null>(null);

  const handleView = (id: string, type: string) => {
    setViewState({ id, type });
  };

  const handleClose = () => {
    setViewState(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-yellow-400">My Favorites</h1>

      {favorites.length === 0 ? (
        <Alert message="You haven't added any favorites yet. Go explore the galaxy!" type="info" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((item) => (
            <Card
              key={`${item.type}-${item.id}`}
              id={item.id}
              title={item.name}
              type={item.type}
              image={item.image || `https://placehold.co/400x400/000000/FFFFFF?text=${item.name}`}
              onView={() => handleView(item.id, item.type)}
            >
              <div className="badge badge-outline capitalize">{item.type}</div>
            </Card>
          ))}
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