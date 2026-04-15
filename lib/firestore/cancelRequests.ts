import { collection, addDoc, updateDoc, doc, serverTimestamp, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function createCancelRequest(tableId, items) {
  const ref = await addDoc(collection(db,'cancel_requests'), { tableId, items, status:'pending', createdAt:serverTimestamp() })
  return ref.id
}

export async function updateCancelRequest(requestId, status) {
  await updateDoc(doc(db,'cancel_requests',requestId), { status, resolvedAt:serverTimestamp() })
}

export function subscribeToCancelRequests(callback) {
  const q = query(collection(db,'cancel_requests'), where('status','==','pending'))
  return onSnapshot(q, snap => callback(snap.docs.map(d=>({id:d.id,...d.data()}))))
}

export function subscribeToTableCancelRequest(tableId, callback) {
  const q = query(collection(db,'cancel_requests'), where('tableId','==',tableId), where('status','in',['pending','approved','rejected']))
  return onSnapshot(q, snap => callback(snap.empty ? null : {id:snap.docs[0].id,...snap.docs[0].data()}))
}
