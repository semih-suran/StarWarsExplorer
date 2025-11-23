type Props = {
  filters: Record<string, string | undefined | null>;
  onReset?: () => void;
};

export const ActiveFilters = ({ filters, onReset }: Props) => {
  const entries = Object.entries(filters).filter(([, v]) => v !== undefined && v !== "" && v !== null);

  if (entries.length === 0) return null;

  return (
    <div className="mb-4 flex items-center gap-3">
      <div className="flex flex-wrap gap-2">
        {entries.map(([k, v]) => (
          <span key={k} className="badge badge-outline">
            {k}: {String(v)}
          </span>
        ))}
      </div>

      {onReset && (
        <button className="btn btn-ghost btn-sm ml-3" onClick={onReset}>
          Reset filters
        </button>
      )}
    </div>
  );
};
