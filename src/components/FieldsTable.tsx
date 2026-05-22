import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import {
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { EntityField } from "../types";
import { FIELD_TYPE_LABELS, getValidationLabels } from "../utils/fieldMetadata";
import ConfirmActionButton from "./ConfirmActionButton";
import EmptyState from "./EmptyState";

type FieldsTableProps = {
  fields: EntityField[];
  isDeleting: boolean;
  onDelete: (field: EntityField) => Promise<void>;
};

function renderValidationSummary(field: EntityField) {
  const validationLabels = getValidationLabels(field);

  return validationLabels.length > 0 ? (
    <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
      {validationLabels.map((label) => (
        <Chip key={label} label={label} size="small" />
      ))}
    </Stack>
  ) : (
    <Typography color="text.secondary">Sin validaciones</Typography>
  );
}

export default function FieldsTable({
  fields,
  isDeleting,
  onDelete,
}: FieldsTableProps) {
  if (fields.length === 0) {
    return (
      <EmptyState description="Aún no se han definido campos para esta entidad." />
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Validaciones</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fields.map((field) => (
            <TableRow key={field.id} hover>
              <TableCell>
                <Typography sx={{ fontWeight: 800 }}>{field.name}</Typography>
              </TableCell>
              <TableCell>
                <Chip
                  color="primary"
                  label={FIELD_TYPE_LABELS[field.type]}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              <TableCell>{renderValidationSummary(field)}</TableCell>
              <TableCell align="right">
                <ConfirmActionButton
                  description="Este campo se eliminará de la entidad y también de la tabla física generada."
                  icon={<DeleteOutlined />}
                  isLoading={isDeleting}
                  label="Eliminar"
                  title="Eliminar campo"
                  onConfirm={() => onDelete(field)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
