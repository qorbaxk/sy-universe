import type { Meta, StoryObj } from '@storybook/react'
import { ProgressBar } from './ProgressBar'

const meta = {
  title: 'Atoms/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  args: { value: 60 },
} satisfies Meta<typeof ProgressBar>

export default meta
type Story = StoryObj<typeof meta>

export const Gradient: Story = { args: { variant: 'gradient' } }
export const Accent: Story = { args: { variant: 'accent' } }
export const Accent2: Story = { args: { variant: 'accent-2' } }
