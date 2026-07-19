import type { Preview } from '@storybook/react'
import '../src/app/styles/index.css'

const preview: Preview = {
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'universe',
      values: [
        { name: 'universe', value: '#02050c' },
        { name: 'panel', value: '#0b1118' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
