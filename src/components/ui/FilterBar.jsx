const fieldCls =
  'rounded-lg border border-line bg-card px-3 py-2 text-sm dark:border-[#3a342b] dark:bg-[#221e18] dark:text-[#f1ece3]'


export default function FilterBar({
  search,
  onSearch,
  status,
  onStatus,
  statusOptions,
  sort,
  onSort,
  resultCount,
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search assignments</span>
          <span aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft">🔍</span>
          <input
            type="search"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search by title or description"
            className={`${fieldCls} w-full pl-9`}
          />
        </label>

        {statusOptions && (
          <label>
            <span className="sr-only">Filter by status</span>
            <select value={status} onChange={(e) => onStatus(e.target.value)} className={`${fieldCls} w-full sm:w-auto`}>
              {statusOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
        )}

        <label>
          <span className="sr-only">Sort by due date</span>
          <select value={sort} onChange={(e) => onSort(e.target.value)} className={`${fieldCls} w-full sm:w-auto`}>
            <option value="asc">Due soonest first</option>
            <option value="desc">Due latest first</option>
          </select>
        </label>
      </div>
      <p className="text-xs text-ink-soft dark:text-[#a89e90]" aria-live="polite">
        Showing {resultCount} {resultCount === 1 ? 'assignment' : 'assignments'}
      </p>
    </div>
  )
}
