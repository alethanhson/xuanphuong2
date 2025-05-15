import { useState, useEffect } from 'react'

/**
 * Hook để kiểm tra xem code có đang chạy ở môi trường client hay không.
 * Giúp tránh các lỗi hydration khi sử dụng API chỉ có trên trình duyệt.
 * 
 * @returns {boolean} true nếu đang chạy trên client (trình duyệt), false nếu đang chạy trên server
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}

export default useIsClient 