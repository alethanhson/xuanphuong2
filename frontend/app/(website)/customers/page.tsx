import type { Metadata } from "next"
import PageHeader from "@/components/page-header"

export const metadata: Metadata = {
  title: "Khách Hàng | CNC Future",
  description: "Khám phá câu chuyện thành công và đánh giá từ khách hàng của chúng tôi",
}

export default function CustomersPage() {
  return (
    <>
      <PageHeader
        title="Khách Hàng"
        description="Khám phá câu chuyện thành công và đánh giá từ khách hàng của chúng tôi"
        backgroundImage="/customers-header.jpg"
      />

      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Nội dung đang được cập nhật</h2>
          <p className="text-zinc-600 max-w-2xl mx-auto">
            Thông tin về khách hàng đang trong quá trình cập nhật. Vui lòng quay lại sau.
          </p>
        </div>
      </section>
    </>
  )
}

