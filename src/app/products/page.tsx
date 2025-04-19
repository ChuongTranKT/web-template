"use client"
import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { Slider } from "@mui/material"
import Image from "next/image"
import Footer from "@/components/footer"
import Link from "next/link"
import { Pagination } from "@mui/material"

import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { setProduct } from "@/store/slices/productSlice"
import { APIGetAllProducts } from "@/services/product"
import { APIGetAllCategory } from "@/services/category"
import { CircularProgress } from "@mui/material"

import { setCategory } from "@/store/slices/categorySlice"
import { Fade, Grow } from "@mui/material"

const marks = [
  { value: 0, label: "0đ" },
  { value: 200000, label: "200.000đ" },
  { value: 500000, label: "500.000đ" },
  { value: 1000000, label: "1.000.000đ" },
  { value: 2000000, label: "2.000.000đ" },
  { value: 4000000, label: "4.000.000đ" },
]

const categoryList = [
  { id: "id1", name: "Giày thời trang" },
  { id: "id2", name: "Áo mùa đông" },
  { id: "id3", name: "Áo thun" },
  { id: "id4", name: "Phụ kiện" },
]

const productList = [
  {
    id: 1,
    name: "Áo Váy Dài",
    categoryId: "id1", // dùng ID thay vì tên
    size: "Medium",
    src: "/assets/images/sanpham.png",
    price: 1500000,
    code: "AVD",
  },

  // Thêm nhiều sản phẩm hơn nếu cần thiết
]
const createSlug = (name: string, id: number) => {
  return `${name.toLowerCase().replace(/\s+/g, "-")}-${id}`
}

