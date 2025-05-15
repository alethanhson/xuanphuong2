"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Check, X, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { ConsultationService } from "@/lib/consultation-service"
import type { ConsultationRequest } from "@/lib/consultation-service"

export default function ConsultationRequestsPage() {
  const [requests, setRequests] = useState<ConsultationRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<ConsultationRequest | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    fetchRequests()
  }, [])

  // Fetch yêu cầu tư vấn từ API
  const fetchRequests = async () => {
    setIsLoading(true)
    try {
      const response = await ConsultationService.getConsultationRequests()
      if (response.error) {
        toast.error(response.error.message || "Không thể tải dữ liệu")
        return
      }
      setRequests(response.data || [])
    } catch (error) {
      console.error("Error fetching consultation requests:", error)
      toast.error("Đã xảy ra lỗi khi tải dữ liệu")
    } finally {
      setIsLoading(false)
    }
  }

  // Cập nhật trạng thái yêu cầu
  const updateRequestStatus = async (id: string, status: string) => {
    try {
      const response = await ConsultationService.updateConsultationStatus(id, status)
      if (response.error) {
        toast.error(response.error.message || "Không thể cập nhật trạng thái")
        return
      }
      
      // Cập nhật UI
      setRequests(prev => 
        prev.map(req => 
          req.id === id ? { ...req, status, responded_at: status === 'responded' ? new Date().toISOString() : req.responded_at } : req
        )
      )
      
      toast.success("Đã cập nhật trạng thái thành công")
    } catch (error) {
      console.error("Error updating request status:", error)
      toast.error("Đã xảy ra lỗi khi cập nhật trạng thái")
    }
  }

  // Hiển thị badge màu tương ứng với trạng thái
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Chờ xử lý</Badge>
      case 'contacted':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Đã liên hệ</Badge>
      case 'responded':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Đã tư vấn</Badge>
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Đã hủy</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Định dạng thời gian
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A"
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi })
  }

  // Xem chi tiết yêu cầu
  const viewRequestDetail = (request: ConsultationRequest) => {
    setSelectedRequest(request)
    setDialogOpen(true)
  }

  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Quản lý yêu cầu tư vấn</CardTitle>
          <CardDescription>
            Xem và quản lý các yêu cầu tư vấn từ khách hàng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div>
              <Button 
                onClick={fetchRequests} 
                disabled={isLoading}
                variant="outline"
              >
                {isLoading ? "Đang tải..." : "Làm mới"}
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              Tổng số: {requests.length} yêu cầu
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead className="w-[180px]">Thời gian</TableHead>
                  <TableHead className="w-[200px]">Họ tên</TableHead>
                  <TableHead className="w-[200px]">Email</TableHead>
                  <TableHead className="w-[150px]">Điện thoại</TableHead>
                  <TableHead className="w-[150px]">Trạng thái</TableHead>
                  <TableHead className="w-[200px]">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Đang tải dữ liệu...
                    </TableCell>
                  </TableRow>
                ) : requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Chưa có yêu cầu tư vấn nào
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map(request => (
                    <TableRow key={request.id}>
                      <TableCell className="font-mono text-xs">
                        {request.id.substring(0, 8)}...
                      </TableCell>
                      <TableCell>
                        {formatDate(request.created_at)}
                      </TableCell>
                      <TableCell>{request.full_name}</TableCell>
                      <TableCell>{request.email}</TableCell>
                      <TableCell>{request.phone || "N/A"}</TableCell>
                      <TableCell>{getStatusBadge(request.status || "pending")}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => viewRequestDetail(request)}
                          >
                            Chi tiết
                          </Button>
                          
                          <Select
                            value={request.status || "pending"}
                            onValueChange={(value) => updateRequestStatus(request.id, value)}
                          >
                            <SelectTrigger className="w-[130px]">
                              <SelectValue placeholder="Trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Chờ xử lý</SelectItem>
                              <SelectItem value="contacted">Đã liên hệ</SelectItem>
                              <SelectItem value="responded">Đã tư vấn</SelectItem>
                              <SelectItem value="cancelled">Đã hủy</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog chi tiết yêu cầu */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Chi tiết yêu cầu tư vấn</DialogTitle>
            <DialogDescription>
              Thông tin khách hàng đã gửi yêu cầu tư vấn
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Họ và tên</p>
                  <p className="text-base">{selectedRequest.full_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-base">{selectedRequest.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Điện thoại</p>
                  <p className="text-base">{selectedRequest.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Công ty</p>
                  <p className="text-base">{selectedRequest.company || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Thời gian yêu cầu</p>
                  <p className="text-base">{formatDate(selectedRequest.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Trạng thái</p>
                  <div className="pt-1">{getStatusBadge(selectedRequest.status || "pending")}</div>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium">Nội dung</p>
                <p className="text-base p-4 bg-muted rounded-md mt-1">
                  {selectedRequest.message || "Không có nội dung"}
                </p>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Đóng
                </Button>
                
                <div className="space-x-2">
                  <Button
                    variant="default"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      updateRequestStatus(selectedRequest.id, "responded")
                      setDialogOpen(false)
                    }}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Đánh dấu đã tư vấn
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => {
                      window.open(`mailto:${selectedRequest.email}?subject=Phản hồi yêu cầu tư vấn từ Tân Tiến Vinh`)
                    }}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Gửi email
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 