import Image from "next/image"

import { StaticImageData } from "next/image"

interface ImgProps {
  src: string | StaticImageData
  alt: string
  w: number
  h: number
  className?: string
}
export default function Img({ src, alt = "img", w, h, className }: ImgProps) {
  return (
    <div className={className}>
      <Image
        src={src}
        alt={alt}
        width={w}
        height={h}
        quality={100}
        objectFit=""
      />
    </div>
  )
}
