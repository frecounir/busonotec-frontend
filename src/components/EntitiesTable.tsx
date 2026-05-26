import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import {
  Button,
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
import { Link as RouterLink } from "react-router-dom";
import type { RelationshipReferencesByEntityId } from "../services/businessEntityConfigurationService";
import type { BusinessEntity } from "../types";
import ConfirmActionButton from "./ConfirmActionButton";
import EmptyState from "./EmptyState";

type EntitiesTableProps = {
  deletingEntityId?: string | null;
  entities: BusinessEntity[];
  relationshipReferencesByEntityId: RelationshipReferencesByEntityId;
  onDelete: (entity: BusinessEntity) => Promise<void>;
};

function getDeleteDescription(
  entity: BusinessEntity,
  relationshipReferencesByEntityId: RelationshipReferencesByEntityId,
) {
  const references = relationshipReferencesByEntityId[entity.id] ?? [];

  if (references.length === 0) {
    return "Se eliminará la entidad, sus campos y su tabla física.";
  }

  const relationshipNames = references
    .map(
      (reference) => `${reference.sourceEntity.name}.${reference.field.name}`,
    )
    .join(", ");

  return `Se eliminará la entidad, sus campos, su tabla física y ${references.length} campo(s) de relación que la referencian: ${relationshipNames}.`;
}

export default function EntitiesTable({
  deletingEntityId,
  entities,
  relationshipReferencesByEntityId,
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
          {entities.map((entity) => {
            const relationshipReferenceCount =
              relationshipReferencesByEntityId[entity.id]?.length ?? 0;

            return (
              <TableRow key={entity.id} hover>
                <TableCell>
                  <Typography sx={{ fontWeight: 800 }}>
                    {entity.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Stack sx={{ gap: 1, alignItems: "flex-start" }}>
                    {entity.description || (
                      <Typography color="text.secondary">
                        Sin descripción
                      </Typography>
                    )}
                    {relationshipReferenceCount > 0 && (
                      <Chip
                        color="warning"
                        label={`${relationshipReferenceCount} relación(es) entrante(s)`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Stack>
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
                      description={getDeleteDescription(
                        entity,
                        relationshipReferencesByEntityId,
                      )}
                      icon={<DeleteOutlined />}
                      isLoading={deletingEntityId === entity.id}
                      label="Eliminar"
                      title="Eliminar entidad"
                      onConfirm={() => onDelete(entity)}
                    />
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
