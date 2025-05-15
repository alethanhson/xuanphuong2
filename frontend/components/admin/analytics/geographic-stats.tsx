'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface RegionData {
  region: string
  city?: string
  visitorCount: number
  pageViews: number
  percentage: number
}

const GeographicStats = ({ data }: { data: RegionData[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thống kê theo khu vực</CardTitle>
        <CardDescription>Chi tiết lượt truy cập theo tỉnh thành tại Việt Nam</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Khu vực</TableHead>
              <TableHead>Thành phố</TableHead>
              <TableHead>Lượt truy cập</TableHead>
              <TableHead>Lượt xem trang</TableHead>
              <TableHead className="text-right">Tỷ lệ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={`${item.region}-${item.city || 'unknown'}`}>
                <TableCell className="font-medium">{item.region}</TableCell>
                <TableCell>{item.city || '—'}</TableCell>
                <TableCell>{item.visitorCount.toLocaleString()}</TableCell>
                <TableCell>{item.pageViews.toLocaleString()}</TableCell>
                <TableCell className="text-right">{item.percentage}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default GeographicStats
