'use client'
import { useEffect, useState } from 'react'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export function usePayments() {
  const [payments, setPayments] = useState([])
  useEffect(() => {
    const q = query(collection(db,'payments'), where('status','in',['requesting','reviewing','confirmed','method_selected','staff_collect','pending_verify']))
    return onSnapshot(q, snap => setPayments(snap.docs.map(d=>({id:d.id,...d.data()}))))
  }, [])
  return { payments }
}

export function useTablePayment(tableId) {
  const [payment, setPayment] = useState(null)
  useEffect(() => {
    if (!tableId) return
    const q = query(collection(db,'payments'), where('tableId','==',tableId), where('status','in',['requesting','reviewing','confirmed','method_selected','staff_collect','pending_verify']))
    return onSnapshot(q, snap => setPayment(snap.empty ? null : {id:snap.docs[0].id,...snap.docs[0].data()}))
  }, [tableId])
  return { payment }
}
