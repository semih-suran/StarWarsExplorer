import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import type { IStarship } from "@/types";

export type StarshipsFormData = {
  name: string;
  starship_class: string;
};

type Props = {
  onSubmit?: (data: StarshipsFormData) => void;
  onReset?: () => void;
  defaultValues?: StarshipsFormData;
  resourceList?: IStarship[];
};

export const StarshipsFilterForm = ({
  onSubmit = () => {},
  onReset = () => {},
  defaultValues,
  resourceList = [],
}: Props) => {
  const { register, handleSubmit, reset } = useForm<StarshipsFormData>({
    defaultValues: defaultValues ?? { name: "", starship_class: "" },
  });

  const classes = useMemo(() => {
    const all = resourceList.map((s) => s.starship_class).filter(Boolean);
    return Array.from(new Set(all)).sort();
  }, [resourceList]);

  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4 mb-4 flex-col md:flex-row items-end">
      <div className="w-full">
        <label className="label"><span className="label-text">Name</span></label>
        <input {...register("name")} className="input input-bordered w-full" type="text" placeholder="Search starships..." />
      </div>

      <div className="w-full max-w-xs">
        <label className="label"><span className="label-text">Class</span></label>
        <select {...register("starship_class")} className="select select-bordered w-full">
          <option value="">Any</option>
          {classes.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <button type="submit" className="btn btn-warning">Filter</button>
        <button type="button" className="btn btn-ghost" onClick={() => { reset({ name: "", starship_class: "" }); onReset(); }}>Reset</button>
      </div>
    </form>
  );
};