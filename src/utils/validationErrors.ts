import type { FormInstance } from "antd";
import type { ValidationError } from "./formValidation";

type FormFieldName<TValues extends object> = Extract<keyof TValues, string>;

export function groupValidationErrors(errors: ValidationError[]) {
  return errors.reduce<Record<string, string[]>>((groupedErrors, error) => {
    groupedErrors[error.name] = [
      ...(groupedErrors[error.name] ?? []),
      error.message,
    ];
    return groupedErrors;
  }, {});
}

export function applyValidationErrorsToForm<TValues extends object>(
  form: FormInstance<TValues>,
  fieldNames: FormFieldName<TValues>[],
  errors: ValidationError[],
) {
  const errorsByField = groupValidationErrors(errors);
  const formFields = fieldNames.map((fieldName) => ({
    errors: errorsByField[fieldName] ?? [],
    name: fieldName,
  })) as Parameters<FormInstance<TValues>["setFields"]>[0];

  form.setFields(formFields);
}
