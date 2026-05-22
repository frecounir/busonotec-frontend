import { Card, CardContent, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

type MetricCardProps = {
  icon?: ReactNode;
  label: string;
  value: string | number;
};

export default function MetricCard({ icon, label, value }: MetricCardProps) {
  return (
    <Card className="insight-card">
      <CardContent>
        <Stack sx={{ alignItems: "flex-start", gap: 1 }}>
          {icon}
          <Typography color="text.secondary" sx={{ fontWeight: 800 }}>
            {label}
          </Typography>
          <Typography variant="h3">{value}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
