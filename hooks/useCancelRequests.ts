'use client'
import { useEffect, useState } from 'react'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export function useCancelRequests() {
  const [requests, setRequests] = useState<any[]>([])
  useEffect(() => {
    const q = query(collection(db,'cancel_requests'), where('status','==','pending'))
    return onSnapshot(q, snap => setRequests(snap.docs.map(d=>({id:d.id,...d.data()}))))
  }, [])
  return { requests }
}

export function useTableCancelRequest(tableId: string) {
  const [request, setRequest] = useState<any>(null)
  useEffect(() => {
    if (!tableId) return
    const q = query(collection(db,'cancel_requests'), where('tableId','==',tableId), where('status','in',['pending','approved','rejected']))
    return onSnapshot(q, snap => setRequest(snap.empty ? null : {id:snap.docs[0].id,...snap.docs[0].data()}))
  }, [tableId])
  return { request }
}