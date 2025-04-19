"use client"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { Snackbar, TablePagination } from "@mui/material"
import MuiAlert from "@mui/material/Alert"
import { ContentCopy } from "@mui/icons-material"
import { Fade } from "@mui/material"

import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Grid,
  FormGroup,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material"
import {
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit,
  Delete,
  Add as AddIconMui,
} from "@mui/icons-material"

import { setAdditional } from "@/store/slices/additionalServicesSlice"
import { setCategory } from "@/store/slices/categorySlice"
import { setProduct } from "@/store/slices/productSlice"
import {
  APICreateNewProduct,
  APIGetAllProducts,
  APIUpdateProduct,
  APIDeleteProduct,
  APIGetProductById,
} from "@/services/product"
import { APIGetAllAdditional } from "@/services/additionalServices"
import { APIGetAllCategory, APICreateNewCategory } from "@/services/category"
import AlertSuccess from "@/components/alert/AlertSuccess"

// Định nghĩa interface ProductType
interface ProductType {
  _id: string
  product_name: string
  code?: string
  category_id?: {
    _id: string
    category_name: string
  }
  images?: string[]
  classification?: ClassificationType[]
  [key: string]:
    | string
    | string[]
    | { _id: string; category_name: string }
    | ClassificationType[]
    | undefined
}

interface CategoryType {
  _id: string
  category_name: string
  description: string
  category_image: string
}

interface ClassificationType {
  _id?: string
  classifications: Array<{
    classification_name: string
    classification_value: string
  }>
  price: string
  images: string
  remaining: string
}

interface FormData {
  product_name: string
  category_id: string
  price: string
  description: string
  discount_price: string
  stock: string
  priority: boolean
  material: string
  code: string
  warranty: string
  images: string[]
  classification: Array<{
    classifications: Array<{
      classification_name: string
      classification_value: string
    }>
    price: string
    images: string
    remaining: string
  }>
  additional_services: string[]
  [key: string]:
    | string
    | string[]
    | boolean
    | Array<{
        classifications: Array<{
          classification_name: string
          classification_value: string
        }>
        price: string
        images: string
        remaining: string
      }>
}

