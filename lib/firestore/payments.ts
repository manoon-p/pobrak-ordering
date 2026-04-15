import { collection, addDoc, updateDoc, doc, serverTimestamp, query, where, onSnapshot, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function requestPayment(tableId: string, orderIds: string[], items: any[], total: number) {
  const ref = await addDoc(collection(db,'payments'), { tableId, orderIds, items, confirmedItems:items, total, confirmedTotal:total, status:'requesting', method:null, staffNote:'', createdAt:serverTimestamp() })
  return ref.id
}

export async function startReview(paymentId: string) {
  await updateDoc(doc(db,'payments',paymentId), { status:'reviewing' })
}

export async function confirmPayment(paymentId: string, confirmedItems: any[], confirmedTotal: number, staffNote: string = '') {
  await updateDoc(doc(db,'payments',paymentId), { confirmedItems, confirmedTotal, staffNote, status:'confirmed', confirmedAt:serverTimestamp() })
}

export async function selectPaymentMethod(paymentId: string, method: string) {
  const status = method==='qr' ? 'method_selected' : 'staff_collect'
  await updateDoc(doc(db,'payments',paymentId), { method, status, methodSelectedAt:serverTimestamp() })
}

export async function confirmQRPaid(paymentId: string) {
  await updateDoc(doc(db,'payments',paymentId), { status:'pending_verify', paidAt:serverTimestamp() })
}

export async function verifyAndComplete(paymentId: string, tableId: string) {
  await updateDoc(doc(db,'payments',paymentId), { status:'completed', verifiedAt:serverTimestamp() })
  await updateDoc(doc(db,'tables',tableId), { status:'empty', totalAmount:0, closedAt:serverTimestamp() })
  const snap = await getDocs(query(collection(db,'orders'), where('tableId','==',tableId), where('status','!=','closed')))
  await Promise.all(snap.docs.map((d: any) => updateDoc(d.ref, { status:'closed', updatedAt:serverTimestamp() })))
}

export function subscribeToPayments(callback: (data: any[]) => void) {
  const q = query(collection(db,'payments'), where('status','in',['requesting','reviewing','confirmed','method_selected','staff_collect','pending_verify']))
  return onSnapshot(q, snap => callback(snap.docs.map(d=>({id:d.id,...d.data()}))))
}

export function subscribeToTablePayment(tableId: string, callback: (data: any) => void) {
  const q = query(collection(db,'payments'), where('tableId','==',tableId), where('status','in',['requesting','reviewing','confirmed','method_selected','staff_collect','pending_verify']))
  return onSnapshot(q, snap => callback(snap.empty ? null : {id:snap.docs[0].id,...snap.docs[0].data()}))
}