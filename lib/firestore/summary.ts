import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function getDailySummary(date) {
  const snap = await getDoc(doc(db,'daily_summary',date))
  return snap.exists() ? snap.data() : null
}

export function subscribeToTodaySummary(callback) {
  const today = new Date().toISOString().split('T')[0]
  return onSnapshot(doc(db,'daily_summary',today), snap => callback(snap.exists() ? snap.data() : null))
}