export default function CmsProductsPage() {
  const dispatch = useDispatch()
  const product = useSelector((state: RootState) => state.product.product)

  const categories = useSelector((state: RootState) => state.category.category)

  const additional = useSelector(
    (state: RootState) => state.additional.additional
  )
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [deleteMode, setDeleteMode] = useState(false)
  const [selectAll, setSelectAll] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [totalCount, setTotalCount] = useState(0)
  const [deletedImages, setDeletedImages] = useState<string[]>([])
  const [classificationImageDelete, setClassificationImageDelete] = useState<{
    [key: string]: string[]
  }>({})

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectAll(event.target.checked)
    if (event.target.checked) {
      setSelectedProducts(filteredProducts.map((product) => product._id))
    } else {
      setSelectedProducts([])
    }
  }

  const handleDeleteSelected = async () => {
    try {
      // Xóa từng sản phẩm đã chọn
      await Promise.all(selectedProducts.map((id) => APIDeleteProduct(id)))

      setSnackbarMessage("Xóa sản phẩm thành công")
      setSnackbarSeverity("success")
      fetchAllproduct()
      setSelectedProducts([])
      setSelectAll(false)
    } catch (error) {
      setSnackbarMessage("Có lỗi xảy ra khi xóa sản phẩm")
      setSnackbarSeverity("error")
      console.error("Failed to delete products:", error)
    } finally {
      setSnackbarOpen(true)
    }
  }
  const handleSelectProduct = (productId: string) => {
    setSelectedProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId)
      } else {
        return [...prev, productId]
      }
    })
  }
  // Thêm state để control dialog category
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false)
  const [categoryFormData, setCategoryFormData] = useState({
    category_name: "",
    description: "",
    category_image: "",
  })

  // Thêm state cho Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  )
  useEffect(() => {
    if (searchTerm) {
      const results = product.filter((item: unknown) => {
        // Kiểm tra kiểu dữ liệu của item
        if (typeof item === "object" && item !== null) {
          const productItem = item as ProductType
          return (
            productItem.product_name
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            productItem.code
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            productItem.category_id?.category_name
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase())
          )
        }
        return false
      })
      setFilteredProducts(results as ProductType[])
    } else {
      setFilteredProducts(product as ProductType[])
    }
  }, [searchTerm, product])

  // Thêm hàm xử lý search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setPage(0) // Reset về trang đầu tiên khi search
  }
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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await APIGetAllCategory()
        if (res && res.data) {
          dispatch(setCategory(res.data))
          // Đặt giá trị mặc định cho category_id
          if (res.data.length > 0) {
            setFormData((prevFormData) => ({
              ...prevFormData,
              category_id: res.data[0]?._id,
            }))
          }
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }

    fetchCategories()
  }, [dispatch])

  const initialFormData = {
    product_name: "",
    category_id: "",
    additional_services: [],
    price: "",
    images: [],
    description: "",
    discount_price: "",
    stock: "",
    priority: false,
    material: "",
    code: "",
    warranty: "",
    classification: [
      {
        classifications: [
          {
            classification_name: "color",
            classification_value: "",
          },
          {
            classification_name: "size",
            classification_value: "",
          },
        ],
        price: "",
        images: "",
        remaining: "",
      },
    ],
  }

  const [formData, setFormData] = useState(initialFormData)

  const [open, setOpen] = useState(false)
  const [errorMessages, setErrorMessages] = useState<string[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)

  // Thêm state để lưu lỗi cho từng field
  const [fieldErrors, setFieldErrors] = useState({
    product_name: "",
    price: "",
    discount_price: "",
    stock: "",
    classification: [] as {
      price: string
      remaining: string
      color: string
      size: string
    }[],
  })

  const handleClickOpen = async (productId: string | null = null) => {
    if (productId) {
      await handleEdit(productId)
    } else {
      setFormData((prevFormData) => ({
        ...initialFormData,
        category_id: categories.length > 0 ? categories[0]._id : "",
      }))
      setEditingId(null)
    }
    setOpen(true)
  }
  const handleEdit = async (productId: string) => {
    try {
      const response = await APIGetProductById(productId)
      if (response && response.data) {
        const productData = response.data

        // Xử lý hình ảnh chính của sản phẩm
        if (productData.images && Array.isArray(productData.images)) {
          productData.images = productData.images.map((image) => {
            // Chỉ thêm domain nếu image là đường dẫn tương đối
            if (
              image &&
              !image.startsWith("data:") &&
              !image.startsWith("http")
            ) {
              return `${process.env.NEXT_PUBLIC_API_URL_IMAGE}${image}`
            }
            return image
          })
        }

        // Xử lý hình ảnh trong classification
        productData.classification = productData.classification.map(
          (classifications) => {
            if (
              classifications.images &&
              !classifications.images.startsWith("data:") &&
              !classifications.images.startsWith("http")
            ) {
              classifications.images = `${process.env.NEXT_PUBLIC_API_URL_IMAGE}${classifications.images}`
            }
            return classifications
          }
        )

        setFormData({
          ...productData,
          category_id: productData.category_id._id || "",
        })
        setEditingId(productId)
      }
    } catch (error) {
      console.error("Failed to fetch product:", error)
    }
  }
  const handleClose = () => {
    setOpen(false)
    setFormData(initialFormData)
    setEditingId(null)
    setDeletedImages([])
    setClassificationImageDelete({})
    // Reset lại tất cả các lỗi
    setFieldErrors({
      product_name: "",
      price: "",
      discount_price: "",
      stock: "",
      classification: [], // Reset lại mảng lỗi của classification
    })
  }
  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }
  const handleDeleteClassificationImage = (classIndex: number) => {
    setFormData((prevState) => {
      const newClassification = [...prevState.classification]
      const currentClassification = newClassification[classIndex]

      if (
        currentClassification.images &&
        !currentClassification.images.startsWith("data:")
      ) {
        // Nếu classification có _id (classification cũ), lưu ảnh cần xóa
        if (currentClassification._id) {
          setClassificationImageDelete((prev) => ({
            ...prev,
            [currentClassification._id]: [
              ...(prev[currentClassification._id] || []),
              currentClassification.images,
            ],
          }))
        }
      }

      // Xóa ảnh khỏi classification
      currentClassification.images = ""

      return { ...prevState, classification: newClassification }
    })
  }

  const handleCreateProduct = async () => {
    let hasError = false
    const newFieldErrors = {
      product_name: "",
      price: "",
      discount_price: "",
      stock: "",
      classification: formData.classification.map(() => ({
        price: "",
        remaining: "",
        color: "",
        size: "",
      })),
    }

    // Validate tên sản phẩm
    if (!formData.product_name) {
      newFieldErrors.product_name = "Tên sản phẩm không được để trống"
      hasError = true
    }

    // Validate giá
    const price = parseFloat(formData.price as string)
    if (isNaN(price) || price < 0) {
      newFieldErrors.price = "Giá sản phẩm phải là số dương"
      hasError = true
    }

    // Validate giá khuyến mãi
    if (formData.discount_price) {
      const discountPrice = parseFloat(formData.discount_price as string)
      if (isNaN(discountPrice) || discountPrice < 0) {
        newFieldErrors.discount_price = "Giá khuyến mãi phải là số dương"
        hasError = true
      }
    }

    // Validate số lượng
    const stock = parseInt(formData.stock as string)
    if (isNaN(stock) || stock < 0) {
      newFieldErrors.stock = "Số lượng phải là số dương"
      hasError = true
    }

    // Validate phân loại
    formData.classification.forEach((classification, index) => {
      const classPrice = parseFloat(classification.price as string)
      const remaining = parseInt(classification.remaining as string)

      if (isNaN(classPrice) || classPrice < 0) {
        newFieldErrors.classification[index].price = "Giá phải là số dương"
        hasError = true
      }

      if (isNaN(remaining) || remaining < 0) {
        newFieldErrors.classification[index].remaining =
          "Số lượng phải là số dương"
        hasError = true
      }

      classification.classifications.forEach((cls) => {
        if (!cls.classification_value) {
          if (cls.classification_name === "color") {
            newFieldErrors.classification[index].color =
              "Màu sắc không được để trống"
          } else if (cls.classification_name === "size") {
            newFieldErrors.classification[index].size =
              "Size không được để trống"
          }
          hasError = true
        }
      })
    })

    setFieldErrors(newFieldErrors)

    if (hasError) {
      return
    }

    // Tiếp tục xử lý tạo/cập nhật sản phẩm nếu không có lỗi
    try {
      // Chuẩn bị dữ liệu cơ bản
      const baseData = {
        ...formData,
        price: parseFloat(formData.price as string) || 0,
        discount_price: parseFloat(formData.discount_price as string) || 0,
        stock: parseInt(formData.stock as string, 10) || 0,
      }

      // Nếu là Update (có editingId)
      if (editingId) {
        const updateData = {
          ...baseData,
          // Xử lý classification hiện tại (có _id)
          classification_update: formData.classification
            .filter((item) => item._id)
            .map((item) => ({
              _id: item._id,
              classifications: item.classifications,
              images: item.images,
              price: parseFloat(item.price as string) || 0,
              remaining: parseInt(item.remaining as string, 10) || 0,
              image_delete: item.image_delete || [],
            })),

          // Xử lý classification mới (không có _id)
          classification_add: formData.classification
            .filter((item) => !item._id)
            .map((item) => ({
              classifications: item.classifications,
              images: item.images,
              price: parseFloat(item.price as string) || 0,
              remaining: parseInt(item.remaining as string, 10) || 0,
            })),

          classification_delete: [],
          images_delete: deletedImages || [],
        }

        // Lấy thông tin sản phẩm gốc để xử lý classification_delete
        const originalProduct = await APIGetProductById(editingId)
        if (originalProduct?.data) {
          updateData.classification_delete = originalProduct.data.classification
            .filter(
              (orig) =>
                !formData.classification.find((curr) => curr._id === orig._id)
            )
            .map((item) => ({
              _id: item._id,
            }))
        }

        const response = await APIUpdateProduct(updateData, editingId)
        if (response?.status == 200) {
          setFormData(initialFormData)
          setEditingId(null)
          setOpen(false)
          fetchAllproduct()
          setSnackbarMessage("Cập nhật sản phẩm thành công")
          setSnackbarSeverity("success")
          setSnackbarOpen(true)
        }
      }
      // Nếu là Create (không có editingId)
      else {
        const createData = {
          ...baseData,
          classification: formData.classification.map((item) => ({
            classifications: item.classifications,
            images: item.images,
            price: parseFloat(item.price as string) || 0,
            remaining: parseInt(item.remaining as string, 10) || 0,
          })),
          classification_update: [],
          classification_add: [],
          classification_delete: [],
          images_delete: [],
        }

        const response = await APICreateNewProduct(createData)
        if (response && response.data) {
          setFormData(initialFormData)
          setOpen(false)
          fetchAllproduct()
          setSnackbarMessage("Tạo sản phẩm thành công")
          setSnackbarSeverity("success")
          setSnackbarOpen(true)
        }
      }
    } catch (error) {
      console.error("Failed to create/update product:", error)
      setSnackbarMessage("Có lỗi xảy ra khi lưu sản phẩm")
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    }
  }
  const fetchAllproduct = async () => {
    try {
      const currentPage = page + 1 // Convert từ 0-based sang 1-based
      const response = await APIGetAllProducts(currentPage, rowsPerPage)

      if (response?.status === 200) {
        dispatch(setProduct(response.data.content))
        setTotalCount(response.data.pagination.total || 0)
        setFilteredProducts(response.data.content) // Cập nhật trực tiếp từ API
      }
    } catch (error) {
      console.error("Failed to fetch products:", error)
      setSnackbarMessage("Có lỗi xảy ra khi tải dữ liệu")
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    }
  }
  useEffect(() => {
    fetchAllproduct()
  }, [page, rowsPerPage, searchTerm])

  const handleRemoveImage = (index: number) => {
    setFormData((prevState) => {
      const newImages = [...prevState.images]
      const removedImage = newImages[index]

      // Nếu là ảnh từ server (URL) thì thêm vào deletedImages
      if (removedImage && !removedImage.startsWith("data:")) {
        setDeletedImages((prev) => [...prev, removedImage])
      }

      // Xóa ảnh khỏi mảng images trong formData
      newImages.splice(index, 1)
      return { ...prevState, images: newImages }
    })
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value }) // Bỏ parseFloat
  }

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name as string]: value })
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prevState) => {
      const additional_services = checked
        ? [...prevState.additional_services, name]
        : prevState.additional_services.filter((id) => id !== name)
      return { ...prevState, additional_services }
    })
  }

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "images" | "classification",
    classIndex?: number
  ) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const imageData = event.target?.result as string

      setFormData((prevFormData) => {
        if (type === "images") {
          // Thêm ảnh vào mảng images
          return {
            ...prevFormData,
            images: [...prevFormData.images, imageData],
          }
        } else if (classIndex !== undefined) {
          // Thêm ảnh vào trường images của classification
          const newClassification = [...prevFormData.classification]
          newClassification[classIndex].images = imageData
          return {
            ...prevFormData,
            classification: newClassification,
          }
        }
        return prevFormData
      })
    }

    reader.readAsDataURL(files[0])
  }
  const handleRemoveClassificationImage = (classIndex: number) => {
    setFormData((prevState) => {
      const newClassification = [...prevState.classification]
      const currentClassification = newClassification[classIndex]

      if (
        currentClassification.images &&
        !currentClassification.images.startsWith("data:")
      ) {
        // Nếu classification có _id (classification cũ), lưu ảnh cần xóa
        if (currentClassification._id) {
          setClassificationImageDelete((prev) => ({
            ...prev,
            [currentClassification._id]: [
              ...(prev[currentClassification._id] || []),
              currentClassification.images,
            ],
          }))
        }
      }

      // Xóa ảnh khỏi classification
      currentClassification.images = ""

      return { ...prevState, classification: newClassification }
    })
  }

  const handleAddclassifications = () => {
    setFormData((prevState) => ({
      ...prevState,
      classification: [
        ...prevState.classification,
        {
          classifications: [
            {
              classification_name: "color",
              classification_value: "",
            },
            {
              classification_name: "size",
              classification_value: "",
            },
          ],
          images: "",
          price: 0,
          remaining: 0,
        },
      ],
    }))
  }

  const handleRemoveclassifications = (index: number) => {
    setFormData((prevState) => {
      const newclassification = prevState.classification.filter(
        (_, i) => i !== index
      )
      return { ...prevState, classification: newclassification }
    })
  }

  const handleClassificationChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setFormData((prev) => {
      const newClassification = [...prev.classification]
      if (field === "color" || field === "size") {
        const classIndex = newClassification[index].classifications.findIndex(
          (c) => c.classification_name === field
        )
        if (classIndex !== -1) {
          newClassification[index].classifications[
            classIndex
          ].classification_value = value
        }
      } else {
        newClassification[index] = {
          ...newClassification[index],
          [field]: value,
        }
      }
      return { ...prev, classification: newClassification }
    })

    // Xóa thông báo lỗi cho trường phân loại đang được nhập
    setFieldErrors((prev) => {
      const newClassificationErrors = [...prev.classification]
      newClassificationErrors[index] = {
        ...newClassificationErrors[index],
        [field]: "",
      }
      return {
        ...prev,
        classification: newClassificationErrors,
      }
    })
  }

  const handleInputChange = (field: string, value: string) => {
    // Cập nhật giá trị form
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Xóa thông báo lỗi cho trường đang được nhập
    setFieldErrors((prev) => ({
      ...prev,
      [field]: "",
    }))
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10)
    setRowsPerPage(newRowsPerPage)
    setPage(0) // Reset về trang đầu
    // Scroll to top mượt mà
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }
  //xóa product

  const handleDelete = async (_id: string) => {
    try {
      const res = await APIDeleteProduct(_id)
      if (res?.status === 200) {
        setSnackbarMessage("Xóa sản phẩm thành công")
        setSnackbarSeverity("success")
        fetchAllproduct()
      }
    } catch (error: unknown) {
      // Xử lý lỗi khi xóa
      if (error.response?.data?.message === "Danh mục đã có sản phẩm.") {
        setSnackbarMessage("Không thể xóa danh mục đã có sản phẩm")
      } else {
        setSnackbarMessage("Có lỗi xảy ra khi xóa sản phẩm")
      }
      setSnackbarSeverity("error")
      console.error("Failed to delete product:", error)
    } finally {
      setSnackbarOpen(true)
    }
  }
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
    // Scroll to top mượt mà
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // Thêm hàm xử lý thêm category
  const handleAddCategory = async () => {
    try {
      const response = await APICreateNewCategory(categoryFormData)
      if (response) {
        // Fetch lại danh sách category
        const res = await APIGetAllCategory()
        if (res && res.data) {
          dispatch(setCategory(res.data))
          // Set category mới vào form product
          setFormData((prev) => ({
            ...prev,
            category_id: res.data[res.data.length - 1]._id,
          }))
        }
        setOpenCategoryDialog(false)
        setCategoryFormData({
          category_name: "",
          description: "",
          category_image: "",
        })
      }
    } catch (error) {
      console.error("Failed to create category:", error)
    }
  }

  // Thêm hàm xử lý file ảnh category
  const handleCategoryImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCategoryFormData((prev) => ({
          ...prev,
          category_image: reader.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }
  const handleDuplicate = async (productId: string) => {
    try {
      const response = await APIGetProductById(productId)
      if (response && response.data) {
        const productData = response.data

        // Hàm để convert URL thành base64
        const convertImageToBase64 = async (imageUrl: string) => {
          try {
            const response = await fetch(imageUrl)
            const blob = await response.blob()
            return new Promise((resolve) => {
              const reader = new FileReader()
              reader.onloadend = () => resolve(reader.result)
              reader.readAsDataURL(blob)
            })
          } catch (error) {
            console.error("Error converting image to base64:", error)
            return null
          }
        }

        // Xử lý hình ảnh chính của sản phẩm
        if (productData.images && Array.isArray(productData.images)) {
          const convertedImages = await Promise.all(
            productData.images.map(async (image) => {
              if (image && !image.startsWith("data:")) {
                const fullUrl = image.startsWith("http")
                  ? image
                  : `${process.env.NEXT_PUBLIC_API_URL_IMAGE}${image}`
                const base64 = await convertImageToBase64(fullUrl)
                return base64 || ""
              }
              return image
            })
          )
          productData.images = convertedImages.filter((img) => img)
        }

        // Xử lý hình ảnh trong classification
        const updatedClassifications = await Promise.all(
          productData.classification.map(async (classifications) => {
            const { _id, ...classificationWithoutId } = classifications

            if (
              classificationWithoutId.images &&
              !classificationWithoutId.images.startsWith("data:")
            ) {
              const fullUrl = classificationWithoutId.images.startsWith("http")
                ? classificationWithoutId.images
                : `${process.env.NEXT_PUBLIC_API_URL_IMAGE}${classificationWithoutId.images}`
              const base64 = await convertImageToBase64(fullUrl)
              classificationWithoutId.images = base64 || ""
            }

            return classificationWithoutId
          })
        )

        // Tạo dữ liệu mới
        const newProductData = {
          ...productData,
          category_id: productData.category_id._id || "",
          classification: updatedClassifications,
        }

        setFormData(newProductData)
        setEditingId(null)
        setOpen(true)
      }
    } catch (error) {
      console.error("Failed to duplicate product:", error)
      setSnackbarMessage("Có lỗi xảy ra khi sao chép sản phẩm")
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    }
  }

  // Thêm state mới
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)

  // Thêm các hàm xử lý
  const handleBulkDelete = async () => {
    try {
      // Gọi API xóa nhiều sản phẩm
      await Promise.all(selectedProducts.map((id) => APIDeleteProduct(id)))

      setSnackbarMessage("Đã xóa thành công các sản phẩm đã chọn!")
      setSnackbarOpen(true)
      setBulkDeleteDialogOpen(false)
      setSelectedProducts([])

      // Refresh danh sách sản phẩm
      const response = await APIGetAllProducts()
      if (response && response.data) {
        dispatch(setProduct(response.data.content))
      }
    } catch (error) {
      console.error("Lỗi khi xóa hàng loạt:", error)
      setSnackbarMessage("Có lỗi xảy ra khi xóa sản phẩm!")
      setSnackbarOpen(true)
    }
  }

  return (
    <div>
      <Grid container spacing={2} style={{ marginBottom: "20px" }}>
        <Grid item xs={6}>
          <Button variant="contained" color="primary" onClick={handleClickOpen}>
            Thêm sản phẩm
          </Button>
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Tìm kiếm theo tên, mã sản phẩm hoặc danh mục"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearch}
          />
        </Grid>
      </Grid>
      <Fade in={true} timeout={500}>
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: "60vh", // Giới hạn chiều cao của container
            "& .MuiTableHead-root": {
              position: "sticky",
              top: 0,
              backgroundColor: "white", // Để header nổi bật
              zIndex: 1,
            },
          }}
        >
          <Table stickyHeader>
            {" "}
            {/* Thêm stickyHeader để giữ header cố định */}
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedProducts.length === product.length}
                    indeterminate={
                      selectedProducts.length > 0 &&
                      selectedProducts.length < product.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Tên sản phẩm</TableCell>
                <TableCell>Ảnh sản phẩm</TableCell>
                <TableCell>Danh mục</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((product: unknown, index: number) => (
                <TableRow key={index}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedProducts.includes(product._id)}
                      onChange={() => handleSelectProduct(product._id)}
                    />
                  </TableCell>
                  <TableCell>{product.product_name}</TableCell>
                  <TableCell>
                    {product.images && product.images.length > 0 && (
                      <img
                        src={
                          product.images[0].startsWith("data:")
                            ? product.images[0]
                            : product.images[0].includes(
                                  process.env.NEXT_PUBLIC_API_URL_IMAGE
                                )
                              ? product.images[0].replace(
                                  process.env.NEXT_PUBLIC_API_URL_IMAGE,
                                  process.env.NEXT_PUBLIC_API_URL_IMAGE
                                )
                              : !product.images[0].startsWith("http")
                                ? `${process.env.NEXT_PUBLIC_API_URL_IMAGE}${product.images[0]}`
                                : product.images[0]
                        }
                        alt="image"
                        style={{ width: 50, height: 50 }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {product.category_id?.category_name || "N/A"}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleClickOpen(product._id)}
                    >
                      <Edit />
                    </IconButton>
                    {selectedProducts.length === 0 && (
                      <IconButton
                        color="secondary"
                        onClick={() => handleDelete(product._id)}
                      >
                        <Delete />
                      </IconButton>
                    )}
                    <IconButton
                      color="default"
                      onClick={() => handleDuplicate(product._id)}
                    >
                      <ContentCopy />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {filteredProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Không có sản phẩm nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Fade>
      <div>
        {selectedProducts.length > 0 && (
          <Button
            variant="contained"
            color="error"
            onClick={() => setBulkDeleteDialogOpen(true)}
            sx={{ ml: 2 }}
          >
            Xóa {selectedProducts.length} sản phẩm đã chọn
          </Button>
        )}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
          }
          sx={{
            ".MuiTablePagination-select": {
              marginRight: "8px",
            },
            ".MuiTablePagination-displayedRows": {
              margin: "0 16px",
            },
            float: "right",
          }}
        />
      </div>

      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>Thêm sản phẩm mới</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <TextField
                autoFocus
                margin="dense"
                name="product_name"
                label="Tên sản phẩm"
                type="text"
                fullWidth
                value={formData.product_name}
                onChange={(e) =>
                  handleInputChange("product_name", e.target.value)
                }
                required
                error={!!fieldErrors.product_name}
                helperText={fieldErrors.product_name}
              />
            </Grid>
            <Grid item xs={3}>
              <FormControl fullWidth margin="dense">
                <InputLabel htmlFor="category-select">Danh mục</InputLabel>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Select
                    id="category-select"
                    name="category_id"
                    value={formData.category_id || ""}
                    onChange={handleSelectChange}
                    label="Danh mục"
                    required
                    style={{ flex: 1 }}
                  >
                    {categories && categories.length > 0 ? (
                      categories.map((category, index) => (
                        <MenuItem key={index} value={category._id}>
                          {category.category_name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value="" disabled>
                        Không có danh mục
                      </MenuItem>
                    )}
                  </Select>
                  <IconButton
                    color="primary"
                    onClick={() => setOpenCategoryDialog(true)}
                    style={{ padding: "8px" }}
                  >
                    <AddIconMui />
                  </IconButton>
                </div>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl component="fieldset" fullWidth margin="dense">
                <p className="mb-2 text-lg font-semibold">Dịch vụ bổ sung</p>
                <FormGroup style={{ display: "block", flexWrap: "wrap" }}>
                  {additional.map((service, index) => (
                    <FormControlLabel
                      key={index}
                      control={
                        <Checkbox
                          checked={formData.additional_services.includes(
                            service._id
                          )}
                          onChange={handleCheckboxChange}
                          name={service._id}
                        />
                      }
                      label={service.description}
                      style={{ flex: "1 0 30%" }} // Adjust the flex-basis value as needed
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <TextField
                margin="dense"
                name="price"
                label="Giá"
                type="number"
                fullWidth
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                required
                error={!!fieldErrors.price}
                helperText={fieldErrors.price}
              />
            </Grid>
            <Grid item xs={3}>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="raised-button-file"
                multiple
                type="file"
                onChange={(e) => handleImageChange(e, "images")}
              />
              <label htmlFor="raised-button-file">
                <Button variant="contained" component="span">
                  Chọn ảnh
                </Button>
              </label>
              <div>
                {formData.images.map((image, index) => (
                  <div
                    key={index}
                    style={{
                      position: "relative",
                      display: "inline-block",
                      margin: "10px",
                    }}
                  >
                    <img
                      src={
                        image.startsWith("data:")
                          ? image // Nếu là base64
                          : image.includes(
                                process.env.NEXT_PUBLIC_API_URL_IMAGE
                              )
                            ? image.replace(
                                process.env.NEXT_PUBLIC_API_URL_IMAGE,
                                process.env.NEXT_PUBLIC_API_URL_IMAGE
                              ) // Sửa URL trùng
                            : !image.startsWith("http")
                              ? `${process.env.NEXT_PUBLIC_API_URL_IMAGE}${image}` // Nếu là đường dẫn tương đối
                              : image // Nếu là URL đầy đủ
                      }
                      alt="image"
                      style={{ width: "100px", height: "100px" }}
                    />
                    <IconButton
                      size="small"
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        backgroundColor: "transparent",
                        color: "red",
                      }}
                      onClick={() => handleRemoveImage(index)}
                    >
                      <CloseIcon />
                    </IconButton>
                  </div>
                ))}
              </div>
            </Grid>
            <Grid item xs={3}>
              <TextField
                margin="dense"
                name="description"
                label="Mô tả"
                type="text"
                fullWidth
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                margin="dense"
                name="discount_price"
                label="Giá khuyến mãi"
                type="number"
                fullWidth
                value={formData.discount_price}
                onChange={(e) =>
                  handleInputChange("discount_price", e.target.value)
                }
                error={!!fieldErrors.discount_price}
                helperText={fieldErrors.discount_price}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                margin="dense"
                name="stock"
                label="Số lượng"
                type="number"
                fullWidth
                value={formData.stock}
                onChange={(e) => handleInputChange("stock", e.target.value)}
                error={!!fieldErrors.stock}
                helperText={fieldErrors.stock}
              />
            </Grid>
            <Grid item xs={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.checked })
                    }
                    name="priority"
                  />
                }
                label="Ưu tiên"
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                margin="dense"
                name="material"
                label="Chất liệu"
                type="text"
                fullWidth
                value={formData.material}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                margin="dense"
                name="code"
                label="Mã sản phẩm"
                type="text"
                fullWidth
                value={formData.code}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                margin="dense"
                name="warranty"
                label="Bảo hành"
                type="text"
                fullWidth
                value={formData.warranty}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddclassifications}
              >
                Thêm phân loại
              </Button>
            </Grid>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Màu sắc</TableCell>
                      <TableCell>Kích thước</TableCell>
                      <TableCell>Hình ảnh</TableCell>
                      <TableCell>Giá</TableCell>
                      <TableCell>Số lượng còn lại</TableCell>
                      <TableCell>Hành động</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.classification.map(
                      (classifications, classIndex) => (
                        <TableRow key={classIndex}>
                          {classifications.classifications.map(
                            (classification, classFieldIndex) => (
                              <React.Fragment key={classFieldIndex}>
                                <TableCell>
                                  <TextField
                                    margin="dense"
                                    name="classification_value"
                                    label={classification.classification_name}
                                    type="text"
                                    fullWidth
                                    value={classification.classification_value}
                                    onChange={(e) =>
                                      handleClassificationChange(
                                        classIndex,
                                        classification.classification_name,
                                        e.target.value
                                      )
                                    }
                                    required
                                    error={
                                      !!fieldErrors.classification[
                                        classIndex
                                      ]?.[classification.classification_name]
                                    }
                                    helperText={
                                      fieldErrors.classification[classIndex]?.[
                                        classification.classification_name
                                      ]
                                    }
                                  />
                                </TableCell>
                              </React.Fragment>
                            )
                          )}
                          <TableCell>
                            <div style={{ position: "relative" }}>
                              <input
                                accept="image/*"
                                style={{ display: "none" }}
                                id={`upload-image-${classIndex}`}
                                type="file"
                                onChange={(e) =>
                                  handleImageChange(
                                    e,
                                    "classification",
                                    classIndex
                                  )
                                }
                              />
                              <label htmlFor={`upload-image-${classIndex}`}>
                                <Button variant="contained" component="span">
                                  📷
                                  {classifications.images && (
                                    <div
                                      style={{
                                        position: "relative",
                                        display: "inline-block",
                                        marginLeft: 10,
                                      }}
                                    >
                                      <img
                                        src={
                                          classifications.images.startsWith(
                                            "data:"
                                          )
                                            ? classifications.images
                                            : classifications.images.startsWith(
                                                  "http"
                                                )
                                              ? classifications.images
                                              : `${process.env.NEXT_PUBLIC_API_URL_IMAGE}${classifications.images}`
                                        }
                                        alt="Uploaded"
                                        style={{ width: 50, height: 50 }}
                                      />
                                      {/* Thêm nút xóa ảnh */}
                                      <IconButton
                                        size="small"
                                        style={{
                                          position: "absolute",
                                          top: -10,
                                          right: -10,
                                          color: "red",
                                          backgroundColor: "white",
                                          padding: 4,
                                        }}
                                        onClick={() =>
                                          handleDeleteClassificationImage(
                                            classIndex
                                          )
                                        }
                                      >
                                        <CloseIcon fontSize="small" />
                                      </IconButton>
                                    </div>
                                  )}
                                </Button>
                              </label>
                            </div>
                          </TableCell>
                          <TableCell>
                            <TextField
                              margin="dense"
                              name="price"
                              label="Giá"
                              type="number"
                              fullWidth
                              value={classifications.price}
                              onChange={(e) =>
                                handleClassificationChange(
                                  classIndex,
                                  "price",
                                  e.target.value
                                )
                              }
                              required
                              error={
                                !!fieldErrors.classification[classIndex]?.price
                              }
                              helperText={
                                fieldErrors.classification[classIndex]?.price
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              margin="dense"
                              name="remaining"
                              label="Số lượng còn lại"
                              type="number"
                              fullWidth
                              value={classifications.remaining}
                              onChange={(e) =>
                                handleClassificationChange(
                                  classIndex,
                                  "remaining",
                                  e.target.value
                                )
                              }
                              required
                              error={
                                !!fieldErrors.classification[classIndex]
                                  ?.remaining
                              }
                              helperText={
                                fieldErrors.classification[classIndex]
                                  ?.remaining
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton
                              color="secondary"
                              onClick={() =>
                                handleRemoveclassifications(classIndex)
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Hủy
          </Button>
          <Button onClick={handleCreateProduct} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
      <Dialog
        open={openCategoryDialog}
        onClose={() => setOpenCategoryDialog(false)}
      >
        <DialogTitle>Thêm danh mục mới</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tên danh mục"
            fullWidth
            value={categoryFormData.category_name}
            onChange={(e) =>
              setCategoryFormData((prev) => ({
                ...prev,
                category_name: e.target.value,
              }))
            }
          />
          <TextField
            margin="dense"
            label="Mô tả"
            fullWidth
            value={categoryFormData.description}
            onChange={(e) =>
              setCategoryFormData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="category-image-upload"
            type="file"
            onChange={handleCategoryImageChange}
          />
          <label htmlFor="category-image-upload">
            <Button
              component="span"
              variant="outlined"
              style={{ marginTop: "16px" }}
            >
              Chọn ảnh
            </Button>
          </label>
          {categoryFormData.category_image && (
            <div style={{ marginTop: "8px" }}>
              <img
                src={categoryFormData.category_image}
                alt="Category preview"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCategoryDialog(false)}>Hủy</Button>
          <Button onClick={handleAddCategory} color="primary">
            Thêm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={bulkDeleteDialogOpen}
        onClose={() => setBulkDeleteDialogOpen(false)}
      >
        <DialogTitle>Xác nhận xóa hàng loạt</DialogTitle>
        <DialogContent>
          <p>
            Bạn có chắc chắn muốn xóa {selectedProducts.length} sản phẩm đã
            chọn?
          </p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setBulkDeleteDialogOpen(false)}
            color="secondary"
          >
            Hủy
          </Button>
          <Button onClick={handleBulkDelete} color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
