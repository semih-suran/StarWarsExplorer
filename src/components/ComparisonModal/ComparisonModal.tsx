import { useQueries } from "@tanstack/react-query";
import { Loading } from "@/components/Loading/Loading";
import type { SelectedItem } from "@/store/useSelectionStore";

type Props = {
  items: SelectedItem[];
  onClose: () => void;
};

const COMPARISON_CONFIG: Record<string, { label: string; key: string; isNumeric?: boolean; isDate?: boolean }[]> = {
  film: [{ label: "Director", key: "director" }, { label: "Release Date", key: "release_date", isDate: true }],
  person: [{ label: "Height", key: "height", isNumeric: true }, { label: "Mass", key: "mass", isNumeric: true }],
  planet: [{ label: "Diameter", key: "diameter", isNumeric: true }, { label: "Population", key: "population", isNumeric: true }],
  specie: [{ label: "Avg Height", key: "average_height", isNumeric: true }, { label: "Avg Lifespan", key: "average_lifespan", isNumeric: true }],
  starship: [{ label: "Max Speed", key: "max_atmosphering_speed", isNumeric: true }, { label: "Cargo Capacity", key: "cargo_capacity", isNumeric: true }],
  vehicle: [{ label: "Max Speed", key: "max_atmosphering_speed", isNumeric: true }, { label: "Cargo Capacity", key: "cargo_capacity", isNumeric: true }],
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
        <div className="modal-box bg-base-100 border border-warning/20 flex justify-center py-10">
          <Loading />
        </div>
      </dialog>
    );
  }

  const fields = COMPARISON_CONFIG[itemA.type] || [];

  return (
    <dialog className="modal modal-open">
      <div className="modal-box w-11/12 max-w-4xl p-0 overflow-hidden border border-warning shadow-2xl bg-base-100 flex flex-col max-h-[90vh]">
        
        <div className="bg-neutral p-4 flex justify-between items-center border-b border-white/10 shrink-0">
          <h3 className="font-bold text-lg md:text-2xl text-warning uppercase tracking-widest truncate mr-4">
            VS: {itemA.type}
          </h3>
          <button className="btn btn-sm btn-circle btn-ghost text-white hover:bg-white/20" onClick={onClose}>✕</button>
        </div>

        <div className="p-4 md:p-6 overflow-y-auto">
          {typeMismatch ? (
            <div className="alert alert-error">Category mismatch error.</div>
          ) : (
            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-2 gap-4 border-b border-base-300 pb-4">
                <div className="text-warning font-black text-center text-sm md:text-2xl break-words px-1">
                  {dataA?.name || dataA?.title}
                </div>
                <div className="text-warning font-black text-center text-sm md:text-2xl break-words px-1">
                  {dataB?.name || dataB?.title}
                </div>
              </div>

              <div className="flex flex-col gap-6">
                {fields.map(({ label, key, isNumeric, isDate }) => {
                  const valA = dataA?.[key];
                  const valB = dataB?.[key];
                  
                  let classA = "text-center py-3 px-2 rounded-lg transition-all duration-300";
                  let classB = "text-center py-3 px-2 rounded-lg transition-all duration-300";

                  if (isNumeric) {
                    const numA = parseValue(valA);
                    const numB = parseValue(valB);
                    if (numA > -1 && numB > -1 && numA !== numB) {
                      classA += numA > numB ? " bg-success/20 text-success font-bold" : " text-error opacity-60";
                      classB += numB > numA ? " bg-success/20 text-success font-bold" : " text-error opacity-60";
                    }
                  } else if (isDate) {
                    const dateA = new Date(valA).getTime();
                    const dateB = new Date(valB).getTime();
                    if (!isNaN(dateA) && !isNaN(dateB) && dateA !== dateB) {
                      classA += dateA > dateB ? " text-success font-bold" : " opacity-60";
                      classB += dateB > dateA ? " text-success font-bold" : " opacity-60";
                    }
                  }

                  return (
                    <div key={key} className="flex flex-col gap-2">
                      <div className="text-center">
                        <span className="text-[10px] md:text-xs font-bold opacity-40 uppercase tracking-[0.2em]">
                          {label}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 items-center">
                        <div className={classA}>
                          <span className="text-xs md:text-xl">{valA}</span>
                        </div>
                        <div className={classB}>
                          <span className="text-xs md:text-xl">{valB}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <form method="dialog" className="modal-backdrop bg-black/70">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};