export default function ProductPage() {
  const [priceRange, setPriceRange] = useState([0, 4000000]) // Default price range from 0 to 4.000.000
  const [formattedPrice, setFormattedPrice] = useState("")
  const [selectedCategories, setSelectedCategories] = useState({})
  const [selectedSizes, setSelectedSizes] = useState({
    Medium: false,
    Large: false,
    "Plus Size": false,
    "Extra Large": false,
  })
  const [filteredProducts, setFilteredProducts] = useState(productList)

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const ITEMS_PER_PAGE = 12

  const pathname = usePathname()
  const dispatch = useDispatch()
  const product = useSelector((state: RootState) => state.product.product) || []

  const categories = useSelector((state: RootState) => state.category.category)

  const [isLoading, setIsLoading] = useState(true)

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  )

  // Thêm state để kiểm soát animation
  const [loadingAnimation, setLoadingAnimation] = useState(true)

  const fetchAllproduct = async () => {
    try {
      setIsLoading(true)
      setLoadingAnimation(true)

      const response = await APIGetAllProducts(
        page,
        ITEMS_PER_PAGE,
        selectedCategoryId
      )

      if (response?.status === 200) {
        setTimeout(() => {
          dispatch(setProduct(response.data.content))
          const total = response.data.pagination.total
          const actualTotalPages = Math.max(
            1,
            Math.ceil(total / ITEMS_PER_PAGE)
          )
          setTotalPages(actualTotalPages)

          if (page > actualTotalPages) {
            setPage(1)
          }

          if (response.data.content.length === 0) {
            setFilteredProducts([])
          }
          setLoadingAnimation(false)
        }, 300)
      } else if (response?.status === 404) {
        dispatch(setProduct([]))
        setTotalPages(1)
        setPage(1)
      }
    } catch (error) {
      console.error("Failed to fetch products:", error)
      dispatch(setProduct([]))
      setTotalPages(1)
      setPage(1)
    } finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 300)
    }
  }

  // Gộp việc fetch categories và xử lý URL params vào một useEffect
  useEffect(() => {
    const initializeCategories = async () => {
      try {
        const response = await APIGetAllCategory()
        if (response?.status === 200) {
          dispatch(setCategory(response.data))

          // Tạo object selectedCategories ban đầu
          const initialSelectedCategories = response.data.reduce(
            (acc, category) => ({
              ...acc,
              [category._id]: false,
            }),
            {}
          )

          // Kiểm tra URL params
          const queryParams = new URLSearchParams(window.location.search)
          const categoryFromUrl = queryParams.get("category")

          // Nếu có category trong URL, set true cho category đó
          if (categoryFromUrl) {
            initialSelectedCategories[categoryFromUrl] = true
          }

          setSelectedCategories(initialSelectedCategories)
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }

    initializeCategories()
  }, [pathname]) // Cỉ chạy khi pathname thay đổi

  // Gọi API khi page hoặc selectedCategoryId thay đổi
  useEffect(() => {
    fetchAllproduct()
  }, [page, selectedCategoryId])

  // Effect to format price range
  useEffect(() => {
    setFormattedPrice(
      `${priceRange[0].toLocaleString("vi-VN")}đ - ${priceRange[1].toLocaleString("vi-VN")}đ`
    )
  }, [priceRange])
  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return "/assets/images/sanpham.png"

    // Nếu là URL đầy đủ (bắt đầu bằng http)
    if (imageUrl.startsWith("http")) {
      return imageUrl
    }

    // Nếu là đường dẫn tương đối (bắt đầu bằng /images)
    return `${process.env.NEXT_PUBLIC_API_URL_IMAGE}${imageUrl}`
  }

  // Cập nhật lại useEffect filter products
  // Cập nhật lại useEffect filter products
  useEffect(() => {
    const filtered = product.filter((item) => {
      // Kiểm tra giá
      const isPriceInRange =
        item.price >= priceRange[0] && item.price <= priceRange[1]

      // Kiểm tra category
      const hasSelectedCategories = Object.values(selectedCategories).some(
        (value) => value
      )

      // Nếu không có category nào được chọn, chỉ lọc theo giá
      if (!hasSelectedCategories) {
        return isPriceInRange
      }

      // Nếu có category được chọn, lọc theo cả category và giá
      if (item.category_id && selectedCategories[item.category_id._id]) {
        return isPriceInRange // Chỉ trả về true nếu thỏa mãn cả điều kiện category và giá
      }

      return false
    })

    // Nếu không có sản phẩm nào được lọc, thiết lập filteredProducts thành mảng rỗng
    if (filtered.length === 0) {
      setFilteredProducts([])
    } else {
      setFilteredProducts(filtered)
    }
  }, [selectedCategories, product, priceRange])
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prevState) => {
      const isCurrentlySelected = prevState[categoryId]
      const newState = Object.keys(prevState).reduce(
        (acc, key) => ({
          ...acc,
          [key]: false,
        }),
        {}
      )

      if (!isCurrentlySelected) {
        newState[categoryId] = true
        setSelectedCategoryId(categoryId)
      } else {
        setSelectedCategoryId(null)
      }

      resetPagination()
      return newState
    })
  }

  const handleSizeChange = (size: keyof typeof selectedSizes) => {
    setSelectedSizes((prevState) => ({
      ...prevState,
      [size]: !prevState[size],
    }))
  }

  // Cập nhật lại hàm handleChange cho thanh trượt giá
  const handleChange = (event: Event, newValue: number[]) => {
    setPriceRange(newValue)
  }

  // Logic for Pagination
  const indexOfLastProduct = page * ITEMS_PER_PAGE
  const indexOfFirstProduct = indexOfLastProduct - ITEMS_PER_PAGE
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  )

  // Thêm useEffect để theo dõi thay đổi page
  useEffect(() => {
    // Scroll to top với animation
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }, [page]) // Chạy mỗi khi page thay đổi

  // Hàm handlePageChange giữ nguyên đơn giản
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    setPage(newPage)
    // Scroll to top ngay lập tức
    window.scrollTo(0, 0)
  }

  const resetPagination = () => {
    setPage(1)
    setTotalPages(1)
  }

  return (
    <div>
      <div className="container flex flex-row">
        {/* Left content */}
        <div className="container sticky mt-[85px] h-[600px] w-[158px] border bg-[#efeeee] p-4 text-[7px] md:top-[110px] md:h-[600px] md:min-w-[240px] md:scale-[1] md:text-[14px] lg:text-[16px] xl:min-h-[700px] xl:min-w-[338px]">
          <p className="py-4 pt-[10px] text-[10px] font-bold md:text-[16px]">
            GIÁ
          </p>
          <div className="flex justify-between">
            <p>Khoảng</p>
            <p>{formattedPrice}</p>
          </div>
          <Slider
            value={priceRange}
            onChange={handleChange}
            min={0}
            max={4000000}
            step={1000}
            disableSwap
            sx={{
              color: "orange",
              "& .MuiSlider-thumb": {
                border: "2px solid white",
                width: 20,
                height: 20,
              },
              "& .MuiSlider-track": {
                backgroundColor: "orange",
              },
              "& .MuiSlider-rail": {
                backgroundColor: "#ddd",
              },
            }}
          />
          <div>
            <div>
              <p className="mt-4 text-[10px] font-bold sm:text-[16px]">
                SẢN PHẨM
              </p>
              <div className="mt-2 flex flex-col gap-[20px] p-3">
                {categories.map((category) => (
                  <label className="flex items-center gap-2" key={category._id}>
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={selectedCategories[category._id] || false}
                      onChange={() => handleCategoryChange(category._id)}
                    />
                    {category.category_name}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <p className="mt-4 text-[10px] font-bold md:text-[16px]">SIZE</p>
              <div className="mt-2 flex flex-col gap-[20px] p-3">
                {Object.keys(selectedSizes).map((size, index) => (
                  <label className="flex items-center gap-2" key={index}>
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={selectedSizes[size]}
                      onChange={() => handleSizeChange(size)}
                    />
                    {size}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="px-2 lg:px-10 xl:px-5"></div>
        {/* Right content */}
        <Fade in={true} timeout={500}>
          <div className="min-h[800px] mt-[110px] grid flex-[0,5] grid-cols-3 items-start justify-center gap-4 md:min-h-[600px] xl:min-h-[900px] xl:gap-8 xl:gap-x-[100px]">
            {isLoading ? (
              <Fade in={isLoading} timeout={400}>
                <div className="container mx-auto ml-[100px] flex h-[400px] w-full items-center justify-between md:ml-[200px] xl:ml-[300px]">
                  <CircularProgress />
                </div>
              </Fade>
            ) : filteredProducts.length === 0 ? (
              <Grow in={!loadingAnimation} timeout={500}>
                <div className="container flex h-[500px] items-center justify-between text-[10px] md:ml-[200px] md:text-[16px] xl:ml-[300px]">
                  Không có sản phẩm phù hợp
                </div>
              </Grow>
            ) : (
              filteredProducts.map((item, index) => (
                <Fade
                  in={!loadingAnimation}
                  timeout={500}
                  key={index}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <div className="relative h-[120px] w-[60px] gap-4 border md:h-[320px] md:w-[150px] xl:h-[470px] xl:w-[297px]">
                    <Link
                      href={`/products/${createSlug(item.product_name, item._id)}`}
                    >
                      <button className="block h-full w-full">
                        <Image
                          src={
                            item.images?.[0]
                              ? getImageUrl(item.images[0])
                              : "/assets/images/sanpham.png"
                          }
                          alt={item.product_name || "Product Image"}
                          width={297}
                          height={343}
                          quality={100}
                          className="absolute left-0 top-0 object-cover md:h-[200px] xl:h-[343px]"
                        />
                        <div className="mt-[65px] bg-[#79BCCF] text-center text-[5px] text-white md:mt-[210px] md:text-[13px] lg:text-[16px] xl:mt-[353px]">
                          <p className="font-bold">{item.product_name}</p>
                          <p>Mã: {item.code}</p>
                          <p>Giá: {item.price.toLocaleString("vi-VN")}đ</p>
                        </div>
                      </button>
                    </Link>
                  </div>
                </Fade>
              ))
            )}
          </div>
        </Fade>
      </div>

      {/* Pagination */}
      <Fade in={!isLoading} timeout={800}>
        <div className="my-8 flex min-h-[10px] scale-[0.4] justify-center md:scale-[0.7] lg:scale-[1]">
          {totalPages > 1 && (
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
              disabled={isLoading}
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "#000",
                },
                "& .Mui-selected": {
                  backgroundColor: "#f97316 !important",
                  color: "#fff",
                },
                "& .MuiPaginationItem-root:hover": {
                  backgroundColor: "#fdba74",
                },
              }}
            />
          )}
        </div>
      </Fade>

      <Footer />
    </div>
  )
}
