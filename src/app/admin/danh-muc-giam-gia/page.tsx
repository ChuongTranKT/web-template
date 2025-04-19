"use client"
import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { setAdditional } from "@/store/slices/additionalServicesSlice"
import {
  APICreateNewAdditional,
  APIGetAllAdditional,
  APIUpdateAdditional,
  APIDeleteAdditional,
} from "@/services/additionalServices"
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material"
import { Edit, Delete } from "@mui/icons-material"

export default function CmsAdditionalPage() {
  const dispatch = useDispatch()
  const additional =
    useSelector((state: RootState) => state.additional.additional) || []
  const [openDialog, setOpenDialog] = useState(false)
  const [currentService, setCurrentService] = useState({
    _id: "",
    service_name: "",
    description: "",
  })
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null)

  useEffect(() => {
    const fetchAllAdditional = async () => {
      try {
        const response = await APIGetAllAdditional()
        if (response && response.data) {
          dispatch(setAdditional(response.data))
        }
      } catch (error) {
        console.error("Failed to fetch additional services:", error)
      }
    }
    fetchAllAdditional()
  }, [dispatch])

  const handleOpenDialog = (
    service = { _id: "", service_name: "", description: "" }
  ) => {
    setCurrentService(service)
    setIsEditing(!!service._id)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setCurrentService({ _id: "", service_name: "", description: "" })
  }

  const handleSaveService = async () => {
    try {
      if (isEditing) {
        await APIUpdateAdditional(
          {
            service_name: currentService.service_name,
            description: currentService.description,
          },
          currentService._id
        )
        setSnackbarMessage("Dịch vụ đã được cập nhật thành công!")
      } else {
        await APICreateNewAdditional({
          service_name: currentService.service_name,
          description: currentService.description,
        })
        setSnackbarMessage("Dịch vụ đã được thêm thành công!")
      }
      setSnackbarOpen(true)
      handleCloseDialog()
      const response = await APIGetAllAdditional()
      if (response && response.data) {
        dispatch(setAdditional(response.data))
      }
    } catch (error) {
      console.error("Error saving service:", error)
    }
  }

  const handleOpenDeleteDialog = (id: string) => {
    setServiceToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setServiceToDelete(null)
  }

  const handleConfirmDelete = async () => {
    if (serviceToDelete) {
      try {
        await APIDeleteAdditional(serviceToDelete)
        setSnackbarMessage("Dịch vụ đã được xóa thành công!")
        setSnackbarOpen(true)
        handleCloseDeleteDialog()
        const response = await APIGetAllAdditional()
        if (response && response.data) {
          dispatch(setAdditional(response.data))
        }
      } catch (error) {
        console.error("Error deleting service:", error)
      }
    }
  }

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenDialog()}
      >
        Thêm dịch vụ
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Tên dịch vụ</TableCell>
            <TableCell>Mô tả</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {additional.map((service, index) => (
            <TableRow key={index}>
              <TableCell>{service.service_name}</TableCell>
              <TableCell>{service.description}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleOpenDialog(service)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleOpenDeleteDialog(service._id)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {isEditing ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Tên dịch vụ"
            fullWidth
            value={currentService.service_name}
            onChange={(e) =>
              setCurrentService((prev) => ({
                ...prev,
                service_name: e.target.value,
              }))
            }
            margin="dense"
          />
          <TextField
            label="Mô tả"
            fullWidth
            value={currentService.description}
            onChange={(e) =>
              setCurrentService((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleSaveService} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <p>Bạn có chắc chắn muốn xóa dịch vụ này?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="success">{snackbarMessage}</Alert>
      </Snackbar>
    </div>
  )
}
