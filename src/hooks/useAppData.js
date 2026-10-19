import { useContext } from 'react'
import { AppDataContext } from '../context/appDataContext.js'

export function useAppData() {
  const context = useContext(AppDataContext)
  if (!context) throw new Error('useAppData باید داخل AppDataProvider استفاده شود.')
  return context
}
