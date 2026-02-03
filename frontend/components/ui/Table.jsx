export default function Table({ columns, data, emptyMessage = 'Nessun risultato.' }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-md border border-neutral-200">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-neutral-100 text-neutral-700">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3 font-semibold">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td className="px-4 py-4 text-neutral-500" colSpan={columns.length}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={row.id || index}
                className={index % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 text-neutral-700">
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
