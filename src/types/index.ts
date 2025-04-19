export interface GalleryProductProps {
  hoveredColor: { src: string } | null
  status: boolean
  images: string[]
}

export interface AccordionItem {
  id: number
  description: string
  title: string
}

export interface Product {
  material: string
  warranty: string
  description: string
  product_name: string
  code: string
  price: number
  images: string[]
  classification?: Array<{
    classifications: Array<{
      classification_name: string
      classification_value: string
    }>
    images: string
  }>
}

export interface RelatedProductsProps {
  product: Product[]
  onProductSelect: (id: number) => void
}
