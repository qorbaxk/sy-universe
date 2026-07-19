import { useCallback, useState } from 'react'

export function useSelectedNode(initialId: string | null = 'me') {
  const [selectedId, setSelectedId] = useState<string | null>(initialId)

  const selectNode = useCallback((id: string | null) => {
    setSelectedId(id)
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedId(null)
  }, [])

  return {
    selectedId,
    selectNode,
    clearSelection,
  }
}
