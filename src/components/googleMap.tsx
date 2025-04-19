import { useSelector, useDispatch } from "react-redux"
import { setAboutUs } from "@/store/slices/aboutUsSlice"
import { APIGetAboutUs } from "@/services/aboutUs"
import { RootState } from "@/store/store"
import { useEffect } from "react"

const GoogleMap = () => {
  const aboutUs = useSelector((state: RootState) => state.aboutUs.aboutUs)
  const dispatch = useDispatch()
  const handleGetAboutUs = async () => {
    try {
      const response = await APIGetAboutUs()
      if (response?.status === 200) {
        dispatch(setAboutUs(response.data))
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    handleGetAboutUs()
  }, [])
  return (
    <div className="mt-[87px] flex w-full justify-center md:mt-[102px] md:pb-[35px]">
      <iframe
        src={aboutUs.map}
        width="1400"
        height="714"
        style={{ border: 5 }}
        allowFullScreen
        loading="lazy"
      ></iframe>
    </div>
  )
}

export default GoogleMap
