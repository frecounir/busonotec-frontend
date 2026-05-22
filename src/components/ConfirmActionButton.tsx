import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { type ReactNode, useState } from "react";

type ConfirmActionButtonProps = {
  color?: "error" | "primary";
  description: string;
  icon?: ReactNode;
  isLoading?: boolean;
  label: string;
  onConfirm: () => Promise<void> | void;
  title: string;
};

export default function ConfirmActionButton({
  color = "error",
  description,
  icon,
  isLoading = false,
  label,
  onConfirm,
  title,
}: ConfirmActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = async () => {
    await onConfirm();
    setIsOpen(false);
  };

  return (
    <>
      <Button
        color={color}
        startIcon={icon}
        variant="outlined"
        onClick={() => setIsOpen(true)}
      >
        {label}
      </Button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{description}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button disabled={isLoading} onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button
            color={color}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={16} /> : undefined}
            variant="contained"
            onClick={handleConfirm}
          >
            {label}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
