import { motion } from "framer-motion"
import Image from "next/image"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
export default function ContactButton() {
  const aboutUs = useSelector((state: RootState) => state.aboutUs.aboutUs)

  return (
    <div className="relative flex h-[50px] w-[191px] items-center justify-center">
      {/* Hiệu ứng chiếu sáng màu xanh */}
      <div className="absolute inset-0 animate-pulse rounded-full bg-[#79BCCF] opacity-50 blur-xl"></div>

      {/* Nút chính với hiệu ứng bounce mượt hơn */}
      <motion.button
        animate={{
          y: [0, -32, 0, -18, 0], // Nảy cao hơn và đều hơn
          transition: {
            repeat: Infinity,
            duration: 1.7, // Tăng thời gian cho hiệu ứng mượt mà hơn
            ease: "easeInOut",
            repeatDelay: 1.6, // Rút ngắn thời gian trễ giữa các lần nhảy
          },
        }}
        whileTap={{ scale: 0.95 }}
        className="relative flex h-full w-full items-center justify-center gap-2 rounded-full bg-white text-[18px] font-semibold text-[#79BCCF] shadow-md transition-all"
      >
        <a href={`tel:${aboutUs.phone}`}>Liên hệ</a>
        <Image
          src="/assets/icons/icRight.png"
          alt="Right Arrow"
          width={8}
          height={12}
        />
      </motion.button>
    </div>
  )
}
