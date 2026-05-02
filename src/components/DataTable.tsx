import type { DataRow, Field } from '../types'

type DataTableProps = {
  entityName: string
  fields: Field[]
  rows: DataRow[]
  loading: boolean
}

function renderCell(value: unknown) {
  if (value === null || value === undefined) {
    return ''
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }

  if (typeof value === 'object') {
    return JSON.stringify(value)
  }

  return String(value)
}

export function DataTable({ entityName, fields, rows, loading }: DataTableProps) {
  if (rows.length === 0) {
    return (
      <section className="card">
        <div className="table-header">
          <h2>{entityName} records</h2>
          {loading ? <span className="status-text">Refreshing...</span> : null}
        </div>
        <p className="help-text">No records have been created yet.</p>
      </section>
    )
  }

  return (
    <section className="card">
      <div className="table-header">
        <h2>{entityName} records</h2>
        {loading ? <span className="status-text">Refreshing...</span> : null}
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {fields.map((field) => (
                <th key={field.id}>{field.label || field.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                {fields.map((field) => (
                  <td key={`${index}-${field.id}`}>{renderCell(row[field.name])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
