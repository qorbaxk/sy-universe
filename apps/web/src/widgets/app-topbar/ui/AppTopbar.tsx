import { motion } from 'framer-motion'
import { profile } from '@/entities/portfolio'
import './AppTopbar.css'

export function AppTopbar() {
  return (
    <motion.header
      className="app-topbar"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="app-topbar__brand">
        <span className="app-topbar__mark" aria-hidden />
        <div>
          <strong>{profile.name}</strong>
          <span>{profile.title}</span>
        </div>
      </div>
      <p className="app-topbar__hint">
        드래그로 회전 · 스크롤 줌 · 노드를 잡아 옮겨보세요
      </p>
      <a className="app-topbar__cta" href={`mailto:${profile.email}`}>
        Contact
      </a>
    </motion.header>
  )
}
