import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function PageviewsTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Đường dẫn</TableHead>
            <TableHead>Tiêu đề trang</TableHead>
            <TableHead>Lượt xem</TableHead>
            <TableHead className="text-right">Thời gian TB</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">/admin</TableCell>
            <TableCell>Dashboard | Admin CNC Future</TableCell>
            <TableCell>5,842</TableCell>
            <TableCell className="text-right">4m 15s</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">/admin?tab=analytics</TableCell>
            <TableCell>Phân tích & Thống kê | Admin CNC Future</TableCell>
            <TableCell>3,721</TableCell>
            <TableCell className="text-right">5m 32s</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">/admin/products</TableCell>
            <TableCell>Quản lý sản phẩm | Admin CNC Future</TableCell>
            <TableCell>4,562</TableCell>
            <TableCell className="text-right">6m 10s</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">/admin/blog</TableCell>
            <TableCell>Quản lý blog | Admin CNC Future</TableCell>
            <TableCell>2,845</TableCell>
            <TableCell className="text-right">3m 45s</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">/admin/contacts</TableCell>
            <TableCell>Quản lý liên hệ | Admin CNC Future</TableCell>
            <TableCell>1,932</TableCell>
            <TableCell className="text-right">2m 20s</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">/admin/website</TableCell>
            <TableCell>Cài đặt trang web | Admin CNC Future</TableCell>
            <TableCell>2,156</TableCell>
            <TableCell className="text-right">4m 05s</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

