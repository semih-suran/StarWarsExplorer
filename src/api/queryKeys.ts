export const queryKeys = {
  people: {
    all: ["people"] as const,
    list: (page: number, search: string) =>
      [...queryKeys.people.all, "list", { page, search }] as const,
    detail: (id: string) => [...queryKeys.people.all, "detail", id] as const,
  },
  planets: {
    all: ["planets"] as const,
    list: (page: number, search: string) =>
      [...queryKeys.planets.all, "list", { page, search }] as const,
    detail: (id: string) => [...queryKeys.planets.all, "detail", id] as const,
  },
  films: {
    all: ["films"] as const,
    list: (page: number, search: string) =>
      [...queryKeys.films.all, "list", { page, search }] as const,
    detail: (id: string) => [...queryKeys.films.all, "detail", id] as const,
  },
  species: {
    all: ["species"] as const,
    list: (page: number, search: string) =>
      [...queryKeys.species.all, "list", { page, search }] as const,
    detail: (id: string) => [...queryKeys.species.all, "detail", id] as const,
  },
  vehicles: {
    all: ["vehicles"] as const,
    list: (page: number, search: string) =>
      [...queryKeys.vehicles.all, "list", { page, search }] as const,
    detail: (id: string) => [...queryKeys.vehicles.all, "detail", id] as const,
  },
  starships: {
    all: ["starships"] as const,
    list: (page: number, search: string) =>
      [...queryKeys.starships.all, "list", { page, search }] as const,
    detail: (id: string) =>
      [...queryKeys.starships.all, "detail", id] as const,
  },
};