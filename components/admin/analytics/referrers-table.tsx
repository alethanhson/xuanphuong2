import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function ReferrersTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nguồn</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead>Người dùng</TableHead>
            <TableHead className="text-right">Tỉ lệ chuyển đổi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>google.com</TableCell>
            <TableCell>
              <Badge variant="outline">Tìm kiếm</Badge>
            </TableCell>
            <TableCell>5,231</TableCell>
            <TableCell className="text-right">3.2%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>facebook.com</TableCell>
            <TableCell>
              <Badge variant="outline">Mạng xã hội</Badge>
            </TableCell>
            <TableCell>2,845</TableCell>
            <TableCell className="text-right">2.4%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>youtube.com</TableCell>
            <TableCell>
              <Badge variant="outline">Mạng xã hội</Badge>
            </TableCell>
            <TableCell>1,582</TableCell>
            <TableCell className="text-right">1.9%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>congnghemoi.com.vn</TableCell>
            <TableCell>
              <Badge variant="outline">Liên kết</Badge>
            </TableCell>
            <TableCell>942</TableCell>
            <TableCell className="text-right">4.7%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>(direct)</TableCell>
            <TableCell>
              <Badge variant="outline">Trực tiếp</Badge>
            </TableCell>
            <TableCell>3,291</TableCell>
            <TableCell className="text-right">5.2%</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

