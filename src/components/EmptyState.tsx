import InfoOutlined from "@mui/icons-material/InfoOutlined";
import { Box, Stack, Typography } from "@mui/material";

type EmptyStateProps = {
  description: string;
};

export default function EmptyState({ description }: EmptyStateProps) {
  return (
    <Box sx={{ display: "grid", minHeight: 160, placeItems: "center", p: 2 }}>
      <Stack sx={{ alignItems: "center", gap: 1, textAlign: "center" }}>
        <InfoOutlined color="primary" />
        <Typography color="text.secondary">{description}</Typography>
      </Stack>
    </Box>
  );
}
