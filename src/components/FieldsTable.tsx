import type { EntityField } from "../types";

type FieldsTableProps = {
  fields: EntityField[];
};

export default function FieldsTable({ fields }: FieldsTableProps) {
  if (fields.length === 0) {
    return (
      <p className="empty-state">
        No fields have been defined for this entity yet.
      </p>
    );
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        {fields.map((field) => (
          <tr key={field.id}>
            <td>{field.name}</td>
            <td>{field.type}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
