export type NodeKind =
  | 'me'
  | 'career'
  | 'company'
  | 'project'
  | 'skills'
  | 'contact'

export type GraphNode = {
  id: string
  kind: NodeKind
  label: string
  subtitle?: string
  featured?: boolean
  val?: number
}

export type GraphLink = {
  source: string
  target: string
  highlight?: boolean
}

export type ProjectDetail = {
  id: string
  company: string
  name: string
  period?: string
  links?: { label: string; href: string }[]
  summary: string
  highlights: string[]
  stack: string[]
  status: 'placeholder' | 'ready'
}

export type CompanyDetail = {
  id: string
  name: string
  role: string
  period: string
  duration: string
  summary: string
}

export type Profile = {
  name: string
  nameEn: string
  title: string
  experienceLabel: string
  headline: string
  bio: string
  location: string
  email: string
  links: {
    github: string
    resume: string
  }
}

export type Skills = {
  core: string[]
  product: string[]
  tooling: string[]
}
