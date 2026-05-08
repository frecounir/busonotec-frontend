import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BusinessEntitiesPage from "./pages/BusinessEntitiesPage";
import BusinessEntityDetailPage from "./pages/BusinessEntityDetailPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <aside className="sidebar">
          <div>
            <p className="sidebar-label">Master's thesis</p>
            <h1 className="sidebar-title">Low-Code Platform</h1>
          </div>
          <nav aria-label="Main navigation">
            <ul className="sidebar-nav">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/entities"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  Business Entities
                </NavLink>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/entities" element={<BusinessEntitiesPage />} />
            <Route
              path="/entities/:id"
              element={<BusinessEntityDetailPage />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
