import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '../Button'
import { Modal } from './Modal'

const meta = {
  title: 'Atoms/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

export const Open: Story = {
  args: {
    open: true,
    title: '안내',
    onClose: () => undefined,
    children: <p>모달 본문 예시입니다.</p>,
  },
}

export const Interactive: Story = {
  args: {
    open: false,
    title: '하드웨어 가속',
    onClose: () => undefined,
    children: null,
  },
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <div className="p-8">
        <Button variant="accent" onClick={() => setOpen(true)}>
          모달 열기
        </Button>
        <Modal open={open} title="하드웨어 가속" onClose={() => setOpen(false)}>
          <p className="text-sm text-muted">설정 안내를 여기에 둡니다.</p>
        </Modal>
      </div>
    )
  },
}
