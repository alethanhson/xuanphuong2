"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ChevronDown, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { ProductService } from "@/lib/services/product.service"

// Định nghĩa kiểu dữ liệu cho Category
type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  created_at: string
  updated_at: string | null
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const pathname = usePathname()
  const submenuRef = useRef<HTMLDivElement>(null)
  const mobileSubmenuRef = useRef<HTMLDivElement>(null)

  // Lấy danh sách danh mục sản phẩm
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true)
        const { data, error } = await ProductService.getCategories()
        if (error) {
          console.error("Lỗi khi lấy danh mục:", error)
          return
        }
        
        if (data) {
          setCategories(data)
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error)
      } finally {
        setIsLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  // Theo dõi scroll để thay đổi style của header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Đóng submenu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (submenuRef.current && !submenuRef.current.contains(event.target as Node)) {
        setActiveSubmenu(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Đóng menu khi chuyển trang trên mobile
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleSubmenu = (name: string) => {
    setActiveSubmenu(activeSubmenu === name ? null : name)
  }

  // Kiểm tra đường dẫn hiện tại để thêm active style
  const isActive = (path: string) => {
    return pathname === path
  }

  const isProductActive = () => {
    return pathname.startsWith('/products')
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-sm shadow-lg" : "bg-white border-b"
      }`}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src={"/placeholder.svg"}
              alt="Tân Tiến Vinh Logo"
              width={150}
              height={40}
              className="h-8 md:h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-0.5 lg:space-x-1">
            <Link
              href="/"
              className={`px-3 lg:px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                isActive('/') 
                  ? "text-primary bg-primary/10 shadow-sm font-semibold" 
                  : "text-zinc-700 hover:text-primary hover:bg-primary/5"
              }`}
            >
              Trang chủ
            </Link>
            <div className="relative group" ref={submenuRef}>
              <button
                className={`px-3 lg:px-4 py-2 text-sm font-medium rounded-md flex items-center transition-all duration-200 ${
                  isProductActive() || activeSubmenu === 'products'
                    ? "text-primary bg-primary/10 shadow-sm font-semibold" 
                    : "text-zinc-700 hover:text-primary hover:bg-primary/5"
                }`}
                aria-haspopup="true"
                aria-expanded={activeSubmenu === 'products'}
                onClick={() => toggleSubmenu('products')}
              >
                Sản phẩm
                <ChevronDown className={`ml-1.5 h-4 w-4 transition-transform duration-300 ${
                  activeSubmenu === 'products' ? 'rotate-180' : ''
                }`} />
              </button>
              <div 
                className={`absolute top-full -left-1/4 mt-1 w-64 bg-white rounded-lg shadow-xl border-0 overflow-hidden transition-all duration-300 z-50 ${
                  activeSubmenu === 'products' 
                    ? "opacity-100 translate-y-0 visible scale-100" 
                    : "opacity-0 -translate-y-4 invisible scale-95 pointer-events-none"
                }`}
                style={{
                  boxShadow: activeSubmenu === 'products' ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' : 'none'
                }}
              >
                <div className="py-1">
                  <Link
                    href="/products"
                    className={`flex items-center px-4 py-3 text-sm transition-all duration-200 ${
                      isActive('/products') && !pathname.includes('?category=')
                        ? "text-primary bg-primary/10 font-semibold border-l-[3px] border-primary" 
                        : "text-zinc-700 hover:bg-primary/5 hover:text-primary hover:pl-5"
                    }`}
                  >
                    <span className="block ml-1">Tất cả sản phẩm</span>
                  </Link>
                  
                  {/* Danh sách danh mục sản phẩm động */}
                  {isLoadingCategories ? (
                    <div className="flex items-center px-4 py-3 text-sm text-zinc-500">
                      <span className="block ml-1">Đang tải...</span>
                    </div>
                  ) : (
                    categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/products?category=${category.slug}`}
                        className={`flex items-center px-4 py-3 text-sm transition-all duration-200 ${
                          pathname.includes(`?category=${category.slug}`)
                            ? "text-primary bg-primary/10 font-semibold border-l-[3px] border-primary" 
                            : "text-zinc-700 hover:bg-primary/5 hover:text-primary hover:pl-5"
                        }`}
                      >
                        <span className="block ml-1">{category.name}</span>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </div>
            <Link
              href="/services"
              className={`px-3 lg:px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                isActive('/services') 
                  ? "text-primary bg-primary/10 shadow-sm font-semibold" 
                  : "text-zinc-700 hover:text-primary hover:bg-primary/5"
              }`}
            >
              Dịch vụ
            </Link>
            {/* <Link
              href="/customers"
              className={`px-3 lg:px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                isActive('/customers') 
                  ? "text-primary bg-primary/10 shadow-sm font-semibold" 
                  : "text-zinc-700 hover:text-primary hover:bg-primary/5"
              }`}
            >
              Khách hàng
            </Link> */}
            <Link
              href="/about"
              className={`px-3 lg:px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                isActive('/about') 
                  ? "text-primary bg-primary/10 shadow-sm font-semibold" 
                  : "text-zinc-700 hover:text-primary hover:bg-primary/5"
              }`}
            >
              Giới thiệu
            </Link>
            <Link
              href="/contact"
              className={`px-3 lg:px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                isActive('/contact') 
                  ? "text-primary bg-primary/10 shadow-sm font-semibold" 
                  : "text-zinc-700 hover:text-primary hover:bg-primary/5"
              }`}
            >
              Liên hệ
            </Link>
          </nav>

          {/* Contact Button */}
          <div className="hidden md:flex items-center">
            <a
              href="tel:0979756103"
              className="flex items-center text-primary font-medium hover:text-primary/80 transition-colors"
            >
              <Phone className="mr-2 h-4 w-4" />
              <span>0979.756.103</span>
            </a>
            <Button className="ml-4 shadow-sm hover:shadow-md transition-all bg-primary hover:bg-primary/90">Báo giá</Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-zinc-700 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors touch-target"
              aria-label={isMenuOpen ? "Đóng menu" : "Mở menu"}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" 
          onClick={toggleMenu}
          style={{ animation: 'fadeIn 0.2s ease-out' }}
        >
          <div
            className="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-xl overflow-y-auto animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <Link href="/" className="flex items-center" onClick={toggleMenu}>
                <Image
                  src={"/placeholder.svg"}
                  alt="Tân Tiến Vinh Logo"
                  width={120}
                  height={32}
                  className="h-8 w-auto"
                />
              </Link>
              <button
                onClick={toggleMenu}
                className="p-2 rounded-md text-zinc-700 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                aria-label="Đóng menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="p-4">
              <div className="space-y-1.5">
                <Link
                  href="/"
                  className={`flex items-center py-3 px-4 text-base font-medium rounded-md transition-all duration-200 ${
                    isActive('/') 
                      ? "text-primary bg-primary/10 shadow-sm font-semibold" 
                      : "text-zinc-700 hover:bg-zinc-50 hover:text-primary"
                  }`}
                  onClick={toggleMenu}
                >
                  Trang chủ
                </Link>

                <div className="py-1" ref={mobileSubmenuRef}>
                  <button
                    className={`flex items-center justify-between w-full py-3 px-4 text-base font-medium rounded-md transition-all duration-200 ${
                      isProductActive() 
                        ? "text-primary bg-primary/10 shadow-sm font-semibold" 
                        : "text-zinc-700 hover:bg-zinc-50 hover:text-primary"
                    }`}
                    onClick={() => toggleSubmenu('mobile-products')}
                  >
                    <span>Sản phẩm</span>
                    <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${
                      activeSubmenu === 'mobile-products' ? 'rotate-180' : ''
                    }`} />
                  </button>
                  <div 
                    className={`pl-4 mt-1 space-y-1.5 overflow-hidden transition-all duration-300 ${
                      activeSubmenu === 'mobile-products' 
                        ? 'max-h-[500px] opacity-100' 
                        : 'max-h-0 opacity-0'
                    }`}
                  >
                    <Link
                      href="/products"
                      className={`flex items-center py-3 px-4 text-base rounded-md transition-all duration-200 ${
                        isActive('/products') && !pathname.includes('?category=')
                          ? "text-primary bg-primary/10 border-l-[3px] border-primary font-semibold" 
                          : "text-zinc-700 hover:bg-zinc-50 hover:text-primary hover:pl-5"
                      }`}
                      onClick={toggleMenu}
                    >
                      Tất cả sản phẩm
                    </Link>
                    
                    {/* Danh sách danh mục sản phẩm động cho mobile */}
                    {isLoadingCategories ? (
                      <div className="flex items-center py-3 px-4 text-base text-zinc-500">
                        Đang tải...
                      </div>
                    ) : (
                      categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/products?category=${category.slug}`}
                          className={`flex items-center py-3 px-4 text-base rounded-md transition-all duration-200 ${
                            pathname.includes(`?category=${category.slug}`)
                              ? "text-primary bg-primary/10 border-l-[3px] border-primary font-semibold" 
                              : "text-zinc-700 hover:bg-zinc-50 hover:text-primary hover:pl-5"
                          }`}
                          onClick={toggleMenu}
                        >
                          {category.name}
                        </Link>
                      ))
                    )}
                  </div>
                </div>

                <Link
                  href="/services"
                  className={`flex items-center py-3 px-4 text-base font-medium rounded-md transition-all duration-200 ${
                    isActive('/services') 
                      ? "text-primary bg-primary/10 shadow-sm font-semibold" 
                      : "text-zinc-700 hover:bg-zinc-50 hover:text-primary"
                  }`}
                  onClick={toggleMenu}
                >
                  Dịch vụ
                </Link>

                {/* <Link
                  href="/customers"
                  className={`flex items-center py-3 px-4 text-base font-medium rounded-md transition-all duration-200 ${
                    isActive('/customers') 
                      ? "text-primary bg-primary/10 shadow-sm font-semibold" 
                      : "text-zinc-700 hover:bg-zinc-50 hover:text-primary"
                  }`}
                  onClick={toggleMenu}
                >
                  Khách hàng
                </Link> */}

                <Link
                  href="/about"
                  className={`flex items-center py-3 px-4 text-base font-medium rounded-md transition-all duration-200 ${
                    isActive('/about') 
                      ? "text-primary bg-primary/10 shadow-sm font-semibold" 
                      : "text-zinc-700 hover:bg-zinc-50 hover:text-primary"
                  }`}
                  onClick={toggleMenu}
                >
                  Giới thiệu
                </Link>

                <Link
                  href="/contact"
                  className={`flex items-center py-3 px-4 text-base font-medium rounded-md transition-all duration-200 ${
                    isActive('/contact') 
                      ? "text-primary bg-primary/10 shadow-sm font-semibold" 
                      : "text-zinc-700 hover:bg-zinc-50 hover:text-primary"
                  }`}
                  onClick={toggleMenu}
                >
                  Liên hệ
                </Link>
              </div>

              <div className="mt-6 pt-6 border-t border-zinc-200">
                <a
                  href="tel:0979756103"
                  className="flex items-center py-3 px-4 text-base font-medium text-primary hover:bg-primary/5 rounded-md transition-colors"
                  onClick={toggleMenu}
                >
                  <Phone className="mr-3 h-5 w-5" />
                  <span>0979.756.103</span>
                </a>
                <div className="px-4 mt-3">
                  <Button className="w-full shadow-sm bg-primary hover:bg-primary/90" onClick={toggleMenu}>
                    Báo giá
                  </Button>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

