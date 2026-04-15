import { collection, addDoc, updateDoc, doc, serverTimestamp, runTransaction, query, where, orderBy, onSnapshot, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

async function generateOrderNumber() {
  const date = new Date().toISOString().split('T')[0]
  const dateKey = date.replace(/-/g,'')
  const counterRef = doc(db,'counters',dateKey)
  let seq = 0
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(counterRef)
    seq = snap.exists() ? snap.data().count + 1 : 1
    tx.set(counterRef, { count: seq, date }, { merge: true })
  })
  return { orderNumber: ${dateKey}-, dailySeq: seq, date }
}

export async function createOrder(data) {
  const { orderNumber, dailySeq, date } = await generateOrderNumber()
  const ref = await addDoc(collection(db,'orders'), { ...data, orderNumber, dailySeq, date, status:'pending', createdAt: serverTimestamp() })
  return { id: ref.id, orderNumber }
}

export async function updateOrderStatus(orderId, status) {
  await updateDoc(doc(db,'orders',orderId), { status, updatedAt: serverTimestamp() })
}

export function subscribeToActiveOrders(callback) {
  const q = query(collection(db,'orders'), where('status','in',['pending','con
@"
import { collection, addDoc, updateDoc, doc, serverTimestamp, query, where, onSnapshot, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function requestPayment(tableId, orderIds, items, total) {
  const ref = await addDoc(collection(db,'payments'), { tableId, orderIds, items, confirmedItems:items, total, confirmedTotal:total, status:'requesting', method:null, staffNote:'', createdAt:serverTimestamp() })
  return ref.id
}

export async function startReview(paymentId) {
  await updateDoc(doc(db,'payments',paymentId), { status:'reviewing' })
}

export async function confirmPayment(paymentId, confirmedItems, confirmedTotal, staffNote='') {
  await updateDoc(doc(db,'payments',paymentId), { confirmedItems, confirmedTotal, staffNote, status:'confirmed', confirmedAt:serverTimestamp() })
}

export async function selectPaymentMethod(paymentId, method) {
  const status = method==='qr' ? 'method_selected' : 'staff_collect'
  await updateDoc(doc(db,'payments',paymentId), { method, status, methodSelectedAt:serverTimestamp() })
}

export async function confirmQRPaid(paymentId) {
  await updateDoc(doc(db,'payments',paymentId), { status:'pending_verify', paidAt:serverTimestamp() })
}

export async function verifyAndComplete(paymentId, tableId) {
  await updateDoc(doc(db,'payments',paymentId), { status:'completed', verifiedAt:serverTimestamp() })
  await updateDoc(doc(db,'tables',tableId), { status:'empty', totalAmount:0, closedAt:serverTimestamp() })
  const snap = await getDocs(query(collection(db,'orders'), where('tableId','==',tableId), where('status','!=','closed')))
  await Promise.all(snap.docs.map(d => updateDoc(d.ref, { status:'closed', updatedAt:serverTimestamp() })))
}

export function subscribeToPayments(callback) {
  const q = query(collection(db,'payments'), where('status','in',['requesting','reviewing','confirmed','method_selected','staff_collect','pending_verify']))
  return onSnapshot(q, snap => callback(snap.docs.map(d=>({id:d.id,...d.data()}))))
}

export function subscribeToTablePayment(tableId, callback) {
  const q = query(collection(db,'payments'), where('tableId','==',tableId), where('status','in',['requesting','reviewing','confirmed','method_selected','staff_collect','pending_verify']))
  return onSnapshot(q, snap => callback(snap.empty ? null : {id:snap.docs[0].id,...snap.docs[0].data()}))
}
