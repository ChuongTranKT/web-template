import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface Product {
  title: string
  description: string
}

interface AccordionProductsProps {
  products: Product[]
}

export function AccordionProducts({ products }: AccordionProductsProps) {
  const productsTitle = [
    "Thông tin sản phẩm",
    "Chính sách bảo hành",
    "Hướng dẫn bảo quản",
  ]
  const productLable = ["Chất liệu:", "Chính sách:", "Hướng dẫn:"]
  return (
    <Accordion type="single" collapsible className="w-full">
      {products.map((product, index) => (
        <AccordionItem key={index} value={`item-${index + 1}`}>
          <AccordionTrigger>{productsTitle[index]}</AccordionTrigger>
          <AccordionContent>
            {" "}
            <p className="font-bold">{productLable[index]}</p>
            {product.description}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
