import type { ApiResponse, QueryParams } from "@/types/common"

/**
 * Base URL for API requests
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001/api"

/**
 * Formats query parameters for API requests
 */
export function formatQueryParams(params?: QueryParams): string {
  if (!params) return ""

  const queryParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value))
    }
  })

  const queryString = queryParams.toString()
  return queryString ? `?${queryString}` : ""
}

/**
 * Generic fetch function with error handling
 */
export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        error: {
          code: String(response.status),
          message: data.message || "An error occurred",
          details: data.details,
        },
      }
    }

    return { data: data as T }
  } catch (error) {
    console.error("API request failed:", error)
    return {
      error: {
        code: "UNKNOWN_ERROR",
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
    }
  }
}

/**
 * GET request helper
 */
export async function get<T>(endpoint: string, params?: QueryParams): Promise<ApiResponse<T>> {
  const queryString = formatQueryParams(params)
  return fetchApi<T>(`${endpoint}${queryString}`)
}

/**
 * POST request helper
 */
export async function post<T, U = any>(endpoint: string, data: U): Promise<ApiResponse<T>> {
  return fetchApi<T>(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

/**
 * PUT request helper
 */
export async function put<T, U = any>(endpoint: string, data: U): Promise<ApiResponse<T>> {
  return fetchApi<T>(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

/**
 * DELETE request helper
 */
export async function del<T>(endpoint: string): Promise<ApiResponse<T>> {
  return fetchApi<T>(endpoint, {
    method: "DELETE",
  })
}

