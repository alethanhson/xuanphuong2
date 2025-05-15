export interface ServiceFeature {
  id: string
  title: string
  description: string
  icon?: string
}

export interface Service {
  id: string
  name: string
  slug: string
  shortDescription: string
  description: string
  icon?: string
  image: string
  features: ServiceFeature[]
  isFeatured?: boolean
  order?: number
}

export interface ServicesResponse {
  services: Service[]
  total: number
}

