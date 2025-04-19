"use client"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { Snackbar } from "@mui/material"
import MuiAlert from "@mui/material/Alert"

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  InputAdornment,
  Grid,
} from "@mui/material"
import { Delete, Edit } from "@mui/icons-material"
import { Add } from "@mui/icons-material"
import { setAdditional } from "@/store/slices/additionalServicesSlice"

import { setProduct } from "@/store/slices/productSlice"
import {
  APICreateNewProduct,
  APIGetAllProducts,
  APIUpdateProduct,
  APIDeleteProduct,
} from "@/services/product"
import { APIGetAllAdditional } from "@/services/additionalServices"
import { APIGetAllCategory } from "@/services/category"
import { setCategory } from "@/store/slices/categorySlice"

export default function CmsSanPham() {
  const dispatch = useDispatch()
  const categories = useSelector((state: RootState) => state.category.category)
  const additional =
    useSelector((state: RootState) => state.additional.additional) || []

  const [formData, setFormData] = useState({
    product_name: "",
    category_id: "",
    additional_services: [],
    price: 0,
    classification: [],
    images: [],
    description: "",
    discount_price: 0,
    stock: 0,
    priority: false,
    material: "",
    code: "",
    warranty: "",
  })

  const [selectedProducts, setSelectedProducts] = useState([])
  const [isAnyProductSelected, setIsAnyProductSelected] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCategoryChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setFormData((prev) => ({
      ...prev,
      category_id: e.target.value as string,
    }))
  }

  const handleAdditionalServiceChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      additional_services: checked
        ? [...prev.additional_services, name]
        : prev.additional_services.filter((service) => service !== name),
    }))
  }

  const handleSaveProduct = async () => {
    try {
      const dataToSend = {
        ...formData,
        price: parseFloat(formData.price),
        discount_price: parseFloat(formData.discount_price),
        stock: parseInt(formData.stock, 10),
      }

      const response = await APICreateNewProduct(dataToSend)
      if (response) {
      }
    } catch (error) {
      console.error("Error saving product:", error)
    }
  }

  const handleProductSelect = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId))
    } else {
      setSelectedProducts([...selectedProducts, productId])
    }
    setIsAnyProductSelected(selectedProducts.length > 0)
  }

  const handleDeleteSelectedProducts = async () => {
    try {
      await Promise.all(
        selectedProducts.map((productId) => APIDeleteProduct(productId))
      )
      setSelectedProducts([])
      setIsAnyProductSelected(false)
    } catch (error) {
      console.error("Error deleting products:", error)
    }
  }

  return (
    <div>
      <Dialog open={true} onClose={() => {}} maxWidth="lg" fullWidth>
        <DialogTitle>Thêm sản phẩm mới</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Tên sản phẩm"
                fullWidth
                name="product_name"
                value={formData.product_name}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Danh mục</InputLabel>
                <Select
                  value={formData.category_id}
                  onChange={handleCategoryChange}
                  label="Danh mục"
                >
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.category_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <div>
                {additional.map((service) => (
                  <FormControlLabel
                    key={service._id}
                    control={
                      <Checkbox
                        checked={formData.additional_services.includes(
                          service._id
                        )}
                        onChange={handleAdditionalServiceChange}
                        name={service._id}
                      />
                    }
                    label={service.service_name}
                  />
                ))}
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Giá"
                fullWidth
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Giá giảm"
                fullWidth
                type="number"
                name="discount_price"
                value={formData.discount_price}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Số lượng tồn kho"
                fullWidth
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Chất liệu"
                fullWidth
                name="material"
                value={formData.material}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Mã sản phẩm"
                fullWidth
                name="code"
                value={formData.code}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Bảo hành"
                fullWidth
                name="warranty"
                value={formData.warranty}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Mô tả"
                fullWidth
                multiline
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveProduct}
              >
                Lưu sản phẩm
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleDeleteSelectedProducts}
                disabled={!isAnyProductSelected}
              >
                Xóa hàng loạt
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  )
}
