import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: '버튼',
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Ghost: Story = { args: { variant: 'ghost' } }
export const Accent: Story = { args: { variant: 'accent' } }
export const Outline: Story = { args: { variant: 'outline' } }
export const Disabled: Story = {
  args: { variant: 'accent', disabled: true, children: '비활성' },
}
