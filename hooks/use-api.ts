"use client"

import { useState, useEffect, useCallback } from "react"
import type { ApiResponse } from "@/types"
import { toast } from "@/components/ui/use-toast"

interface UseApiOptions<T, P> {
  onSuccess?: (data: T) => void
  onError?: (error: string) => void
  initialData?: T
  dependencies?: any[]
}

/**
 * Custom hook để xử lý các API request với loading state và error handling
 */
export function useApi<T, P = void>(
  apiFunction: (params?: P) => Promise<ApiResponse<T>>,
  options: UseApiOptions<T, P> = {},
) {
  const [data, setData] = useState<T | undefined>(options.initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(
    async (params?: P) => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await apiFunction(params)

        if (response.success) {
          setData(response.data)
          options.onSuccess?.(response.data)
          return response.data
        } else {
          setError(response.message || "Đã xảy ra lỗi")
          options.onError?.(response.message || "Đã xảy ra lỗi")
          toast({
            title: "Lỗi",
            description: response.message || "Đã xảy ra lỗi",
            variant: "destructive",
          })
          return undefined
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Đã xảy ra lỗi"
        setError(errorMessage)
        options.onError?.(errorMessage)
        toast({
          title: "Lỗi",
          description: errorMessage,
          variant: "destructive",
        })
        return undefined
      } finally {
        setIsLoading(false)
      }
    },
    [apiFunction, options],
  )

  return {
    data,
    isLoading,
    error,
    execute,
    setData,
  }
}

/**
 * Custom hook để fetch data từ API khi component mount
 */
export function useFetch<T, P = void>(
  apiFunction: (params?: P) => Promise<ApiResponse<T>>,
  params?: P,
  options: UseApiOptions<T, P> = {},
) {
  const api = useApi<T, P>(apiFunction, options)

  useEffect(() => {
    api.execute(params)
  }, options.dependencies || [])

  return api
}

/**
 * Custom hook để xử lý mutation (create, update, delete)
 */
export function useMutation<T, P>(
  apiFunction: (params: P) => Promise<ApiResponse<T>>,
  options: UseApiOptions<T, P> & {
    successMessage?: string
  } = {},
) {
  const api = useApi<T, P>(apiFunction, {
    ...options,
    onSuccess: (data) => {
      if (options.successMessage) {
        toast({
          title: "Thành công",
          description: options.successMessage,
        })
      }
      options.onSuccess?.(data)
    },
  })

  return api
}

