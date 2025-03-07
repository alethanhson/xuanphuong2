import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="mt-4 text-2xl font-semibold">Không tìm thấy trang</h2>
      <p className="mt-2 text-zinc-600 max-w-md">Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
      <Button asChild className="mt-8">
        <Link href="/">Quay lại trang chủ</Link>
      </Button>
    </div>
  )
}

