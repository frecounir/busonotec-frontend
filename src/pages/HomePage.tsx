import AccountTreeOutlined from "@mui/icons-material/AccountTreeOutlined";
import AutoAwesomeOutlined from "@mui/icons-material/AutoAwesomeOutlined";
import ViewModuleOutlined from "@mui/icons-material/ViewModuleOutlined";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import { useRef } from "react";
import MetricCard from "../components/MetricCard";
import PageGuide, { type GuideStep } from "../components/PageGuide";

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const steps: GuideStep[] = [
    {
      title: "Propósito de la plataforma",
      description:
        "Esta pantalla presenta la idea general del sistema. En lugar de pedirle a una persona que programe una pantalla desde cero, la plataforma permite describir qué información necesita manejar el negocio y luego usa esa configuración para construir partes de la aplicación.",
      target: () => heroRef.current,
    },
    {
      title: "Ejemplo concreto",
      description:
        "Por ejemplo, si una institución quiere manejar estudiantes, primero crea la entidad Estudiantes. Después define qué datos quiere guardar, como nombre, correo y puntaje. Con esa información, el sistema puede habilitar una pantalla para registrar y consultar estudiantes.",
      target: () => metricsRef.current,
    },
  ];

  return (
    <section className="page-stack">
      <Box ref={heroRef}>
        <Card className="hero-card">
          <CardContent>
            <Stack direction="row" sx={{ alignItems: "flex-start", gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography color="text.secondary" sx={{ fontWeight: 800 }}>
                  Generación dinámica de backend
                </Typography>
                <Typography variant="h1">
                  Plataforma Low Code para entidades de negocio
                </Typography>
              </Box>
              <PageGuide steps={steps} />
            </Stack>

            <Typography className="lead" sx={{ mt: 2 }}>
              Este sistema permite crear entidades de negocio de forma dinámica
              y definir su estructura mediante campos, facilitando la generación
              automática de esquemas de backend y componentes de interfaz de
              usuario.
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1.5 }}>
              La aplicación adopta un enfoque guiado por configuración para
              modelar conceptos del negocio, aportando una base frontend clara
              para el contexto investigativo de la tesis de maestría.
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box ref={metricsRef} className="stats-grid">
        <MetricCard
          icon={<AccountTreeOutlined color="primary" />}
          label="Modelado de entidades"
          value="Dinámico"
        />
        <MetricCard
          icon={<AutoAwesomeOutlined color="primary" />}
          label="Generación de esquemas"
          value="Automatizada"
        />
        <MetricCard
          icon={<ViewModuleOutlined color="primary" />}
          label="Módulos generados"
          value="Configurables"
        />
      </Box>
    </section>
  );
}
