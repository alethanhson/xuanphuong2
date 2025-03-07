import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function VisitorsTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Quốc gia</TableHead>
            <TableHead>Thành phố</TableHead>
            <TableHead>Người dùng</TableHead>
            <TableHead className="text-right">Tỉ lệ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Việt Nam</TableCell>
            <TableCell>Hồ Chí Minh</TableCell>
            <TableCell>8,352</TableCell>
            <TableCell className="text-right">42.5%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Việt Nam</TableCell>
            <TableCell>Hà Nội</TableCell>
            <TableCell>5,212</TableCell>
            <TableCell className="text-right">28.3%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Việt Nam</TableCell>
            <TableCell>Đà Nẵng</TableCell>
            <TableCell>1,845</TableCell>
            <TableCell className="text-right">9.2%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Việt Nam</TableCell>
            <TableCell>Cần Thơ</TableCell>
            <TableCell>982</TableCell>
            <TableCell className="text-right">5.1%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Việt Nam</TableCell>
            <TableCell>Khác</TableCell>
            <TableCell>2,450</TableCell>
            <TableCell className="text-right">14.9%</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

