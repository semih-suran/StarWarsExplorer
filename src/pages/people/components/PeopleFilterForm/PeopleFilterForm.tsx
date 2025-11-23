import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { IPeople } from "@/types";

export type PeopleFormData = {
  name?: IPeople["name"];
  gender?: IPeople["gender"] | "";
};

type Props = {
  onSubmit?: (data: PeopleFormData) => void;
  onReset?: () => void;
  live?: boolean;
  defaultValues?: PeopleFormData;
};

export const PeopleFilterForm = ({
  onSubmit = () => {},
  onReset = () => {},
  live = false,
  defaultValues,
}: Props) => {
  const { register, handleSubmit, watch, reset } = useForm<PeopleFormData>({
    defaultValues: defaultValues ?? { name: "", gender: "" },
  });

  const watched = watch();
  useEffect(() => {
    if (live) {
      onSubmit(watched);
    }
  }, [watched.name, watched.gender]);

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
          placeholder="Search by name (e.g. Luke)"
          aria-label="Filter by name"
        />
      </div>

      <div className="w-full max-w-xs">
        <label className="label">
          <span className="label-text">Gender</span>
        </label>
        <select
          {...register("gender")}
          className="select select-bordered w-full"
          aria-label="Filter by gender"
        >
          <option value="">Any</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="n/a">N/A</option>
          <option value="hermaphrodite">Hermaphrodite</option>
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
            reset({ name: "", gender: "" });
            onSubmit({ name: "", gender: "" });
            onReset();
          }}
        >
          Reset
        </button>
      </div>
    </form>
  );
};
