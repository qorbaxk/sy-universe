import type { Meta, StoryObj } from '@storybook/react'
import { Eyebrow } from './Eyebrow'

const meta = {
  title: 'Atoms/Eyebrow',
  component: Eyebrow,
  tags: ['autodocs'],
  args: { children: 'Company' },
} satisfies Meta<typeof Eyebrow>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
