import React, { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material"

interface CompressImageDialogProps {
  open: boolean
  message: string
  onClose: () => void
  onConfirm: (quality: number) => void
}

const CompressImageDialog: React.FC<CompressImageDialogProps> = ({
  open,
  message,
  onClose,
  onConfirm,
}) => {
  const [quality, setQuality] = useState<number>(80)

  const handleQualityChange = (event: SelectChangeEvent<number>) => {
    setQuality(event.target.value as number)
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Xác nhận nén ảnh</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Chất lượng nén</InputLabel>
          <Select
            value={quality}
            label="Chất lượng nén"
            onChange={handleQualityChange}
          >
            <MenuItem value={90}>Cao (90%)</MenuItem>
            <MenuItem value={80}>Trung bình (80%)</MenuItem>
            <MenuItem value={60}>Thấp (60%)</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Hủy
        </Button>
        <Button onClick={() => onConfirm(quality)} color="primary">
          Nén ảnh
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CompressImageDialog
