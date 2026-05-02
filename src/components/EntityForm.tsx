import type { FormEvent } from 'react'

type EntityFormProps = {
  name: string
  description: string
  loading: boolean
  error?: string
  isEditing?: boolean
  onNameChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onCancel?: () => void
}

export function EntityForm({
  name,
  description,
  loading,
  error,
  isEditing,
  onNameChange,
  onDescriptionChange,
  onSubmit,
  onCancel,
}: EntityFormProps) {
  return (
    <section className="card">
      <h2>{isEditing ? 'Edit entity' : 'Create entity'}</h2>
      <form onSubmit={onSubmit}>
        <label className="field-label" htmlFor="entity-name">
          Name
        </label>
        <input
          id="entity-name"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          className="field-input"
          placeholder="Product"
          disabled={loading}
          required
        />

        <label className="field-label" htmlFor="entity-description">
          Description
        </label>
        <textarea
          id="entity-description"
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
          className="field-input"
          placeholder="Optional description"
          rows={4}
          disabled={loading}
        />

        {error ? <p className="field-error">{error}</p> : null}

        <div className="button-row">
          <button type="submit" className="button primary" disabled={loading}>
            {loading ? (isEditing ? 'Saving...' : 'Creating...') : isEditing ? 'Save changes' : 'Create entity'}
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
