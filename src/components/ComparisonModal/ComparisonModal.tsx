import { useQueries } from "@tanstack/react-query";
import { Loading } from "@/components/Loading/Loading";
import { cn } from "@/utilities/cn";
import type { SelectedItem } from "@/store/useSelectionStore";

type Props = {
  items: SelectedItem[];
  onClose: () => void;
};

const COMPARISON_CONFIG: Record<string, { label: string; key: string; isNumeric?: boolean; isDate?: boolean }[]> = {
  film: [
    { label: "Director", key: "director" },
    { label: "Release Date", key: "release_date", isDate: true },
  ],
  person: [
    { label: "Height", key: "height", isNumeric: true },
    { label: "Mass", key: "mass", isNumeric: true },
  ],
  planet: [
    { label: "Diameter", key: "diameter", isNumeric: true },
    { label: "Population", key: "population", isNumeric: true },
  ],
  specie: [
    { label: "Avg Height", key: "average_height", isNumeric: true },
    { label: "Avg Lifespan", key: "average_lifespan", isNumeric: true },
  ],
  starship: [
    { label: "Max Speed", key: "max_atmosphering_speed", isNumeric: true },
    { label: "Cargo Capacity", key: "cargo_capacity", isNumeric: true },
  ],
  vehicle: [
    { label: "Max Speed", key: "max_atmosphering_speed", isNumeric: true },
    { label: "Cargo Capacity", key: "cargo_capacity", isNumeric: true },
  ],
};

const parseValue = (val: string | number) => {
  if (typeof val === "number") return val;
  if (!val || val === "unknown" || val === "n/a") return -1;
  return parseFloat(val.replace(/,/g, ""));
};

export const ComparisonModal = ({ items, onClose }: Props) => {
  const [itemA, itemB] = items;
  const typeMismatch = itemA.type !== itemB.type;

  const queries = useQueries({
    queries: items.map((item) => ({
      queryKey: ["resource", item.url],
      queryFn: () => fetch(item.url).then((res) => res.json()),
      staleTime: 1000 * 60 * 5,
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);
  const dataA = queries[0]?.data;
  const dataB = queries[1]?.data;

  if (isLoading) {
    return (
      <dialog className="modal modal-open">
        <div className="modal-box bg-base-100 border border-warning/20">
            <Loading />
        </div>
      </dialog>
    );
  }

  const fields = COMPARISON_CONFIG[itemA.type] || [];

  return (
    <dialog className="modal modal-open">
      <div className="modal-box w-11/12 max-w-4xl p-0 overflow-hidden border border-warning shadow-2xl bg-base-100">

        <div className="bg-neutral p-4 flex justify-between items-center border-b border-white/10">
            <h3 className="font-bold text-2xl text-warning uppercase tracking-widest">
                VS Mode: {itemA.type}
            </h3>
            <button className="btn btn-sm btn-circle btn-ghost text-white hover:bg-white/20" onClick={onClose}>
                ✕
            </button>
        </div>

        <div className="p-6">
            {typeMismatch ? (
                <div className="alert alert-error">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>Error: You cannot compare a <strong>{itemA.type}</strong> with a <strong>{itemB.type}</strong>.</span>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table table-lg w-full text-center">
                        <thead>
                            <tr className="text-xl border-b border-base-300">
                                <th className="w-1/3 text-warning font-black text-2xl pb-4">{dataA?.name || dataA?.title}</th>
                                <th className="w-1/3 opacity-30 italic font-normal pb-4">Statistic</th>
                                <th className="w-1/3 text-warning font-black text-2xl pb-4">{dataB?.name || dataB?.title}</th>
                            </tr>
                        </thead>
                        <tbody>
                        {fields.map(({ label, key, isNumeric, isDate }) => {
                            const valA = dataA?.[key];
                            const valB = dataB?.[key];
                            
                            let classA = "text-lg";
                            let classB = "text-lg";

                            if (isNumeric) {
                                const numA = parseValue(valA);
                                const numB = parseValue(valB);

                                if (numA > -1 && numB > -1 && numA !== numB) {
                                    classA = numA > numB ? "text-success font-bold bg-success/10 rounded-lg" : "text-error opacity-70";
                                    classB = numB > numA ? "text-success font-bold bg-success/10 rounded-lg" : "text-error opacity-70";
                                }
                            } else if (isDate) {
                                const dateA = new Date(valA).getTime();
                                const dateB = new Date(valB).getTime();
                                if (!isNaN(dateA) && !isNaN(dateB) && dateA !== dateB) {
                                     classA = dateA > dateB ? "text-success font-bold" : "opacity-70";
                                     classB = dateB > dateA ? "text-success font-bold" : "opacity-70";
                                }
                            }

                            return (
                            <tr key={key} className="hover:bg-base-200/50 transition-colors border-b border-base-200/50 last:border-0">
                                <td className={cn("py-6 transition-all", classA)}>
                                    {valA}
                                </td>
                                <td className="font-semibold opacity-50 uppercase text-xs tracking-widest align-middle">
                                    {label}
                                </td>
                                <td className={cn("py-6 transition-all", classB)}>
                                    {valB}
                                </td>
                            </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};