import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function VisitorsTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Thiết bị</TableHead>
            <TableHead>Trình duyệt</TableHead>
            <TableHead>Người dùng</TableHead>
            <TableHead className="text-right">Tỉ lệ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Desktop</TableCell>
            <TableCell>Chrome</TableCell>
            <TableCell>6,824</TableCell>
            <TableCell className="text-right">42.3%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Mobile</TableCell>
            <TableCell>Chrome</TableCell>
            <TableCell>5,291</TableCell>
            <TableCell className="text-right">28.5%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Mobile</TableCell>
            <TableCell>Safari</TableCell>
            <TableCell>3,105</TableCell>
            <TableCell className="text-right">16.2%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Desktop</TableCell>
            <TableCell>Firefox</TableCell>
            <TableCell>1,328</TableCell>
            <TableCell className="text-right">8.1%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Desktop</TableCell>
            <TableCell>Safari</TableCell>
            <TableCell>593</TableCell>
            <TableCell className="text-right">4.9%</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

