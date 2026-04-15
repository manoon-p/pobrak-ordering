import { collection, addDoc, updateDoc, doc, serverTimestamp, runTransaction, query, where, orderBy, onSnapshot, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

async function generateOrderNumber() {
  const date = new Date().toISOString().split('T')[0]
  const dateKey = date.replace(/-/g,'')
  const counterRef = doc(db,'counters',dateKey)
  let seq = 0
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(counterRef)
    seq = snap.exists() ? (snap.data().count as number) + 1 : 1
    tx.set(counterRef, { count: seq, date }, { merge: true })
  })
  return { orderNumber: `${dateKey}-${String(seq).padStart(3,'0')}`, dailySeq: seq, date }
}

export async function createOrder(data: any) {
  const { orderNumber, dailySeq, date } = await generateOrderNumber()
  const ref = await addDoc(collection(db,'orders'), { ...data, orderNumber, dailySeq, date, status:'pending', createdAt: serverTimestamp() })
  return { id: ref.id, orderNumber }
}

export async function updateOrderStatus(orderId: string, status: string) {
  await updateDoc(doc(db,'orders',orderId), { status, updatedAt: serverTimestamp() })
}

export function subscribeToActiveOrders(callback: (data: any[]) => void) {
  const q = query(collection(db,'orders'), where('status','in',['pending','confirmed','served']), orderBy('createdAt','asc'))
  return onSnapshot(q, snap => callback(snap.docs.map(d=>({id:d.id,...d.data()}))))
}

export async function getDailyOrders(date: string) {
  const snap = await getDocs(query(collection(db,'orders'), where('date','==',date), orderBy('dailySeq','asc')))
  return snap.docs.map(d=>({id:d.id,...d.data()}))
}