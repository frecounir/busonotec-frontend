import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import {
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { EntityField, EntityRecord } from "../types";
import {
  formatRecordValue,
  getRecordFieldValue,
  isEmptyRecordValue,
} from "../utils/recordValues";
import ConfirmActionButton from "./ConfirmActionButton";
import EmptyState from "./EmptyState";

type EntityRecordsTableProps = {
  fields: EntityField[];
  isDeleting: boolean;
  onDelete: (record: EntityRecord) => Promise<void>;
  onEdit: (record: EntityRecord) => void;
  records: EntityRecord[];
};

export default function EntityRecordsTable({
  fields,
  isDeleting,
  onDelete,
  onEdit,
  records,
}: EntityRecordsTableProps) {
  if (records.length === 0) {
    return (
      <EmptyState description="Aún no se han insertado registros para esta entidad." />
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {fields.map((field) => (
              <TableCell key={field.id}>{field.name}</TableCell>
            ))}
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id} hover>
              {fields.map((field) => {
                const value = getRecordFieldValue(record, field.name);

                return (
                  <TableCell key={field.id}>
                    {isEmptyRecordValue(value) ? (
                      <Typography color="text.secondary">Vacío</Typography>
                    ) : (
                      formatRecordValue(value)
                    )}
                  </TableCell>
                );
              })}
              <TableCell align="right">
                <Stack
                  direction="row"
                  sx={{ gap: 1, justifyContent: "flex-end" }}
                >
                  <Button
                    startIcon={<EditOutlined />}
                    variant="outlined"
                    onClick={() => onEdit(record)}
                  >
                    Actualizar
                  </Button>
                  <ConfirmActionButton
                    description="Este registro se eliminará de los datos de la entidad."
                    icon={<DeleteOutlined />}
                    isLoading={isDeleting}
                    label="Eliminar"
                    title="Eliminar registro"
                    onConfirm={() => onDelete(record)}
                  />
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
