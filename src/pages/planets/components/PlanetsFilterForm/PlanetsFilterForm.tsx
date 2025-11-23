import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { IPlanet } from "@/types";

export type PlanetsFormData = {
  name?: IPlanet["name"];
  terrain?: IPlanet["terrain"] | "";
};

type Props = {
  onSubmit?: (data: PlanetsFormData) => void;
  onReset?: () => void;
  live?: boolean;
  defaultValues?: PlanetsFormData;
  terrainOptions?: string[];
};

export const PlanetsFilterForm = ({
  onSubmit = () => {},
  onReset = () => {},
  live = false,
  defaultValues,
  terrainOptions = [],
}: Props) => {
  const { register, handleSubmit, watch, reset } = useForm<PlanetsFormData>({
    defaultValues: defaultValues ?? { name: "", terrain: "" },
  });

  const watched = watch();
  useEffect(() => {
    if (live) onSubmit(watched);
  }, [watched.name, watched.terrain]);

  const fallbackOptions = [
    "desert",
    "grasslands",
    "mountains",
    "jungle",
    "forests",
    "swamp",
    "tundra",
    "ice",
    "ocean",
    "volcano",
    "urban",
  ];

  const options = terrainOptions.length ? terrainOptions : fallbackOptions;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex gap-4 mb-4 flex-col md:flex-row items-end"
    >
      <div className="w-full">
        <label className="label">
          <span className="label-text">Name</span>
        </label>
        <input
          {...register("name")}
          className="input input-bordered w-full"
          type="text"
          placeholder="Search by name (e.g. Tatooine)"
          aria-label="Filter by name"
        />
      </div>

      <div className="w-full max-w-xs">
        <label className="label">
          <span className="label-text">Terrain</span>
        </label>
        <select
          {...register("terrain")}
          className="select select-bordered w-full"
          aria-label="Filter by terrain"
        >
          <option value="">Any</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <button type="submit" className="btn btn-primary">
          Filter
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            reset({ name: "", terrain: "" });
            onSubmit({ name: "", terrain: "" });
            onReset?.();
          }}
        >
          Reset
        </button>
      </div>
    </form>
  );
};
