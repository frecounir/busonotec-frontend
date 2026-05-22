import CloseOutlined from "@mui/icons-material/CloseOutlined";
import HelpOutlineOutlined from "@mui/icons-material/HelpOutlineOutlined";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";

export type GuideStep = {
  description: string;
  target: () => HTMLElement | null;
  title: string;
};

type PageGuideProps = {
  steps: GuideStep[];
};

export default function PageGuide({ steps }: PageGuideProps) {
  const guideButtonRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const currentStep = steps[currentStepIndex];

  const getStepAnchor = (stepIndex: number) =>
    steps[stepIndex]?.target() ?? guideButtonRef.current;

  const openGuide = () => {
    setCurrentStepIndex(0);
    setAnchorElement(getStepAnchor(0));
    setIsOpen(true);
  };

  const closeGuide = () => setIsOpen(false);

  const goToPreviousStep = () => {
    const nextStepIndex = Math.max(0, currentStepIndex - 1);
    setCurrentStepIndex(nextStepIndex);
    setAnchorElement(getStepAnchor(nextStepIndex));
  };

  const goToNextStep = () => {
    const nextStepIndex = Math.min(steps.length - 1, currentStepIndex + 1);
    setCurrentStepIndex(nextStepIndex);
    setAnchorElement(getStepAnchor(nextStepIndex));
  };

  return (
    <>
      <Button
        ref={guideButtonRef}
        startIcon={<HelpOutlineOutlined />}
        variant="outlined"
        onClick={openGuide}
      >
        Ver guía
      </Button>

      <Popover
        anchorEl={anchorElement}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
        open={isOpen}
        onClose={closeGuide}
        transformOrigin={{ horizontal: "center", vertical: "top" }}
      >
        <Paper sx={{ maxWidth: 380, p: 2.5 }}>
          <Stack sx={{ gap: 2 }}>
            <Stack direction="row" sx={{ alignItems: "flex-start", gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography color="text.secondary" sx={{ fontWeight: 800 }}>
                  Paso {currentStepIndex + 1} de {steps.length}
                </Typography>
                <Typography variant="h3">{currentStep?.title}</Typography>
              </Box>
              <IconButton aria-label="Cerrar guía" onClick={closeGuide}>
                <CloseOutlined />
              </IconButton>
            </Stack>

            <Typography color="text.secondary">
              {currentStep?.description}
            </Typography>

            <Stack
              direction="row"
              sx={{ gap: 1, justifyContent: "space-between" }}
            >
              <Button
                disabled={currentStepIndex === 0}
                onClick={goToPreviousStep}
              >
                Anterior
              </Button>
              {currentStepIndex === steps.length - 1 ? (
                <Button variant="contained" onClick={closeGuide}>
                  Finalizar
                </Button>
              ) : (
                <Button variant="contained" onClick={goToNextStep}>
                  Siguiente
                </Button>
              )}
            </Stack>
          </Stack>
        </Paper>
      </Popover>
    </>
  );
}
