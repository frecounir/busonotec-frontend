import { useState } from 'react'
import type { FormEvent } from 'react'
import { generateModel, createSchema } from '../services/aiService'
import type { AIModelResponse } from '../types'
import { GeneratedModelView } from '../components/GeneratedModelView'

function getMessage(error: unknown) {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'Unexpected error'
}

export function AIPage() {
  const [prompt, setPrompt] = useState('')
  const [model, setModel] = useState<AIModelResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleGenerate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setModel(null)

    if (!prompt.trim()) {
      setError('Prompt cannot be empty.')
      return
    }

    setLoading(true)

    try {
      const response = await generateModel(prompt.trim())
      setModel(response)
    } catch (err) {
      setError(getMessage(err))
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateSchema() {
    if (!prompt.trim()) {
      setError('Prompt cannot be empty.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await createSchema(prompt.trim())
      setModel(response)
    } catch (err) {
      setError(getMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <header className="page-header">
        <div>
          <p className="eyebrow">AI assistant</p>
          <h1>Optional AI workflow</h1>
          <p className="subtitle">Generate an entity model automatically, then review and save manually.</p>
        </div>
      </header>

      <section className="card">
        <h2>Describe the entity</h2>
        <form onSubmit={handleGenerate}>
          <label className="field-label" htmlFor="ai-prompt">
            Prompt
          </label>
          <textarea
            id="ai-prompt"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            className="field-input"
            rows={4}
            placeholder="Create an invoice entity with customer, amount, and due date"
            disabled={loading}
          />
          {error ? <p className="field-error">{error}</p> : null}
          <div className="button-row">
            <button type="submit" className="button primary" disabled={loading}>
              {loading ? 'Generating...' : 'Generate model'}
            </button>
            <button type="button" className="button secondary" onClick={handleCreateSchema} disabled={loading}>
              Use schema endpoint
            </button>
          </div>
        </form>
      </section>

      {model ? <GeneratedModelView model={model} /> : null}
    </div>
  )
}
