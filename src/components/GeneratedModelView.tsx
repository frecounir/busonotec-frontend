import type { AIModelResponse } from '../types'

type GeneratedModelViewProps = {
  model: AIModelResponse
}

export function GeneratedModelView({ model }: GeneratedModelViewProps) {
  return (
    <section className="card">
      <h2>AI model preview</h2>
      <p className="help-text">Review the generated entity and fields before saving or editing.</p>
      <div className="model-block">
        <p className="model-label">Entity name</p>
        <pre>{model.entity}</pre>
      </div>
      <div className="model-block">
        <p className="model-label">Model text</p>
        <pre>{model.model}</pre>
      </div>
      {model.description ? (
        <div className="model-block">
          <p className="model-label">Description</p>
          <p>{model.description}</p>
        </div>
      ) : null}
      {model.fields ? (
        <div className="model-block">
          <p className="model-label">Fields</p>
          <ul>
            {model.fields.map((field) => (
              <li key={field.name}>
                {field.name} ({field.type}){field.required ? ' • required' : ''}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  )
}
