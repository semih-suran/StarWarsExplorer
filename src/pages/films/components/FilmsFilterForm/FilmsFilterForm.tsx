import { useEffect } from "react";
import { useForm } from "react-hook-form";

export type FilmsFormData = {
  name?: string;
  director?: string;
};

type Option = { id: string; label: string };

type Props = {
  onSubmit?: (data: FilmsFormData) => void;
  live?: boolean;
  defaultValues?: FilmsFormData;
  directorOptions?: Option[];
};

export const FilmsFilterForm = ({
  onSubmit = () => {},
  live = false,
  defaultValues,
  directorOptions = [],
}: Props) => {
  const { register, handleSubmit, watch, reset } = useForm<FilmsFormData>({
    defaultValues: defaultValues ?? { name: "", director: "" },
  });

  const watched = watch();
  useEffect(() => {
    if (live) onSubmit(watched);
  }, [watched.name, watched.director]);

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
          placeholder="Search by title"
          aria-label="Filter by title"
        />
      </div>

      <div className="w-full max-w-xs">
        <label className="label">
          <span className="label-text">Director</span>
        </label>
        <select
          {...register("director")}
          className="select select-bordered w-full"
          aria-label="Filter by director"
        >
          <option value="">Any</option>
          {directorOptions.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
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
            onSubmit({ name: "", director: "" });
          }}
        >
          Reset
        </button>
      </div>
    </form>
  );
};
