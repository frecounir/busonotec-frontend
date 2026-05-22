import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
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
import { Link as RouterLink } from "react-router-dom";
import type { BusinessEntity } from "../types";
import ConfirmActionButton from "./ConfirmActionButton";
import EmptyState from "./EmptyState";

type EntitiesTableProps = {
  deletingEntityId?: string | null;
  entities: BusinessEntity[];
  onDelete: (entity: BusinessEntity) => Promise<void>;
};

export default function EntitiesTable({
  deletingEntityId,
  entities,
  onDelete,
}: EntitiesTableProps) {
  if (entities.length === 0) {
    return (
      <EmptyState description="Aún no se han creado entidades de negocio." />
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {entities.map((entity) => (
            <TableRow key={entity.id} hover>
              <TableCell>
                <Typography sx={{ fontWeight: 800 }}>{entity.name}</Typography>
              </TableCell>
              <TableCell>
                {entity.description || (
                  <Typography color="text.secondary">
                    Sin descripción
                  </Typography>
                )}
              </TableCell>
              <TableCell align="right">
                <Stack
                  direction="row"
                  sx={{ gap: 1, justifyContent: "flex-end" }}
                >
                  <Button
                    component={RouterLink}
                    startIcon={<SettingsOutlined />}
                    to={`/entities/${entity.id}`}
                    variant="contained"
                  >
                    Gestionar
                  </Button>
                  <ConfirmActionButton
                    description="Se eliminará la entidad, sus campos y su tabla física."
                    icon={<DeleteOutlined />}
                    isLoading={deletingEntityId === entity.id}
                    label="Eliminar"
                    title="Eliminar entidad"
                    onConfirm={() => onDelete(entity)}
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
