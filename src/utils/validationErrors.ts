import type { ValidationError } from "./formValidation";

export function groupValidationErrors(errors: ValidationError[]) {
  return errors.reduce<Record<string, string[]>>((groupedErrors, error) => {
    groupedErrors[error.name] = [
      ...(groupedErrors[error.name] ?? []),
      error.message,
    ];
    return groupedErrors;
  }, {});
}

export function getFieldError(
  errorsByField: Record<string, string[]>,
  fieldName: string,
) {
  return errorsByField[fieldName]?.[0] ?? "";
}
