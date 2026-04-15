'use client'
import { useEffect, useState } from 'react'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export function useActiveOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const q = query(collection(db,'orders'), where('status','in',['pending','confirmed','served']), orderBy('createdAt','asc'))
    const unsub = onSnapshot(q, snap => {
      setOrders(snap.docs.map(d=>({id:d.id,...d.data()})))
      setLoading(false)
    })
    return unsub
  }, [])
  return { orders, loading }
}

export function useTableOrders(tableId: string) {
  const [orders, setOrders] = useState<any[]>([])
  useEffect(() => {
    if (!tableId) return
    const q = query(collection(db,'orders'), where('tableId','==',tableId), where('status','in',['pending','confirmed','served']))
    return onSnapshot(q, snap => setOrders(snap.docs.map(d=>({id:d.id,...d.data()}))))
  }, [tableId])
  return { orders }
}