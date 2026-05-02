import type { Entity } from '../types'

type EntityListProps = {
  entities: Entity[]
  selectedId?: string
  onSelect: (id: string) => void
  onEdit: (entity: Entity) => void
  onDelete: (id: string) => void
}

export function EntityList({ entities, selectedId, onSelect, onEdit, onDelete }: EntityListProps) {
  return (
    <section className="card">
      <h2>Entities</h2>
      {entities.length === 0 ? (
        <p className="help-text">No entities yet. Create one to start working.</p>
      ) : (
        <div className="entity-list">
          {entities.map((entity) => (
            <div key={entity.id} className={`entity-item ${selectedId === entity.id ? 'entity-item-selected' : ''}`}>
              <button type="button" className="button-link" onClick={() => onSelect(entity.id)}>
                <strong>{entity.name}</strong>
                <p className="help-text">{entity.description ?? 'No description'}</p>
              </button>
              <div className="button-row">
                <button type="button" className="button secondary" onClick={() => onEdit(entity)}>
                  Edit
                </button>
                <button type="button" className="button secondary" onClick={() => onDelete(entity.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
