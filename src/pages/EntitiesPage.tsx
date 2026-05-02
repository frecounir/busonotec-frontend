import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { EntityList } from '../components/EntityList'
import { EntityForm } from '../components/EntityForm'
import { fetchEntities, createEntity, updateEntity, deleteEntity } from '../services/entityService'
import type { Entity } from '../types'

function getMessage(error: unknown) {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'Unexpected error'
}

export function EntitiesPage() {
  const [entities, setEntities] = useState<Entity[]>([])
  const [selectedId, setSelectedId] = useState<string>()
  const [editingEntity, setEditingEntity] = useState<Entity | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function loadEntities() {
    setLoading(true)
    setError('')

    try {
      const response = await fetchEntities()
      setEntities(response)
      if (!selectedId && response.length > 0) {
        setSelectedId(response[0].id)
      }
    } catch (err) {
      setError(getMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadEntities()
  }, [])

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Entity name is required.')
      return
    }

    setSaving(true)

    try {
      if (editingEntity) {
        const updated = await updateEntity(editingEntity.id, {
          name: name.trim(),
          description: description.trim(),
        })
        setEntities((current) => current.map((item) => (item.id === updated.id ? updated : item)))
        setEditingEntity(null)
      } else {
        const created = await createEntity({ name: name.trim(), description: description.trim() })
        setEntities((current) => [created, ...current])
        setSelectedId(created.id)
      }
      setName('')
      setDescription('')
    } catch (err) {
      setError(getMessage(err))
    } finally {
      setSaving(false)
    }
  }

  async function handleEdit(entity: Entity) {
    setEditingEntity(entity)
    setName(entity.name)
    setDescription(entity.description ?? '')
  }

  async function handleDelete(entityId: string) {
    setSaving(true)
    setError('')

    try {
      await deleteEntity(entityId)
      setEntities((current) => current.filter((item) => item.id !== entityId))
      if (selectedId === entityId) {
        setSelectedId(undefined)
      }
    } catch (err) {
      setError(getMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const selectedEntity = entities.find((entity) => entity.id === selectedId)

  return (
    <div>
      <header className="page-header">
        <div>
          <p className="eyebrow">Entity management</p>
          <h1>Entities</h1>
          <p className="subtitle">Create entities, manage schema metadata, and move to field configuration.</p>
        </div>
      </header>

      <div className="grid-two-column">
        <EntityList
          entities={entities}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <EntityForm
          name={name}
          description={description}
          loading={saving}
          error={error}
          isEditing={Boolean(editingEntity)}
          onNameChange={setName}
          onDescriptionChange={setDescription}
          onSubmit={handleSave}
          onCancel={() => {
            setEditingEntity(null)
            setName('')
            setDescription('')
            setError('')
          }}
        />
      </div>

      {selectedEntity ? (
        <section className="card">
          <h2>Selected entity</h2>
          <p className="help-text">Choose a section to continue building the schema or working with data.</p>
          <div className="button-row">
            <Link className="button primary" to={`/entities/${selectedEntity.id}/fields`}>
              Manage fields
            </Link>
            <Link className="button secondary" to={`/views/${selectedEntity.id}`}>
              Open view
            </Link>
          </div>
        </section>
      ) : null}

      {loading ? <p className="help-text">Loading entities…</p> : null}
    </div>
  )
}
