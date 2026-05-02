import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FieldForm } from '../components/FieldForm'
import { fetchEntity } from '../services/entityService'
import { createField, updateField, deleteField } from '../services/fieldService'
import type { Entity, Field } from '../types'

function getMessage(error: unknown) {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'Unexpected error'
}

export function FieldsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [entity, setEntity] = useState<Entity | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [activeField, setActiveField] = useState<Field | undefined>()

  useEffect(() => {
    if (!id) {
      return
    }

    setLoading(true)
    setError('')

    fetchEntity(id)
      .then(setEntity)
      .catch((err) => setError(getMessage(err)))
      .finally(() => setLoading(false))
  }, [id])

  async function handleSave(fieldData: Omit<Field, 'id'>) {
    if (!entity) return

    setSaving(true)
    setError('')

    try {
      const saved = activeField
        ? await updateField(entity.id, activeField.id, fieldData)
        : await createField(entity.id, fieldData)
      setEntity((current) => {
        if (!current) return current
        const fields = activeField
          ? current.fields.map((item) => (item.id === saved.id ? saved : item))
          : [...current.fields, saved]
        return { ...current, fields }
      })
      setActiveField(undefined)
    } catch (err) {
      setError(getMessage(err))
    } finally {
      setSaving(false)
    }
  }

  async function handleRemove(fieldId: string) {
    if (!entity) return

    setSaving(true)
    setError('')

    try {
      await deleteField(entity.id, fieldId)
      setEntity((current) => {
        if (!current) return current
        return { ...current, fields: current.fields.filter((item) => item.id !== fieldId) }
      })
    } catch (err) {
      setError(getMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const fields = useMemo(() => entity?.fields ?? [], [entity])

  return (
    <div>
      <header className="page-header">
        <div>
          <p className="eyebrow">Fields</p>
          <h1>Manage fields</h1>
          <p className="subtitle">Add fields to the selected entity and keep records in sync.</p>
        </div>
      </header>

      <div className="button-row">
        <button type="button" className="button secondary" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>

      {error ? <p className="field-error">{error}</p> : null}
      {loading || !entity ? (
        <p className="help-text">Loading entity schema…</p>
      ) : (
        <>
          <section className="card">
            <h2>{entity.name}</h2>
            <p className="help-text">{entity.description ?? 'No description available.'}</p>
          </section>

          <section className="card">
            <h2>Defined fields</h2>
            {fields.length === 0 ? (
              <p className="help-text">No fields configured yet.</p>
            ) : (
              <div className="entity-list">
                {fields.map((field) => (
                  <div key={field.id} className="field-row">
                    <div>
                      <strong>{field.label}</strong>
                      <p className="help-text">{field.name} • {field.type}</p>
                    </div>
                    <div className="button-row">
                      <button type="button" className="button secondary" onClick={() => setActiveField(field)}>
                        Edit
                      </button>
                      <button type="button" className="button secondary" onClick={() => handleRemove(field.id)}>
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <FieldForm
            initialField={activeField}
            loading={saving}
            error={error}
            onSave={handleSave}
            onCancel={() => setActiveField(undefined)}
          />
        </>
      )}
    </div>
  )
}
