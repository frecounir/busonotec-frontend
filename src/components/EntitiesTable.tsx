import { Link } from "react-router-dom";
import type { BusinessEntity } from "../types";

type EntitiesTableProps = {
  entities: BusinessEntity[];
};

export default function EntitiesTable({ entities }: EntitiesTableProps) {
  if (entities.length === 0) {
    return (
      <p className="empty-state">No business entities have been created yet.</p>
    );
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {entities.map((entity) => (
          <tr key={entity.id}>
            <td>{entity.name}</td>
            <td>{entity.description || "No description"}</td>
            <td>
              <Link className="button-link" to={`/entities/${entity.id}`}>
                Manage
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
