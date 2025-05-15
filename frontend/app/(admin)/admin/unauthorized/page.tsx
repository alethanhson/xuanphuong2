import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldAlert } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="flex flex-col items-center max-w-md text-center">
        <ShieldAlert className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-3xl font-bold tracking-tight mb-2">Không có quyền truy cập</h1>
        <p className="text-muted-foreground mb-6">
          Bạn không có quyền truy cập vào trang quản trị. Vui lòng liên hệ với quản trị viên nếu bạn cho rằng đây là
          lỗi.
        </p>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/">Về trang chủ</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/login">Đăng nhập lại</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

