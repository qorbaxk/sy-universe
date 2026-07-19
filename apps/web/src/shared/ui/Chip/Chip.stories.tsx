import type { Meta, StoryObj } from '@storybook/react'
import { Chip } from './Chip'
import { ChipRow } from '../ChipRow'

const meta = {
  title: 'Atoms/Chip',
  component: Chip,
  tags: ['autodocs'],
} satisfies Meta<typeof Chip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { children: 'React' } }

export const Row: Story = {
  args: { children: 'React' },
  render: () => (
    <ChipRow>
      <Chip>React</Chip>
      <Chip>TypeScript</Chip>
      <Chip>Vite</Chip>
    </ChipRow>
  ),
}
