import { useEffect } from "react";
import { useForm } from "react-hook-form";

export type SpeciesFormData = {
  name?: string;
  classification?: string;
};

type Option = { id: string; label: string };

type Props = {
  onSubmit?: (data: SpeciesFormData) => void;
  onReset?: () => void;
  live?: boolean;
  defaultValues?: SpeciesFormData;
  classificationOptions?: Option[];
};

export const SpeciesFilterForm = ({
  onSubmit = () => {},
  onReset = () => {},
  live = false,
  defaultValues,
  classificationOptions = [],
}: Props) => {
  const { register, handleSubmit, watch, reset } = useForm<SpeciesFormData>({
    defaultValues: defaultValues ?? { name: "", classification: "" },
  });

  const watchedName = watch("name");
  const watchedClassification = watch("classification");

  useEffect(() => {
    if (live) {
      onSubmit({
        name: watchedName,
        classification: watchedClassification,
      });
    }
  }, [live, watchedName, watchedClassification, onSubmit]);

  return (
    <form
      data-testid="filter-form"
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
          placeholder="Search by name (e.g. Wookiee)"
          aria-label="Filter by name"
        />
      </div>

      <div className="w-full max-w-xs">
        <label className="label">
          <span className="label-text">Classification</span>
        </label>
        <select
          {...register("classification")}
          className="select select-bordered w-full"
          aria-label="Filter by classification"
        >
          <option value="">Any</option>
          {classificationOptions.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <button type="submit" className="btn btn-primary" aria-label="Apply filters">
          Filter
        </button>

        <button
          type="button"
          className="btn btn-ghost"
          aria-label="Reset filters"
          onClick={() => {
            reset({ name: "", classification: "" });
            onSubmit({ name: "", classification: "" });
            onReset?.();
          }}
        >
          Reset
        </button>
      </div>
    </form>
  );
};

export default SpeciesFilterForm;
