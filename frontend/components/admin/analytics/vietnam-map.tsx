'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface RegionData {
  region: string
  visitorCount: number
  percentage: number
}

const VietnamMap = ({ data }: { data: RegionData[] }) => {
  // This is a simplified version - in a real implementation, you would use a proper SVG map of Vietnam
  return (
    <Card>
      <CardHeader>
        <CardTitle>Phân bố người dùng theo khu vực</CardTitle>
        <CardDescription>Bản đồ phân bố người dùng tại Việt Nam</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] relative bg-muted rounded-md p-4 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Bản đồ phân bố người dùng tại Việt Nam</p>
            <div className="grid grid-cols-2 gap-4">
              {data.slice(0, 6).map((region) => (
                <div key={region.region} className="flex items-center justify-between p-2 bg-card rounded-md border">
                  <span className="font-medium">{region.region}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{region.visitorCount.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground">({region.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default VietnamMap
