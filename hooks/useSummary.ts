'use client'
import { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export function useTodaySummary() {
  const [summary, setSummary] = useState(null)
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    return onSnapshot(doc(db,'daily_summary',today), snap => setSummary(snap.exists() ? snap.data() : null))
  }, [])
  return { summary }
}
