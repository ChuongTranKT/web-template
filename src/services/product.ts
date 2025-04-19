import { useEffect } from "react"
import axiosInstance from "./axiosInstance"

// const CustomerId = process.env.NEXT_PUBLIC_CUSTOMER_ID;

const APICreateNewProduct = async (data: unknown) => {
  try {
    const response = await axiosInstance.post(
      "/products/create-new-product",
      data
    )

    if (response.status === 201 && response.data.code === 200) {
      const data = response.data.content
      return { data: data, status: response.status }
    }

    return null
  } catch (err) {
    console.error("Error during create about-us:", err)
    throw err // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
}

const APIGetAllProducts = async (
  page: number = 1,
  limit: number = 1000,
  category_id?: string, // Dùng dấu `?` để cho phép không truyền category_id
  priority?: boolean // Thêm optional param
) => {
  const customerId = process.env.NEXT_PUBLIC_CUSTOMER_ID

  try {
    // Xây dựng params động
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    })

    if (category_id) {
      params.append("category_id", category_id)
    }
    if (priority) {
      params.append("priority", "true")
    }

    const response = await axiosInstance.get(
      `/products/get-all-products/${customerId}?${params.toString()}`
    )

    if (response.status === 200 && response.data.code === 200) {
      return { data: response.data, status: response.status }
    } else if (response.status === 200 && response.data.code === 404) {
      return { status: 404, data: null }
    }

    return null
  } catch (err) {
    console.error("Error during get all products:", err)
    throw err // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
}

const APIGetProductById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/products/get-product/${id}`)

    if (response.status === 200 && response.data.code === 200) {
      const data = response.data.content
      return { data: data, status: response.status }
    }

    return null
  } catch (err) {
    console.error("Error during get about-us by id:", err)
    throw err // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
}

const APIUpdateProduct = async (data: unknown, id: string) => {
  try {
    const response = await axiosInstance.put(
      `/products/update-product/${id}`,
      data
    )

    if (response.status === 200 && response.data.code === 200) {
      const data = response.data.content
      return { data: data, status: response.status }
    }

    return null
  } catch (err) {
    console.error("Error during update product:", err)
    throw err // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
}
const APIDeleteProduct = async (id: string) => {
  try {
    const response = await axiosInstance.delete(
      `/products/delete-product/${id}`
    )

    if (response.status === 200 && response.data.code === 200) {
      const data = response.data.content
      return { data: data, status: response.status }
    }

    return null
  } catch (err) {
    console.error("Error during update aboutUs:", err)
    throw err // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
}

export {
  APICreateNewProduct,
  APIGetAllProducts,
  APIUpdateProduct,
  APIDeleteProduct,
  APIGetProductById,
}
