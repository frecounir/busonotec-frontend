import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { Field, FieldType } from '../types'

type FieldFormProps = {
  initialField?: Field
  loading: boolean
  error?: string
  onSave: (field: Omit<Field, 'id'>) => void
  onCancel?: () => void
}

const fieldTypes: FieldType[] = ['string', 'number', 'boolean', 'date']

export function FieldForm({ initialField, loading, error, onSave, onCancel }: FieldFormProps) {
  const [name, setName] = useState(initialField?.name ?? '')
  const [label, setLabel] = useState(initialField?.label ?? '')
  const [type, setType] = useState<FieldType>(initialField?.type ?? 'string')
  const [required, setRequired] = useState(initialField?.required ?? false)
  const [placeholder, setPlaceholder] = useState(initialField?.placeholder ?? '')

  useEffect(() => {
    setName(initialField?.name ?? '')
    setLabel(initialField?.label ?? '')
    setType(initialField?.type ?? 'string')
    setRequired(initialField?.required ?? false)
    setPlaceholder(initialField?.placeholder ?? '')
  }, [initialField])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSave({ name, label, type, required, placeholder })
  }

  return (
    <section className="card">
      <h2>{initialField ? 'Edit field' : 'Add field'}</h2>
      <form onSubmit={handleSubmit}>
        <label className="field-label" htmlFor="field-name">
          Field name
        </label>
        <input
          id="field-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="field-input"
          placeholder="sku"
          disabled={loading}
          required
        />

        <label className="field-label" htmlFor="field-label">
          Label
        </label>
        <input
          id="field-label"
          value={label}
          onChange={(event) => setLabel(event.target.value)}
          className="field-input"
          placeholder="SKU"
          disabled={loading}
          required
        />

        <label className="field-label" htmlFor="field-type">
          Type
        </label>
        <select
          id="field-type"
          value={type}
          onChange={(event) => setType(event.target.value as FieldType)}
          className="field-input"
          disabled={loading}
        >
          {fieldTypes.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <label className="field-label" htmlFor="field-placeholder">
          Placeholder
        </label>
        <input
          id="field-placeholder"
          value={placeholder}
          onChange={(event) => setPlaceholder(event.target.value)}
          className="field-input"
          placeholder="Enter helper text"
          disabled={loading}
        />

        <label className="checkbox-field">
          <input
            type="checkbox"
            checked={required}
            onChange={(event) => setRequired(event.target.checked)}
            disabled={loading}
          />
          Required
        </label>

        {error ? <p className="field-error">{error}</p> : null}

        <div className="button-row">
          <button type="submit" className="button primary" disabled={loading}>
            {loading ? 'Saving...' : initialField ? 'Update field' : 'Add field'}
          </button>
          {onCancel ? (
            <button type="button" className="button secondary" onClick={onCancel} disabled={loading}>
              Cancel
            </button>
          ) : null}
        </div>
      </form>
    </section>
  )
}
