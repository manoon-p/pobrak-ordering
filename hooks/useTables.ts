'use client'
import { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export function useTables() {
  const [tables, setTables] = useState<any>({})
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    return onSnapshot(collection(db,'tables'), snap => {
      const map: any = {}
      snap.docs.forEach(d => { map[d.id] = {id:d.id,...d.data()} })
      setTables(map)
      setLoading(false)
    })
  }, [])
  return { tables, loading }
}