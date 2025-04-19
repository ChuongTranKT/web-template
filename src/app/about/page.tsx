"use client"

import { APIGetAboutUs } from "@/services/aboutUs"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { setAboutUs } from "@/store/slices/aboutUsSlice"
import { useEffect, useState } from "react"
import Footer from "@/components/footer"
import AlertError from "@/components/alert/AlertError"
import { AlertTitle } from "@mui/material"

export default function IntroducePage() {
  const aboutUs = useSelector((state: RootState) => state.aboutUs.aboutUs)
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    title: "",
    editorContent: "",
    titleVision: "",
    editorVision: "",
    titleMission: "",
    editorMission: "",
    titleDescription: "",
    editorDescription: "",
  })

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
    handleGetAboutUs()
  }, [])

  const contents = [
    { title: formData.title, text: formData.editorContent },
    { title: formData.titleVision, text: formData.editorVision },
    { title: formData.titleMission, text: formData.editorMission },
    { title: formData.titleDescription, text: formData.editorDescription },
  ]

  return (
    <div className="relative w-full">
      <div className="mx-auto mt-[100px] max-w-[1307px] bg-gray-100 p-3 sm:p-5 md:p-8">
        {contents.map((content, index) => (
          <div key={index} className="mb-10">
            <h2 className="text-xl font-bold text-black md:text-2xl xl:text-2xl">
              {content.title}
            </h2>
            <div
              className="mt-2 text-xs text-gray-600 md:text-sm xl:text-sm"
              dangerouslySetInnerHTML={{ __html: content.text }}
            ></div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  )
}
