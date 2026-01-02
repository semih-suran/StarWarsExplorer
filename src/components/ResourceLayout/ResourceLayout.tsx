import { useState, type ReactNode } from "react";
import { Alert } from "@/components/Alert/Alert";
import { Loading } from "@/components/Loading/Loading";
import { useSelectionStore } from "@/store/useSelectionStore";
import { ComparisonModal } from "@/components/ComparisonModal/ComparisonModal";

type Props = {
  title: string;
  isLoading: boolean;
  error: Error | null;
  children: ReactNode;
};

export const ResourceLayout = ({ title, isLoading, error, children }: Props) => {
  const { selectedItems, clearSelection } = useSelectionStore();
  const [showCompare, setShowCompare] = useState(false);

  if (isLoading) return <Loading />;
  if (error) return <Alert message={error.message} type="error" />;

  return (
    <div className="container mx-auto p-4 pb-24">
      <h1 className="text-5xl font-bold text-warning mb-8 drop-shadow-md text-center">
        {title}
      </h1>
      {children}
      {selectedItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-neutral/95 backdrop-blur-md p-4 border-t border-warning/20 shadow-[0_-5px_20px_rgba(0,0,0,0.5)] z-50 animate-slide-up">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex gap-4 overflow-x-auto items-center">
              {selectedItems.map((item) => (
                <div key={item.id} className="badge badge-lg badge-outline gap-2 py-4 px-4 border-warning/50 text-warning">
                  <span className="opacity-50 text-[10px] uppercase tracking-wider">{item.type}</span>
                  <span className="font-bold">{item.name}</span>
                </div>
              ))}
              {selectedItems.length === 1 && (
                 <span className="text-xs opacity-50 italic ml-2">Select one more to compare...</span>
              )}
            </div>
            
            <div className="flex gap-3">
              <button className="btn btn-sm btn-ghost text-error hover:bg-error/10" onClick={clearSelection}>
                Clear
              </button>
              <button 
                className="btn btn-sm btn-warning shadow-lg shadow-warning/20"
                disabled={selectedItems.length < 2} 
                onClick={() => setShowCompare(true)}
              >
                Compare ({selectedItems.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {showCompare && selectedItems.length === 2 && (
        <ComparisonModal 
            items={selectedItems} 
            onClose={() => setShowCompare(false)} 
        />
      )}
    </div>
  );
};