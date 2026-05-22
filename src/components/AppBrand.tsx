import { Box, Typography } from "@mui/material";

export default function AppBrand() {
  return (
    <Box className="brand">
      <Box className="brand-mark">LC</Box>
      <Box>
        <Typography className="brand-label">Tesis de maestría</Typography>
        <Typography variant="h3" className="brand-title">
          Plataforma Low Code
        </Typography>
      </Box>
    </Box>
  );
}
