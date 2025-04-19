import imageCompression from "browser-image-compression"

// Danh sách các định dạng ảnh được hỗ trợ
const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]

export const compressImage = async (
  file: File,
  maxSizeMB: number = 1,
  quality: number = 80
): Promise<File> => {
  // Kiểm tra định dạng ảnh
  if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
    throw new Error(
      `Định dạng ảnh không được hỗ trợ. Vui lòng sử dụng: ${SUPPORTED_IMAGE_TYPES.join(", ")}`
    )
  }

  const options = {
    maxSizeMB,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    initialQuality: quality / 100, // Chuyển đổi phần trăm thành số thập phân
  }

  try {
    const compressedFile = await imageCompression(file, options)
    return compressedFile
  } catch (error) {
    console.error("Lỗi khi nén ảnh:", error)
    throw new Error("Không thể nén ảnh. Vui lòng thử lại với ảnh khác.")
  }
}

export const checkAndCompressImage = async (
  file: File,
  maxSizeMB: number = 1,
  onConfirm: (
    message: string
  ) => Promise<{ shouldCompress: boolean; quality: number }>
): Promise<{ file: File; wasCompressed: boolean }> => {
  // Kiểm tra định dạng ảnh
  if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
    throw new Error(
      `Định dạng ảnh không được hỗ trợ. Vui lòng sử dụng: ${SUPPORTED_IMAGE_TYPES.join(", ")}`
    )
  }

  const fileSizeMB = file.size / (1024 * 1024)
  console.log("Kích thước file hiện tại:", fileSizeMB.toFixed(2), "MB")

  if (fileSizeMB <= maxSizeMB) {
    return { file, wasCompressed: false }
  }

  const { shouldCompress, quality } = await onConfirm(
    `Ảnh của bạn có kích thước ${fileSizeMB.toFixed(2)}MB, vượt quá giới hạn ${maxSizeMB}MB. Bạn có muốn nén ảnh không?`
  )

  if (shouldCompress) {
    const compressedFile = await compressImage(file, maxSizeMB, quality)
    const compressedSizeMB = compressedFile.size / (1024 * 1024)
    console.log(
      "Kích thước file sau khi nén:",
      compressedSizeMB.toFixed(2),
      "MB"
    )
    return { file: compressedFile, wasCompressed: true }
  }

  throw new Error("Hủy thao tác")
}
