import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { DynamicForm } from '../components/DynamicForm'
import { DataTable } from '../components/DataTable'
import { fetchEntity } from '../services/entityService'
import { fetchData, createRow } from '../services/dataService'
import type { Entity, DataRow } from '../types'

function getMessage(error: unknown) {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'Unexpected error'
}

export function DynamicViewPage() {
  const { entity } = useParams<{ entity: string }>()
  const navigate = useNavigate()
  const [schema, setSchema] = useState<Entity | null>(null)
  const [rows, setRows] = useState<DataRow[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!entity) {
      return
    }

    setLoading(true)
    setError('')

    fetchEntity(entity)
      .then((value) => {
        setSchema(value)
        return fetchData(entity)
      })
      .then((data) => setRows(data.rows ?? []))
      .catch((err) => setError(getMessage(err)))
      .finally(() => setLoading(false))
  }, [entity])

  async function handleCreate(row: Record<string, unknown>) {
    if (!entity) return

    setSaving(true)
    setError('')

    try {
      await createRow(entity, row)
      const data = await fetchData(entity)
      setRows(data.rows ?? [])
    } catch (err) {
      setError(getMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <header className="page-header">
        <div>
          <p className="eyebrow">Runtime view</p>
          <h1>Dynamic view</h1>
          <p className="subtitle">Render a form and table from the selected entity.</p>
        </div>
      </header>

      <div className="button-row">
        <button type="button" className="button secondary" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>

      {error ? <p className="field-error">{error}</p> : null}
      {loading || !schema ? (
        <p className="help-text">Loading entity and records…</p>
      ) : (
        <>
          <DynamicForm
            title={`Create ${schema.name}`}
            fields={schema.fields}
            onSubmit={handleCreate}
            isSubmitting={saving}
            error={error}
          />
          <DataTable entityName={schema.name} fields={schema.fields} rows={rows} loading={loading} />
        </>
      )}
    </div>
  )
}
