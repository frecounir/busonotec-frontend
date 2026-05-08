import { useState } from "react";
import type { FormEvent } from "react";
import type { CreateFieldInput } from "../services/fieldService";

type FieldFormProps = {
  isSubmitting: boolean;
  onCreate: (data: Omit<CreateFieldInput, "businessEntityId">) => Promise<void>;
};

const fieldTypes = ["string", "number", "boolean", "date"];

export default function FieldForm({ isSubmitting, onCreate }: FieldFormProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState("string");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onCreate({ name: name.trim(), type });
    setName("");
  };

  return (
    <form className="form-card compact" onSubmit={submit}>
      <div className="form-row">
        <label htmlFor="field-name">Name</label>
        <input
          id="field-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="email"
          required
        />
      </div>
      <div className="form-row">
        <label htmlFor="field-type">Type</label>
        <select
          id="field-type"
          value={type}
          onChange={(event) => setType(event.target.value)}
        >
          {fieldTypes.map((fieldType) => (
            <option key={fieldType} value={fieldType}>
              {fieldType}
            </option>
          ))}
        </select>
      </div>
      <button disabled={isSubmitting} type="submit">
        {isSubmitting ? "Adding..." : "Add Field"}
      </button>
    </form>
  );
}
