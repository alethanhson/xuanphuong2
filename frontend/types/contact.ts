export interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  company?: string
  productInterest?: string
}

export interface ContactResponse {
  success: boolean
  message: string
  id?: string
}

