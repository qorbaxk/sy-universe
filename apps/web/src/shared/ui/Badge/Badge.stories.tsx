import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './Badge'

const meta = {
  title: 'Atoms/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { children: '실무 2년 11개월 · 3년차' },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Accent: Story = { args: { variant: 'accent' } }
export const Soft: Story = { args: { variant: 'soft' } }
export const Neutral: Story = { args: { variant: 'neutral' } }
