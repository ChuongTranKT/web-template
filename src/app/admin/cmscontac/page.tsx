"use client"
import { RootState } from "@/store/store"
import { useDispatch, useSelector } from "react-redux"
import { setAboutUs } from "@/store/slices/aboutUsSlice"
import React, { useState, useEffect } from "react"
import { TextField, Button, CircularProgress } from "@mui/material"
import * as Yup from "yup"
import {
  APICreateNewAboutUs,
  APIGetAboutUs,
  APIUpdateAboutUs,
} from "@/services/aboutUs"

import { useFormik } from "formik"
import { checkAndCompressImage } from "@/utils/imageCompression"
import CompressImageDialog from "@/components/CompressImageDialog"

export default function CustomerManagement() {
  const aboutUs = useSelector((state: RootState) => state.aboutUs.aboutUs) as {
    _id: string
    company_name: string
    logo: string
    slogan: string
    description: string
    history: string
    vision: string
    mission: string
    open_time: string
    address: string
    phone: string
    email: string
    facebook_link: string
    twitter_link: string
    instagram_link: string
    linkedin_link: string
    map: string
  }
  const dispatch = useDispatch()

  // State quản lý ảnh logo
  const [logoBase64, setLogoBase64] = useState<string | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false) // Loading state
  const [isCreateMode, setIsCreateMode] = useState(false)
  // State cho nén ảnh
  const [openCompressDialog, setOpenCompressDialog] = useState(false)
  const [compressMessage, setCompressMessage] = useState("")
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [compressResolve, setCompressResolve] = useState<
    ((value: { shouldCompress: boolean; quality: number }) => void) | null
  >(null)
  // Validation schema với Yup

  const validationSchema = Yup.object({
    companyName: Yup.string().required("Company name is required"),
    open_time: Yup.string().required("thời gian mở của không được để trống"),

    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
      .matches(/^(03|05|07|08|09)\d{8}$/, "Số điện thoại không hợp lệ")
      .required("Số điện thoại là bắt buộc"),
  })

  // Dữ liệu form
  const formik = useFormik({
    initialValues: {
      companyName: aboutUs?.company_name || "",
      email: aboutUs?.email || "",
      phone: aboutUs?.phone || "",
      slogan: aboutUs?.slogan || "",
      description: aboutUs?.description || "",
      history: aboutUs?.history || "",
      mission: aboutUs?.mission || "",
      open_time: aboutUs?.open_time || "",
      map: aboutUs?.map || "",
      vision: aboutUs?.vision || "",
      address: aboutUs?.address || "",
      facebookLink: aboutUs?.facebook_link || "",
      twitterLink: aboutUs?.twitter_link || "",
      instagramLink: aboutUs?.instagram_link || "",
      linkedinLink: aboutUs?.linkedin_link || "",
    },
    validationSchema,
    onSubmit: (values) => {
      // Nếu aboutUs có dữ liệu (đã có thông tin cũ), gọi hàm update
      if (aboutUs && aboutUs._id) {
        handlerUpdateAboutUs(values)
      } else {
        // Nếu không có dữ liệu cũ, gọi hàm create mới
        handlerCreateAboutUs(values)
      }
    },
  })

  //Lấy vị trí hiện tại
  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         formik.setFieldValue(
  //           'longitude',
  //           position.coords.longitude.toString()
  //         )
  //         formik.setFieldValue('latitude', position.coords.latitude.toString())
  //       },
  //       (error) => {
  //         console.error('Error getting location', error)
  //         formik.setFieldValue('longitude', '0')
  //         formik.setFieldValue('latitude', '0')
  //       }
  //     )
  //   } else {
  //     console.error('Geolocation is not supported by this browser.')
  //   }
  // }, [])

  // Lấy dữ liệu AboutUs từ API
  useEffect(() => {
    handleGetAboutUs()
  }, [])

  const handleGetAboutUs = async () => {
    setLoading(true)
    try {
      const response = await APIGetAboutUs()
      if (response?.status === 200) {
        dispatch(setAboutUs(response.data))
        formik.setValues({
          companyName: response.data.company_name,
          email: response.data.email,
          phone: response.data.phone,
          slogan: response.data.slogan,
          description: response.data.description,
          history: response.data.history,
          mission: response.data.mission,
          open_time: response.data.open_time,
          vision: response.data.vision,
          address: response.data.address,
          facebookLink: response.data.facebook_link,
          twitterLink: response.data.twitter_link,
          instagramLink: response.data.instagram_link,
          linkedinLink: response.data.linkedin_link,
          map: response.data.map,
        })
        setLogoPreview(
          response.data.logo
            ? `${process.env.NEXT_PUBLIC_API_URL_IMAGE}${response.data.logo}`
            : null
        )
        setIsCreateMode(false) // Chuyển sang chế độ update nếu có dữ liệu
      } else {
        setIsCreateMode(true) // Nếu không có dữ liệu, chuyển sang chế độ tạo mới
      }
    } catch (error) {
      console.error("Error fetching About Us data:", error)
      setIsCreateMode(true) // Chuyển sang chế độ tạo mới khi có lỗi
    } finally {
      setLoading(false)
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

  // Khi người dùng chọn file, chuyển file sang base64 và lưu vào logoBase64
  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        reader.onload = () => {
          const base64String = reader.result as string
          setLogoBase64(base64String)
          setLogoPreview(base64String)
        }
        reader.onerror = (error) => {
          console.error("Error reading file: ", error)
        }
        reader.readAsDataURL(processedFile)
      } catch (error) {
        console.error("Lỗi khi xử lý ảnh:", error)
      }
    }
  }

  const handlerUpdateAboutUs = async (values: {
    companyName: string
    slogan: string
    description: string
    history: string
    mission: string
    open_time: string
    vision: string
    address: string
    phone: string
    email: string
    facebookLink: string
    twitterLink: string
    instagramLink: string
    linkedinLink: string
    longitude?: string
    latitude?: string
    image_delete?: string
    map: string
  }) => {
    try {
      setLoading(true)

      interface AboutUsUpdateData {
        company_name: string
        slogan: string
        description: string
        history: string
        mission: string
        open_time: string
        vision: string
        address: string
        phone: string
        email: string
        facebook_link: string
        twitter_link: string
        instagram_link: string
        linkedin_link: string
        longitude?: string
        latitude?: string
        image_delete?: string
        map: string
        logo?: string
      }

      const updatedData: AboutUsUpdateData = {
        company_name: values.companyName,
        slogan: values.slogan,
        description: values.description,
        history: values.history,
        mission: values.mission,
        open_time: values.open_time,
        vision: values.vision,
        address: values.address,
        phone: values.phone,
        email: values.email,
        facebook_link: values.facebookLink,
        twitter_link: values.twitterLink,
        instagram_link: values.instagramLink,
        linkedin_link: values.linkedinLink,
        longitude: values.longitude,
        latitude: values.latitude,
        image_delete: values.image_delete,
        map: values.map,
      }

      if (logoBase64) {
        updatedData.logo = logoBase64
      } else if (!logoBase64 && aboutUs?.logo) {
        updatedData.logo = aboutUs.logo
      }

      const response = await APIUpdateAboutUs(updatedData, aboutUs._id)
      if (response?.status === 200) {
        handleGetAboutUs() // Refresh after update
      }
    } catch (error) {
      console.error("Error updating About Us data:", error)
    } finally {
      setLoading(false)
    }
  }

  // tạo hóa đơn
  const handlerCreateAboutUs = async (values: {
    companyName: string
    slogan: string
    description: string
    history: string
    mission: string
    open_time: string
    vision: string
    address: string
    phone: string
    email: string
    facebookLink: string
    twitterLink: string
    instagramLink: string
    linkedinLink: string
    longitude?: string
    latitude?: string
    image_delete?: string
    map: string
  }) => {
    try {
      setLoading(true)

      interface AboutUsCreateData {
        company_name: string
        slogan: string
        description: string
        history: string
        mission: string
        open_time: string
        vision: string
        address: string
        phone: string
        email: string
        facebook_link: string
        twitter_link: string
        instagram_link: string
        linkedin_link: string
        longitude?: string
        latitude?: string
        image_delete?: string
        map: string
        logo?: string
      }

      const createData: AboutUsCreateData = {
        company_name: values.companyName,
        slogan: values.slogan,
        description: values.description,
        history: values.history,
        mission: values.mission,
        vision: values.vision,
        address: values.address,
        phone: values.phone,
        email: values.email,
        facebook_link: values.facebookLink,
        twitter_link: values.twitterLink,
        instagram_link: values.instagramLink,
        linkedin_link: values.linkedinLink,
        longitude: values.longitude,
        latitude: values.latitude,
        open_time: values.open_time,
        image_delete: values.image_delete,
        map: values.map,
      }

      if (logoBase64) {
        createData.logo = logoBase64
      } else if (!logoBase64 && aboutUs?.logo) {
        createData.logo = aboutUs.logo
      }

      const response = await APICreateNewAboutUs(createData)
      if (response?.status === 200) {
        handleGetAboutUs() // Refresh after update
      }
    } catch (error) {
      console.error("Error updating About Us data:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      {logoPreview && (
        <div className="flex flex-col">
          <p>Ảnh Logo:</p>
          <img
            src={logoPreview}
            alt="Logo preview"
            width={100}
            height={100}
            style={{ marginTop: "10px" }}
          />
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleLogoChange}
        placeholder="Chọn logo"
      />
      <form onSubmit={formik.handleSubmit}>
        <TextField
          value={formik.values.companyName}
          onChange={formik.handleChange}
          name="companyName"
          label="Nhập tên công ty"
          fullWidth
          margin="normal"
          error={formik.touched.companyName && !!formik.errors.companyName}
          helperText={formik.touched.companyName && formik.errors.companyName}
        />
        <TextField
          value={formik.values.slogan}
          onChange={formik.handleChange}
          name="slogan"
          label="Nhập khẩu hiệu"
          fullWidth
          margin="normal"
        />

        <TextField
          value={formik.values.open_time}
          onChange={formik.handleChange}
          name="open_time"
          label="Nhập thời gian mở cửa"
          fullWidth
          margin="normal"
          error={formik.touched.open_time && !!formik.errors.open_time}
          helperText={formik.touched.open_time && formik.errors.open_time}
        />

        <TextField
          value={formik.values.address}
          onChange={formik.handleChange}
          name="address"
          label="Nhập địa chỉ"
          fullWidth
          margin="normal"
        />
        <TextField
          value={formik.values.phone}
          onChange={formik.handleChange}
          name="phone"
          label="Nhập số điện thoại"
          fullWidth
          margin="normal"
          error={formik.touched.phone && !!formik.errors.phone}
          helperText={formik.touched.phone && formik.errors.phone}
        />
        <TextField
          value={formik.values.facebookLink}
          onChange={formik.handleChange}
          name="facebookLink"
          label="Nhập link Facebook"
          fullWidth
          margin="normal"
        />
        <TextField
          value={formik.values.twitterLink}
          onChange={formik.handleChange}
          name="twitterLink"
          label="Nhập link Twitter"
          fullWidth
          margin="normal"
        />
        <TextField
          value={formik.values.instagramLink}
          onChange={formik.handleChange}
          name="instagramLink"
          label="Nhập link Instagram"
          fullWidth
          margin="normal"
        />
        <TextField
          value={formik.values.linkedinLink}
          onChange={formik.handleChange}
          name="linkedinLink"
          label="Nhập link LinkedIn"
          fullWidth
          margin="normal"
        />
        <TextField
          value={formik.values.map}
          onChange={formik.handleChange}
          name="map"
          label="URL bản đồ"
          fullWidth
          margin="normal"
        />
        <TextField
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          name="email"
          label="Nhập email của bạn"
          fullWidth
          margin="normal"
        />

        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? (
            <CircularProgress size={24} />
          ) : isCreateMode ? (
            "Tạo mới"
          ) : (
            "Cập nhật"
          )}
        </Button>
      </form>
      {/* Dialog Xác nhận nén ảnh */}
      <CompressImageDialog
        open={openCompressDialog}
        message={compressMessage}
        onClose={handleCompressDialogClose}
        onConfirm={(quality) => handleCompressDialogConfirm(quality)}
      />
    </div>
  )
}
