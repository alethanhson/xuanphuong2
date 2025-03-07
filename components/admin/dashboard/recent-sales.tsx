import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentSales() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9 mr-3">
          <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
          <AvatarFallback>OM</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <p className="text-sm font-medium">Nguyễn Văn A</p>
          <p className="text-sm text-muted-foreground">contact@xuongmocthanhtam.com</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-sm font-medium">Yêu cầu báo giá</p>
          <p className="text-sm text-muted-foreground">Woodmaster 500</p>
        </div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9 mr-3">
          <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
          <AvatarFallback>JL</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <p className="text-sm font-medium">Công ty TNHH Kim Loại Tân Tiến</p>
          <p className="text-sm text-muted-foreground">sales@tantienmetal.com</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-sm font-medium">Đã liên hệ</p>
          <p className="text-sm text-muted-foreground">MetalPro 700</p>
        </div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9 mr-3">
          <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
          <AvatarFallback>IN</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <p className="text-sm font-medium">Trần Thị B</p>
          <p className="text-sm text-muted-foreground">tranthi@gmail.com</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-sm font-medium">Yêu cầu tư vấn</p>
          <p className="text-sm text-muted-foreground">LaserTech 500</p>
        </div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9 mr-3">
          <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
          <AvatarFallback>SD</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <p className="text-sm font-medium">Nội Thất Hiện Đại</p>
          <p className="text-sm text-muted-foreground">info@noithathiendai.vn</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-sm font-medium">Đã liên hệ</p>
          <p className="text-sm text-muted-foreground">Báo giá phụ kiện</p>
        </div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9 mr-3">
          <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
          <AvatarFallback>ZJ</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <p className="text-sm font-medium">Lê Văn C</p>
          <p className="text-sm text-muted-foreground">levanc@company.com</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-sm font-medium">Yêu cầu gọi lại</p>
          <p className="text-sm text-muted-foreground">Dịch vụ bảo trì</p>
        </div>
      </div>
    </div>
  )
}

