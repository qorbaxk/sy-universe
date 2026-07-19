import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './Input'
import { Label } from '../Label'

const meta = {
  title: 'Atoms/Input',
  component: Input,
  tags: ['autodocs'],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { placeholder: '이메일을 입력하세요' },
}

export const WithLabel: Story = {
  args: { placeholder: 'qorbaxk97@gmail.com' },
  render: () => (
    <div className="w-72">
      <Label htmlFor="email">이메일</Label>
      <Input id="email" placeholder="qorbaxk97@gmail.com" />
    </div>
  ),
}
