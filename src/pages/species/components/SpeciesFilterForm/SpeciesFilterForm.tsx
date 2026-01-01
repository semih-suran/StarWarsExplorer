import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import type { ISpecie } from "@/types";

export type SpeciesFormData = {
  name: string;
  classification: string;
};

type Props = {
  onSubmit?: (data: SpeciesFormData) => void;
  onReset?: () => void;
  defaultValues?: SpeciesFormData;
  resourceList?: ISpecie[];
};

export const SpeciesFilterForm = ({
  onSubmit = () => {},
  onReset = () => {},
  defaultValues,
  resourceList = [],
}: Props) => {
  const { register, handleSubmit, reset } = useForm<SpeciesFormData>({
    defaultValues: defaultValues ?? { name: "", classification: "" },
  });

  const classifications = useMemo(() => {
    const all = resourceList.map((s) => s.classification).filter(Boolean);
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
        <label className="label"><span className="label-text">Name</span></label>
        <input
          {...register("name")}
          className="input input-bordered w-full"
          type="text"
          placeholder="Search species..."
        />
      </div>

      <div className="w-full max-w-xs">
        <label className="label"><span className="label-text">Classification</span></label>
        <select {...register("classification")} className="select select-bordered w-full">
          <option value="">Any</option>
          {classifications.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <button type="submit" className="btn btn-warning">Filter</button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            reset({ name: "", classification: "" });
            onReset();
          }}
        >
          Reset
        </button>
      </div>
    </form>
  );
};