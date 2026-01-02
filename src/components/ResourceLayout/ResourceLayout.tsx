import type { ReactNode } from "react";
import { Alert } from "@/components/Alert/Alert";
import { Loading } from "@/components/Loading/Loading";
import { useSelectionStore } from "@/store/useSelectionStore";

type Props = {
  title: string;
  isLoading: boolean;
  error: Error | null;
  children: ReactNode;
};

export const ResourceLayout = ({ title, isLoading, error, children }: Props) => {
  const { selectedItems, clearSelection } = useSelectionStore();

  if (isLoading) return <Loading />;
  if (error) return <Alert message={error.message} type="error" />;

  return (
    <div className="container mx-auto p-4 pb-24">
      <h1 className="text-5xl font-bold text-warning mb-8 drop-shadow-md text-center">
        {title}
      </h1>
      {children}

      {selectedItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-neutral/90 backdrop-blur-md p-4 border-t border-warning/20 shadow-lg z-50 animate-slide-up">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex gap-4 overflow-x-auto">
              {selectedItems.map((item) => (
                <div key={item.id} className="badge badge-lg badge-outline gap-2">
                  <span className="opacity-50 text-xs uppercase">{item.type}</span>
                  {item.name}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button className="btn btn-sm btn-ghost text-error" onClick={clearSelection}>
                Clear
              </button>
              <button className="btn btn-sm btn-warning">
                Compare ({selectedItems.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};