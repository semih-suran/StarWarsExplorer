import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { IVehicle } from "@/types";

export type VehiclesFormData = {
  name?: IVehicle["name"];
  vehicle_class?: IVehicle["vehicle_class"] | "";
};

type Props = {
  onSubmit?: (data: VehiclesFormData) => void;
  onReset?: () => void;
  live?: boolean;
  defaultValues?: VehiclesFormData;
  classOptions?: string[];
};

export const VehiclesFilterForm = ({
  onSubmit = () => {},
  onReset = () => {},
  live = false,
  defaultValues,
  classOptions = [],
}: Props) => {
  const { register, handleSubmit, watch, reset } = useForm<VehiclesFormData>({
    defaultValues: defaultValues ?? { name: "", vehicle_class: "" },
  });

  const watched = watch();
  useEffect(() => {
    if (live) onSubmit(watched);
  }, [watched.name, watched.vehicle_class]);

  const options = classOptions.length ? classOptions : [];

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
          placeholder="Search by name (e.g. Sand Crawler)"
          aria-label="Filter by name"
        />
      </div>

      <div className="w-full max-w-xs">
        <label className="label">
          <span className="label-text">Vehicle class</span>
        </label>
        <select
          {...register("vehicle_class")}
          className="select select-bordered w-full"
          aria-label="Filter by vehicle class"
        >
          <option value="">Any</option>
          {options.map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
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
            reset({ name: "", vehicle_class: "" });
            onSubmit({ name: "", vehicle_class: "" });
            onReset?.();
          }}
        >
          Reset
        </button>
      </div>
    </form>
  );
};
