import { Box, CircularProgress, Stack, Typography } from "@mui/material";

type LoadingPanelProps = {
  label: string;
};

export default function LoadingPanel({ label }: LoadingPanelProps) {
  return (
    <Box sx={{ display: "grid", minHeight: 180, placeItems: "center" }}>
      <Stack sx={{ alignItems: "center", gap: 1.5 }}>
        <CircularProgress size={34} />
        <Typography color="text.secondary">{label}</Typography>
      </Stack>
    </Box>
  );
}
