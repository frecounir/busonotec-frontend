import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import { EntitiesPage } from './pages/EntitiesPage'
import { FieldsPage } from './pages/FieldsPage'
import { DynamicViewPage } from './pages/DynamicViewPage'
import { AIPage } from './pages/AIPage'

function App() {
  return (
    <BrowserRouter>
      <main className="app-shell">
        <nav className="site-nav">
          <NavLink to="/entities" className="nav-link">
            Entities
          </NavLink>
          <NavLink to="/ai" className="nav-link">
            AI Assistant
          </NavLink>
        </nav>

        <Routes>
          <Route path="/" element={<EntitiesPage />} />
          <Route path="/entities" element={<EntitiesPage />} />
          <Route path="/entities/:id/fields" element={<FieldsPage />} />
          <Route path="/views/:entity" element={<DynamicViewPage />} />
          <Route path="/ai" element={<AIPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
