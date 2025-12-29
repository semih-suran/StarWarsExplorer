import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import type { IFilm } from "@/types";

export type FilmsFormData = {
  name: string;
  director: string;
};

type Props = {
  onSubmit?: (data: FilmsFormData) => void;
  onReset?: () => void;
  defaultValues?: FilmsFormData;
  resourceList?: IFilm[];
};

export const FilmsFilterForm = ({
  onSubmit = () => {},
  onReset = () => {},
  defaultValues,
  resourceList = [],
}: Props) => {
  const { register, handleSubmit, reset } = useForm<FilmsFormData>({
    defaultValues: defaultValues ?? { name: "", director: "" },
  });

  const directors = useMemo(() => {
    const allDirectors = resourceList.flatMap((film) =>
      film.director.split(",").map((d) => d.trim())
    );
    return Array.from(new Set(allDirectors)).sort();
  }, [resourceList]);

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex gap-4 mb-4 flex-col md:flex-row items-end"
    >
      <div className="w-full">
        <label className="label">
          <span className="label-text">Title</span>
        </label>
        <input
          {...register("name")}
          className="input input-bordered w-full"
          type="text"
          placeholder="Search by title..."
        />
      </div>

      <div className="w-full max-w-xs">
        <label className="label">
          <span className="label-text">Director</span>
        </label>
        <select {...register("director")} className="select select-bordered w-full">
          <option value="">Any Director</option>
          {directors.map((director) => (
            <option key={director} value={director}>
              {director}
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
            reset({ name: "", director: "" });
            onReset();
          }}
        >
          Reset
        </button>
      </div>
    </form>
  );
};