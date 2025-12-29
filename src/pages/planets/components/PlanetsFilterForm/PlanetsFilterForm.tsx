import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import type { IPlanet } from "@/types";

export type PlanetsFormData = {
  name: string;
  terrain: string;
};

type Props = {
  onSubmit?: (data: PlanetsFormData) => void;
  onReset?: () => void;
  defaultValues?: PlanetsFormData;
  resourceList?: IPlanet[];
};

export const PlanetsFilterForm = ({
  onSubmit = () => {},
  onReset = () => {},
  defaultValues,
  resourceList = [],
}: Props) => {
  const { register, handleSubmit, reset } = useForm<PlanetsFormData>({
    defaultValues: defaultValues ?? { name: "", terrain: "" },
  });

  const terrains = useMemo(() => {
    const all = resourceList.flatMap((p) =>
      p.terrain.split(",").map((t) => t.trim())
    );
    return Array.from(new Set(all)).sort();
  }, [resourceList]);

  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, reset]);

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
          placeholder="Search planets..."
        />
      </div>

      <div className="w-full max-w-xs">
        <label className="label">
          <span className="label-text">Terrain</span>
        </label>
        <select {...register("terrain")} className="select select-bordered w-full">
          <option value="">Any Terrain</option>
          {terrains.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <button type="submit" className="btn btn-primary">Filter</button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            reset({ name: "", terrain: "" });
            onReset();
          }}
        >
          Reset
        </button>
      </div>
    </form>
  );
};