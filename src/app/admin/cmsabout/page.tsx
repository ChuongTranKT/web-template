"use client"
import React, { useEffect, useState } from "react"
import { Editor, EditorTextChangeEvent } from "primereact/editor"
import { TextField, Button, CircularProgress } from "@mui/material"
import { RootState } from "@/store/store"
import { useDispatch, useSelector } from "react-redux"
import { setAboutUs } from "@/store/slices/aboutUsSlice"
import { APIGetAboutUs, APIUpdateAboutUs } from "@/services/aboutUs"

interface AboutUsData {
  _id: string
  company_name: string
  logo: string
  slogan: string
  description: string
  history: string
  vision: string
  open_time: string
  address: string
  phone: string
  email: string
  facebook_link: string
  twitter_link: string
  instagram_link: string
  linkedin_link: string
  map: string
  customer?: string
  createdAt?: string
  updatedAt?: string
}

interface FormData {
  title: string
  editorContent: string
  titleVision: string
  editorVision: string
  titleMission: string
  editorMission: string
  titleDescription: string
  editorDescription: string
  [key: string]: string
}

interface VisibleFields {
  history: boolean
  vision: boolean
  mission: boolean
  description: boolean
  [key: string]: boolean
}

export default function CmsAbout() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    editorContent: "",
    titleVision: "",
    editorVision: "",
    titleMission: "",
    editorMission: "",
    titleDescription: "",
    editorDescription: "",
  })
  const [loading, setLoading] = useState(false)
  const [visibleFields, setVisibleFields] = useState<VisibleFields>({
    history: false,
    vision: false,
    mission: false,
    description: false,
  })

  const aboutUs = useSelector(
    (state: RootState) => state.aboutUs.aboutUs
  ) as AboutUsData
  const dispatch = useDispatch()

  // Lấy dữ liệu từ API và cập nhật vào state
  const handleGetAboutUs = async () => {
    try {
      const response = await APIGetAboutUs()
      if (response?.status === 200 && response.data) {
        dispatch(setAboutUs(response.data))

        const extractContent = (data: string) => {
          const titleMatch = data.match(/title:(.*?)\|editor:/)
          const editorMatch = data.match(/\|editor:(.*)/)
          return {
            title: titleMatch ? titleMatch[1].trim() : "",
            content: editorMatch ? editorMatch[1].trim() : "",
          }
        }

        const { title: missionTitle, content: missionContent } = extractContent(
          response.data.mission || ""
        )
        const { title: visionTitle, content: visionContent } = extractContent(
          response.data.vision || ""
        )
        const { title: historyTitle, content: historyContent } = extractContent(
          response.data.history || ""
        )
        const { title: descriptionTitle, content: descriptionContent } =
          extractContent(response.data.description || "")

        setFormData({
          title: historyTitle,
          editorContent: historyContent,
          titleVision: visionTitle,
          editorVision: visionContent,
          titleMission: missionTitle,
          editorMission: missionContent,
          editorDescription: descriptionContent,
          titleDescription: descriptionTitle,
        })
      }
    } catch (error) {
      console.error("❌ Lỗi khi lấy dữ liệu About Us:", error)
    }
  }

  useEffect(() => {
    handleGetAboutUs() // Gọi API khi component mount
  }, [])

  // Cập nhật dữ liệu lên API
  const handleUpdateAboutUs = async () => {
    if (!aboutUs || !aboutUs._id) {
      console.warn("⚠ Dữ liệu About Us chưa sẵn sàng!")
      return
    }

    try {
      setLoading(true)

      const { _id, customer, createdAt, updatedAt, ...restData } = aboutUs

      const updatedData = {
        ...restData,
        history: `title:${formData.title}|editor:${formData.editorContent}`,
        vision: `title:${formData.titleVision}|editor:${formData.editorVision}`,
        mission: `title:${formData.titleMission}|editor:${formData.editorMission}`,
        description: `title:${formData.titleDescription}|editor:${formData.editorDescription}`,
      }

      const response = await APIUpdateAboutUs(updatedData, aboutUs._id)

      if (response?.status === 200) {
        handleGetAboutUs() // Refresh Redux và lấy lại dữ liệu mới
      }
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật About Us:", error)
    } finally {
      setLoading(false)
    }
  }

  // Unified function to handle editor content change
  const handleEditorChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Reusable Editor Component with visibility check
  const renderEditorSection = (
    titleField: string,
    contentField: string,
    section: string
  ) => (
    <>
      <TextField
        value={formData[titleField]}
        onChange={(e) => handleEditorChange(titleField, e.target.value)}
        label={`Nhập tiêu đề ${titleField}`}
        fullWidth
        margin="normal"
      />
      {visibleFields[section] && (
        <div className="card">
          <Editor
            value={formData[contentField]}
            onTextChange={(e: EditorTextChangeEvent) =>
              handleEditorChange(contentField, e.htmlValue || "")
            }
            style={{ height: "320px", padding: "20px" }}
          />
        </div>
      )}
    </>
  )

  return (
    <div>
      {/* Conditionally display sections */}
      <Button
        onClick={() =>
          setVisibleFields({
            ...visibleFields,
            history: !visibleFields.history,
          })
        }
      >
        Chỉnh sửa chi tiết lịch sử
      </Button>
      {renderEditorSection("title", "editorContent", "history")}

      <Button
        onClick={() =>
          setVisibleFields({ ...visibleFields, vision: !visibleFields.vision })
        }
      >
        Chỉnh sửa chi tiết tầm nhìn
      </Button>
      {renderEditorSection("titleVision", "editorVision", "vision")}

      <Button
        onClick={() =>
          setVisibleFields({
            ...visibleFields,
            mission: !visibleFields.mission,
          })
        }
      >
        chỉnh sửa chi tiết
      </Button>
      {renderEditorSection("titleMission", "editorMission", "mission")}

      <Button
        onClick={() =>
          setVisibleFields({
            ...visibleFields,
            description: !visibleFields.description,
          })
        }
      >
        chỉnh sửa chi tiết
      </Button>
      {renderEditorSection(
        "titleDescription",
        "editorDescription",
        "description"
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleUpdateAboutUs}
        disabled={loading}
        style={{ marginTop: 20 }}
      >
        {loading ? <CircularProgress size={24} /> : "Cập nhật dữ liệu"}
      </Button>
    </div>
  )
}
