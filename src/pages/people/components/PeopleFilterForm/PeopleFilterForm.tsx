import { useForm } from "react-hook-form";
import { useEffect } from "react";

export type PeopleFormData = { name: string; gender: string };

type Props = {
  onSubmit: (data: PeopleFormData) => void;
  onReset: () => void;
  defaultValues?: PeopleFormData;
  resourceList?: unknown[]; 
};

export const PeopleFilterForm = ({ onSubmit, onReset, defaultValues }: Props) => {
  const { register, getValues, reset } = useForm({
    defaultValues: defaultValues || { name: "", gender: "" },
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const values = getValues();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleManualSubmit} className="flex gap-4 mb-4 flex-col md:flex-row items-end">
      <div className="w-full">
        <label className="label">
          <span className="label-text">Name</span>
        </label>
        <input
          {...register("name")}
          className="input input-bordered w-full"
          placeholder="Search..."
        />
      </div>
      <div className="w-full max-w-xs">
        <label className="label">
          <span className="label-text">Gender</span>
        </label>
        <select {...register("gender")} className="select select-bordered w-full">
          <option value="">Any</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="n/a">N/A</option>
          <option value="hermaphrodite">Hermaphrodite</option>
        </select>
      </div>
      <div className="flex gap-2">
        <button type="submit" className="btn btn-warning">Filter</button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            reset({ name: "", gender: "" });
            onReset();
          }}
        >
          Reset
        </button>
      </div>
    </form>
  );
};