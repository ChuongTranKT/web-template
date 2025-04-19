"use client"
import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { Add, Edit, Delete } from "@mui/icons-material"
import {
  APICreateNewCategory,
  APIGetAllCategory,
  APIUpdateCategory,
  APIDeleteCategory,
} from "@/services/category"
import { setCategory } from "@/store/slices/categorySlice"
import { checkAndCompressImage } from "@/utils/imageCompression"
import CompressImageDialog from "@/components/CompressImageDialog"
import {
  Button,
  TextField,
  Card,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
} from "@mui/material"

// Định nghĩa interface cho đối tượng category có thêm thuộc tính _id
interface CategoryWithId {
  _id: string
  category_name: string
  description: string
  category_image: string
}

export default function CmsCategory() {
  const categories = useSelector((state: RootState) => state.category.category)
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    category_name: "",
    description: "",
    category_image: "",
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false) // Dialog xóa
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null) // Lưu id cần xóa
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  // State for Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  )

  const [openCompressDialog, setOpenCompressDialog] = useState(false)
  const [compressMessage, setCompressMessage] = useState("")
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [compressResolve, setCompressResolve] = useState<
    ((value: { shouldCompress: boolean; quality: number }) => void) | null
  >(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await APIGetAllCategory()
      if (res) dispatch(setCategory(res.data))
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  const handleCompressDialogClose = () => {
    setOpenCompressDialog(false)
    if (compressResolve) {
      compressResolve({ shouldCompress: false, quality: 80 })
      setCompressResolve(null)
    }
  }

  const handleCompressDialogConfirm = (quality: number) => {
    setOpenCompressDialog(false)
    if (compressResolve) {
      compressResolve({ shouldCompress: true, quality })
      setCompressResolve(null)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const { file: processedFile, wasCompressed } =
          await checkAndCompressImage(file, 1, async (message) => {
            setCompressMessage(message)
            setPendingFile(file)
            setOpenCompressDialog(true)
            return new Promise<{ shouldCompress: boolean; quality: number }>(
              (resolve) => {
                setCompressResolve(() => resolve)
              }
            )
          })
        const reader = new FileReader()
        reader.onloadend = () => {
          setFormData({ ...formData, category_image: reader.result as string })
        }
        reader.readAsDataURL(processedFile)
      } catch (error) {
        console.error("Lỗi khi xử lý ảnh:", error)
        setSnackbarMessage(
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi xử lý ảnh!"
        )
        setSnackbarSeverity("error")
        setSnackbarOpen(true)
      }
    }
  }

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await APIUpdateCategory(formData, editingId)
        setSnackbarMessage("Cập nhật danh mục thành công!")
        setSnackbarSeverity("success")
      } else {
        await APICreateNewCategory(formData)
        setSnackbarMessage("Tạo mới danh mục thành công!")
        setSnackbarSeverity("success")
      }
      setFormData({ category_name: "", description: "", category_image: "" })
      setEditingId(null)
      fetchCategories()
      setOpenDialog(false)
    } catch (error) {
      console.error("Error saving category:", error)
      setSnackbarMessage("Có lỗi xảy ra, vui lòng thử lại!")
      setSnackbarSeverity("error")
    } finally {
      setSnackbarOpen(true)
    }
  }

  const handleEdit = (category: unknown) => {
    if (
      typeof category === "object" &&
      category !== null &&
      "category_name" in category &&
      "description" in category &&
      "category_image" in category &&
      "_id" in category
    ) {
      setFormData({
        category_name: String(category.category_name),
        description: String(category.description),
        category_image: String(category.category_image),
      })
      setEditingId(String(category._id))
      setOpenDialog(true)
    }
  }

  const handleDelete = (id: string) => {
    setDeleteCategoryId(id) // Lưu id của danh mục cần xóa
    setOpenDeleteDialog(true) // Mở dialog xóa
  }

  const confirmDelete = async () => {
    if (!deleteCategoryId) return

    try {
      const res = await APIDeleteCategory(deleteCategoryId)
      if (res?.status == 200) {
        setSnackbarMessage("Xóa danh mục thành công!")
        setSnackbarSeverity("success")
      } else {
        setSnackbarMessage("Không thể xóa danh mục đã có sản phẩm!")
        setSnackbarSeverity("error")
      }

      fetchCategories()
      setOpenDeleteDialog(false) // Đóng dialog sau khi xóa
    } catch (error) {
      console.error("Error deleting category:", error)
      setSnackbarMessage("Có lỗi xảy ra khi xóa danh mục!")
      setSnackbarSeverity("error")
      setOpenDeleteDialog(false) // Đóng dialog khi có lỗi
    } finally {
      setSnackbarOpen(true)
    }
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setFormData({
            category_name: "",
            description: "",
            category_image: "",
          })
          setEditingId(null)
          setOpenDialog(true)
        }}
        startIcon={<Add />}
      >
        Thêm mới
      </Button>

      <h3>Danh sách danh mục</h3>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên danh mục</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Ảnh</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((category, index: number) => (
                <TableRow key={`${(category as CategoryWithId)._id}-${index}`}>
                  <TableCell>{category.category_name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    {category.category_image && (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL_IMAGE}${category.category_image}`}
                        alt="img"
                        style={{ width: 50, height: 50 }}
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src =
                            "/fallback-image.jpg" // Ảnh mặc định nếu lỗi
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() =>
                        handleDelete((category as CategoryWithId)._id)
                      }
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={categories.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Dialog Thêm/Sửa */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {editingId ? "Sửa danh mục" : "Thêm mới danh mục"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Tên danh mục"
            fullWidth
            value={formData.category_name}
            onChange={(e) =>
              setFormData({ ...formData, category_name: e.target.value })
            }
            margin="normal"
          />
          <TextField
            label="Mô tả"
            fullWidth
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            margin="normal"
          />
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {formData.category_image && (
            <img
              src={
                formData.category_image.startsWith("data:image")
                  ? formData.category_image
                  : `${process.env.NEXT_PUBLIC_API_URL_IMAGE}${formData.category_image}`
              }
              alt="Category"
              width={100}
              height={100}
              onError={(e) => {
                ;(e.target as HTMLImageElement).src = "/fallback-image.jpg" // Ảnh mặc định nếu lỗi
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {editingId ? "Cập nhật" : "Thêm mới"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Xác nhận Xóa */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Xác nhận xóa danh mục</DialogTitle>
        <DialogContent>Bạn có chắc chắn muốn xóa danh mục này?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="secondary">
            Hủy
          </Button>
          <Button onClick={confirmDelete} color="primary">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Xác nhận nén ảnh */}
      <CompressImageDialog
        open={openCompressDialog}
        message={compressMessage}
        onClose={handleCompressDialogClose}
        onConfirm={(quality) => handleCompressDialogConfirm(quality)}
      />

      {/* Snackbar for success or error message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  )
}
