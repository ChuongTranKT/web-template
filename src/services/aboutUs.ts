import axiosInstance from "./axiosInstance"

// const CustomerId = process.env.NEXT_PUBLIC_CUSTOMER_ID;

const APICreateNewAboutUs = async (data: unknown) => {
  try {
    const response = await axiosInstance.post("/about-us/create-about-us", data)

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

const APIGetAboutUsById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/about-us/get-about-us/${id}`)

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

const APIGetAboutUs = async () => {
  const customerId = process.env.NEXT_PUBLIC_CUSTOMER_ID
  try {
    const response = await axiosInstance.get(
      `/about-us/get-about-us/${customerId}`
    )

    if (response.status === 200 && response.data.code === 200) {
      const data = response.data.content
      return {
        data: data,
        status: response.status,
      }
    } else if (response.status === 200 && response.data.code === 404) {
      return { status: 404, data: null }
    }

    return null
  } catch (err) {
    console.error("Error during get all about-us:", err)
    throw err // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
}

const APIUpdateAboutUs = async (data: unknown, id: string) => {
  try {
    const response = await axiosInstance.put(
      `/about-us/update-about-us/${id}`,
      data
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
  APICreateNewAboutUs,
  APIGetAboutUsById,
  APIGetAboutUs,
  APIUpdateAboutUs,
}
