import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { Field } from '../types'

type DynamicFormProps = {
  title?: string
  fields: Field[]
  onSubmit: (row: Record<string, unknown>) => void
  isSubmitting: boolean
  error?: string
}

function initialValues(fields: Field[]) {
  return fields.reduce<Record<string, unknown>>((acc, field) => {
    if (field.type === 'boolean') {
      acc[field.name] = false
    } else {
      acc[field.name] = ''
    }
    return acc
  }, {})
}

export function DynamicForm({ title, fields, onSubmit, isSubmitting, error }: DynamicFormProps) {
  const [values, setValues] = useState<Record<string, unknown>>(initialValues(fields))

  useEffect(() => {
    setValues(initialValues(fields))
  }, [fields])

  function handleChange(name: string, value: string | boolean) {
    setValues((current) => ({ ...current, [name]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalized = fields.reduce<Record<string, unknown>>((acc, field) => {
      const raw = values[field.name]
      if (field.type === 'number') {
        const parsed = Number(raw)
        acc[field.name] = Number.isNaN(parsed) ? raw : parsed
      } else if (field.type === 'boolean') {
        acc[field.name] = Boolean(raw)
      } else {
        acc[field.name] = raw
      }
      return acc
    }, {})

    onSubmit(normalized)
  }

  if (fields.length === 0) {
    return (
      <section className="card">
        <h2>{title ?? 'Dynamic form'}</h2>
        <p className="help-text">This entity has no fields yet.</p>
      </section>
    )
  }

  return (
    <section className="card">
      <h2>{title ?? 'Dynamic form'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {fields.map((field) => {
            const value = values[field.name] ?? ''
            const id = `field-${field.name}`
            const label = field.label || field.name

            return (
              <div className="form-field" key={field.id}>
                {field.type !== 'boolean' ? (
                  <label className="field-label" htmlFor={id}>
                    {label}
                  </label>
                ) : null}
                {field.type === 'boolean' ? (
                  <label className="checkbox-field" htmlFor={id}>
                    <input
                      id={id}
                      type="checkbox"
                      checked={Boolean(value)}
                      disabled={isSubmitting}
                      onChange={(event) => handleChange(field.name, event.target.checked)}
                    />
                    {label}
                  </label>
                ) : (
                  <input
                    id={id}
                    type={field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text'}
                    value={String(value)}
                    placeholder={field.placeholder ?? ''}
                    required={field.required}
                    disabled={isSubmitting}
                    className="field-input"
                    onChange={(event) => handleChange(field.name, event.target.value)}
                  />
                )}
              </div>
            )
          })}
        </div>
        {error ? <p className="field-error">{error}</p> : null}
        <button type="submit" className="button primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Create record'}
        </button>
      </form>
    </section>
  )
}
