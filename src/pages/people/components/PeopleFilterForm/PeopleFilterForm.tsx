import { useForm } from "react-hook-form";
import { useEffect } from "react";

export type PeopleFormData = { name: string; gender: string };

export const PeopleFilterForm = ({ onSubmit, onReset, defaultValues }: any) => {
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
    <form onSubmit={handleManualSubmit} className="flex gap-4 items-end">
      <div className="flex-1">
        <label className="label font-bold">Name</label>
        <input
          {...register("name")}
          className="input input-bordered w-full"
          placeholder="Search..."
        />
      </div>
<div className="flex-1">
        <label className="label font-bold">Gender</label>
        <select {...register("gender")} className="select select-bordered w-full">
          <option value="">Any</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="n/a">N/A</option>
          <option value="hermaphrodite">Hermaphrodite</option>
        </select>
      </div>
      <button type="submit" className="btn btn-primary">
        Filter
      </button>
      <button type="button" className="btn btn-ghost" onClick={onReset}>
        Reset
      </button>
    </form>
  );
};