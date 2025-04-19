"use client"
import React, { useState, useEffect, useCallback, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store/store"
import {
  APICreateNewBanners,
  APIGetBannersAll,
  APIGetBannerById,
  APIUpdateBanners,
  APIDeleteBanners,
} from "@/services/banners"
import { setBanner } from "@/store/slices/bannerSlice"
import {
  Container,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material"
import { Add, Edit, Delete } from "@mui/icons-material"
import ColorPicker from "react-pick-color"
import { checkAndCompressImage } from "@/utils/imageCompression"
import CompressImageDialog from "@/components/CompressImageDialog"

export default function CmsBannerPage() {
  const [loading, setLoading] = useState(false)
  const [color, setColor] = useState("#fff")

  // States cho nén ảnh
  const [openCompressDialog, setOpenCompressDialog] = useState(false)
  const [compressMessage, setCompressMessage] = useState("")
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [compressResolve, setCompressResolve] = useState<
    ((value: { shouldCompress: boolean; quality: number }) => void) | null
  >(null)

  const [formData, setFormData] = useState({
    image_url: [] as string[],
    title: "",
    description: "",
    link: "",
    display_page: "",
  })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [isDescriptionClicked, setIsDescriptionClicked] = useState(false)
  const options = [
    { value: "trang chủ trên", label: "Trang Chủ Trên" },
    { value: "trang chủ dưới", label: "Trang Chủ Dưới" },
  ]

  const banner = useSelector((state: RootState) => state.banner.banner)
  const dispatch = useDispatch()

  const descriptionRef = useRef<HTMLDivElement>(null)
  const colorPickerRef = useRef<HTMLDivElement>(null)

  const fetchBanners = useCallback(async () => {
    setLoading(true)
    try {
      const response = await APIGetBannersAll()
      if (response?.status === 200) dispatch(setBanner(response.data))
    } catch (error) {
      console.error("❌ Error fetching banners:", error)
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  useEffect(() => {
    fetchBanners()
  }, [fetchBanners])

  const handleBannerAction = async (
    action: "create" | "update" | "delete",
    id?: string
  ) => {
    setLoading(true)
    try {
      let response
      if (action === "create") {
        const updatedFormData = {
          ...formData,
          description: `${formData.description}|color:${color}`,
        }
        response = await APICreateNewBanners(updatedFormData)
      }
      if (action === "update" && id) {
        const { image_url, title, description, link, display_page } = formData
        const dataUpdate = {
          image_url,
          title,
          description: `${description.split("|")[0]}|color:${color}`,
          link,
          display_page,
        }
        response = await APIUpdateBanners(dataUpdate, id)
      }
      if (action === "delete" && id) response = await APIDeleteBanners(id)

      if (response?.status) {
        fetchBanners()
        setDialogOpen(false)
        setConfirmOpen(false)
      }
    } catch (error) {
      console.error(`❌ Error ${action} banner:`, error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (id: string) => {
    setLoading(true)
    try {
      const response = await APIGetBannerById(id)
      if (response?.status === 200) {
        const { description } = response.data
        const descriptionParts = description.split("|")
        const textDescription = descriptionParts[0]
        const colorMatch = descriptionParts.find((part: string) =>
          part.startsWith("color:")
        )
        const color = colorMatch ? colorMatch.split(":")[1] : "#FFFFFF"

        setFormData({
          ...response.data,
          description: textDescription,
          image_url: Array.isArray(response.data.image_url)
            ? response.data.image_url
            : [response.data.image_url],
        })
        setColor(color)
        setCurrentId(id)
        setDialogOpen(true)
      }
    } catch (error) {
      console.error("❌ Error fetching banner:", error)
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

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
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
          const base64Image = reader.result as string
          setFormData((prev) => ({
            ...prev,
            image_url: [...prev.image_url, base64Image],
          }))
        }
        reader.onerror = (error) => {
          console.error("❌ Error reading file:", error)
        }
        reader.readAsDataURL(processedFile)
      } catch (error) {
        console.error("Lỗi khi xử lý ảnh:", error)
      }
    }
  }

  const handleDeleteImage = (indexToDelete: number) => {
    setFormData((prev) => ({
      ...prev,
      image_url: prev.image_url.filter((_, index) => index !== indexToDelete),
    }))
  }

  const handleDescriptionClick = () => setIsDescriptionClicked(true)
  const handleCloseDialog = () => setDialogOpen(false)
  const handleCloseConfirm = () => setConfirmOpen(false)

  const handleClickOutside = (event: MouseEvent) => {
    if (
      descriptionRef.current &&
      !descriptionRef.current.contains(event.target as Node) &&
      colorPickerRef.current &&
      !colorPickerRef.current.contains(event.target as Node)
    ) {
      setIsDescriptionClicked(false)
    }
  }

  useEffect(() => {
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  const getBgColor = (displayPage: string) => {
    switch (displayPage) {
      case options[0].value:
        return "bg-red-500" // Màu đỏ cho "trang chủ"
      case options[1].value:
        return "bg-blue-500" // Màu xanh cho "sản phẩm"

      default:
        return "bg-gray-500" // Màu xám mặc định
    }
  }

  return (
    <Container>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => {
          setFormData({
            image_url: [],
            title: "",
            description: "",
            link: "",
            display_page: "",
          })
          setCurrentId(null)
          setDialogOpen(true)
        }}
        disabled={loading} // Tạm tắt tạo banner nếu dùng thì disabled={loading}
      >
        {loading ? "Loading..." : "Tạo Banner"}
      </Button>

      <Grid container spacing={2} mt={2}>
        {banner?.map((b, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <h1
              className={`w-auto px-2 py-2 text-white ${getBgColor(b.display_page)}`}
            >
              {`Banner: ${b.display_page}`}
            </h1>

            <Card>
              <CardMedia
                component="img"
                alt={b.title}
                image={`${process.env.NEXT_PUBLIC_API_URL_IMAGE}${
                  Array.isArray(b.image_url) ? b.image_url[0] : b.image_url
                }`}
              />
              <CardContent>
                <Typography variant="h6">{b.title}</Typography>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      backgroundColor:
                        b.description.match(/color:(#[0-9a-fA-F]{6})/)?.[1] ||
                        "#fff",
                      marginRight: 8,
                    }}
                  ></div>
                  <span>{b.description.split("|")[0]}</span>
                </div>
              </CardContent>
              <CardActions>
                <IconButton onClick={() => handleEdit(b._id)}>
                  <Edit />
                </IconButton>
                <IconButton
                  onClick={() => {
                    setCurrentId(b._id)
                    setConfirmOpen(true)
                  }}
                >
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{currentId ? "Edit Banner" : "Create Banner"}</DialogTitle>
        <DialogContent>
          {["title", "link", "description"].map((field) => (
            <TextField
              key={field}
              label={field.replace("_", " ").toUpperCase()}
              fullWidth
              value={formData[field] || ""}
              onChange={(e) =>
                setFormData({ ...formData, [field]: e.target.value })
              }
              onClick={
                field === "description" ? handleDescriptionClick : undefined
              }
              margin="normal"
              inputRef={field === "description" ? descriptionRef : undefined}
            />
          ))}

          {isDescriptionClicked && (
            <div ref={colorPickerRef}>
              <ColorPicker
                color={color}
                onChange={(color) => setColor(color.hex)}
              />
            </div>
          )}

          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend">Chọn trang hiển thị</FormLabel>
            <RadioGroup
              row
              value={formData.display_page || ""}
              onChange={(e) =>
                setFormData({ ...formData, display_page: e.target.value })
              }
            >
              {options.map((option, key) => (
                <FormControlLabel
                  key={key}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
          </FormControl>

          {formData.image_url.map((image, index) => (
            <div key={index} style={{ position: "relative", marginTop: 10 }}>
              <CardMedia
                component="img"
                alt="img"
                image={
                  image.startsWith("data:image")
                    ? image
                    : `${process.env.NEXT_PUBLIC_API_URL_IMAGE}${image}`
                }
                style={{ maxHeight: 200 }}
              />
              <IconButton
                style={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                }}
                size="small"
                onClick={() => handleDeleteImage(index)}
              >
                <Delete />
              </IconButton>
            </div>
          ))}

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ marginTop: 16 }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() =>
              handleBannerAction(
                currentId ? "update" : "create",
                currentId || undefined
              )
            }
            color="primary"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : currentId
                ? "Update Banner"
                : "Thêm banner"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmOpen} onClose={handleCloseConfirm}>
        <DialogTitle>Bạn chắc chắn muốn xóa banner này ?</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseConfirm} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => currentId && handleBannerAction("delete", currentId)}
            color="primary"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Yes, Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <CompressImageDialog
        open={openCompressDialog}
        message={compressMessage}
        onClose={handleCompressDialogClose}
        onConfirm={handleCompressDialogConfirm}
      />
    </Container>
  )
}
