import { useState } from "react";
import type { FormEvent } from "react";
import type { CreateEntityInput } from "../services/entityService";

type EntityFormProps = {
  isSubmitting: boolean;
  onCreate: (data: CreateEntityInput) => Promise<void>;
};

export default function EntityForm({
  isSubmitting,
  onCreate,
}: EntityFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onCreate({
      name: name.trim(),
      description: description.trim() || undefined,
    });
    setName("");
    setDescription("");
  };

  return (
    <form className="form-card" onSubmit={submit}>
      <div className="form-row">
        <label htmlFor="entity-name">Name</label>
        <input
          id="entity-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Customer"
          required
        />
      </div>
      <div className="form-row">
        <label htmlFor="entity-description">Description</label>
        <input
          id="entity-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Represents a business customer"
        />
      </div>
      <button disabled={isSubmitting} type="submit">
        {isSubmitting ? "Creating..." : "Create Entity"}
      </button>
    </form>
  );
}
