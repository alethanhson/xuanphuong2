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
            <TableCell className="font-medium">/</TableCell>
            <TableCell>Trang chủ | CNC Future</TableCell>
            <TableCell>12,345</TableCell>
            <TableCell className="text-right">2m 45s</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">/products</TableCell>
            <TableCell>Sản phẩm | CNC Future</TableCell>
            <TableCell>8,752</TableCell>
            <TableCell className="text-right">3m 12s</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">/products/cnc-woodmaster-500</TableCell>
            <TableCell>CNC WoodMaster 500 | CNC Future</TableCell>
            <TableCell>4,271</TableCell>
            <TableCell className="text-right">4m 30s</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">/contact</TableCell>
            <TableCell>Liên hệ | CNC Future</TableCell>
            <TableCell>3,842</TableCell>
            <TableCell className="text-right">2m 10s</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">/blog</TableCell>
            <TableCell>Blog & Tin tức | CNC Future</TableCell>
            <TableCell>2,945</TableCell>
            <TableCell className="text-right">3m 25s</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

