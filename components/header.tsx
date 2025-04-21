"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ChevronDown, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-sm shadow-md" : "bg-white border-b"
      }`}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src={"/placeholder.svg"}
              alt="CNC Future Logo"
              width={150}
              height={40}
              className="h-8 md:h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              href="/"
              className="px-2 lg:px-3 py-2 text-sm font-medium text-zinc-700 hover:text-primary rounded-md transition-colors"
            >
              Trang chủ
            </Link>
            <div className="relative group">
              <button
                className="px-2 lg:px-3 py-2 text-sm font-medium text-zinc-700 hover:text-primary rounded-md flex items-center transition-colors"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Sản phẩm
                <ChevronDown className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-gray-100 overflow-hidden">
                <div className="py-2">
                  <Link
                    href="/products"
                    className="block px-4 py-2 text-sm text-zinc-700 hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    Tất cả sản phẩm
                  </Link>
                  <Link
                    href="/products?category=wood"
                    className="block px-4 py-2 text-sm text-zinc-700 hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    Máy CNC Gỗ
                  </Link>
                  <Link
                    href="/products?category=metal"
                    className="block px-4 py-2 text-sm text-zinc-700 hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    Máy CNC Kim Loại
                  </Link>
                  <Link
                    href="/products?category=laser"
                    className="block px-4 py-2 text-sm text-zinc-700 hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    Máy CNC Laser
                  </Link>
                </div>
              </div>
            </div>
            <Link
              href="/services"
              className="px-2 lg:px-3 py-2 text-sm font-medium text-zinc-700 hover:text-primary rounded-md transition-colors"
            >
              Dịch vụ
            </Link>
            <Link
              href="/blog"
              className="px-2 lg:px-3 py-2 text-sm font-medium text-zinc-700 hover:text-primary rounded-md transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/customers"
              className="px-2 lg:px-3 py-2 text-sm font-medium text-zinc-700 hover:text-primary rounded-md transition-colors"
            >
              Khách hàng
            </Link>
            <Link
              href="/about"
              className="px-2 lg:px-3 py-2 text-sm font-medium text-zinc-700 hover:text-primary rounded-md transition-colors"
            >
              Giới thiệu
            </Link>
            <Link
              href="/contact"
              className="px-2 lg:px-3 py-2 text-sm font-medium text-zinc-700 hover:text-primary rounded-md transition-colors"
            >
              Liên hệ
            </Link>
          </nav>

          {/* Contact Button */}
          <div className="hidden md:flex items-center">
            <a
              href="tel:0355197235"
              className="flex items-center text-primary font-medium hover:text-primary/80 transition-colors"
            >
              <Phone className="mr-2 h-4 w-4" />
              <span>035.519.7235</span>
            </a>
            <Button className="ml-4 shadow-sm hover:shadow-md transition-all">Báo giá</Button>
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
        <div className="md:hidden fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" onClick={toggleMenu}>
          <div
            className="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <Link href="/" className="flex items-center" onClick={toggleMenu}>
                <Image
                  src={"/placeholder.svg"}
                  alt="CNC Future Logo"
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
              <div className="space-y-1">
                <Link
                  href="/"
                  className="block py-3 px-4 text-base font-medium text-zinc-700 hover:bg-zinc-50 hover:text-primary rounded-md transition-colors"
                  onClick={toggleMenu}
                >
                  Trang chủ
                </Link>

                <div className="py-1">
                  <button
                    className="flex items-center justify-between w-full py-3 px-4 text-base font-medium text-zinc-700 hover:bg-zinc-50 hover:text-primary rounded-md transition-colors"
                    onClick={() => {
                      const submenu = document.getElementById("products-submenu")
                      if (submenu) {
                        submenu.classList.toggle("hidden")
                      }
                    }}
                  >
                    <span>Sản phẩm</span>
                    <ChevronDown className="h-5 w-5" />
                  </button>
                  <div id="products-submenu" className="hidden pl-4 mt-1 space-y-1">
                    <Link
                      href="/products"
                      className="block py-2 px-4 text-base text-zinc-700 hover:bg-zinc-50 hover:text-primary rounded-md transition-colors"
                      onClick={toggleMenu}
                    >
                      Tất cả sản phẩm
                    </Link>
                    <Link
                      href="/products?category=wood"
                      className="block py-2 px-4 text-base text-zinc-700 hover:bg-zinc-50 hover:text-primary rounded-md transition-colors"
                      onClick={toggleMenu}
                    >
                      Máy CNC Gỗ
                    </Link>
                    <Link
                      href="/products?category=metal"
                      className="block py-2 px-4 text-base text-zinc-700 hover:bg-zinc-50 hover:text-primary rounded-md transition-colors"
                      onClick={toggleMenu}
                    >
                      Máy CNC Kim Loại
                    </Link>
                    <Link
                      href="/products?category=laser"
                      className="block py-2 px-4 text-base text-zinc-700 hover:bg-zinc-50 hover:text-primary rounded-md transition-colors"
                      onClick={toggleMenu}
                    >
                      Máy CNC Laser
                    </Link>
                  </div>
                </div>

                <Link
                  href="/services"
                  className="block py-3 px-4 text-base font-medium text-zinc-700 hover:bg-zinc-50 hover:text-primary rounded-md transition-colors"
                  onClick={toggleMenu}
                >
                  Dịch vụ
                </Link>
                <Link
                  href="/blog"
                  className="block py-3 px-4 text-base font-medium text-zinc-700 hover:bg-zinc-50 hover:text-primary rounded-md transition-colors"
                  onClick={toggleMenu}
                >
                  Blog
                </Link>
                <Link
                  href="/customers"
                  className="block py-3 px-4 text-base font-medium text-zinc-700 hover:bg-zinc-50 hover:text-primary rounded-md transition-colors"
                  onClick={toggleMenu}
                >
                  Khách hàng
                </Link>
                <Link
                  href="/about"
                  className="block py-3 px-4 text-base font-medium text-zinc-700 hover:bg-zinc-50 hover:text-primary rounded-md transition-colors"
                  onClick={toggleMenu}
                >
                  Giới thiệu
                </Link>
                <Link
                  href="/contact"
                  className="block py-3 px-4 text-base font-medium text-zinc-700 hover:bg-zinc-50 hover:text-primary rounded-md transition-colors"
                  onClick={toggleMenu}
                >
                  Liên hệ
                </Link>
              </div>

              <div className="mt-6 pt-6 border-t border-zinc-200">
                <a
                  href="tel:0355197235"
                  className="flex items-center py-3 px-4 text-base font-medium text-primary hover:bg-primary/5 rounded-md transition-colors"
                  onClick={toggleMenu}
                >
                  <Phone className="mr-3 h-5 w-5" />
                  <span>035.519.7235</span>
                </a>
                <div className="px-4 mt-3">
                  <Button className="w-full shadow-sm" onClick={toggleMenu}>
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

