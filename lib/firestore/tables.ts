import { doc, setDoc, updateDoc, onSnapshot, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function openTable(tableId: string, adults: number, children: number, kidPlate: boolean) {
  await setDoc(doc(db,'tables',tableId), { id:tableId, status:'occupied', adults, children, kidPlate, totalAmount:0, openedAt:serverTimestamp() })
}

export async function closeTable(tableId: string) {
  await updateDoc(doc(db,'tables',tableId), { status:'empty', totalAmount:0, closedAt:serverTimestamp() })
}

export function subscribeToTables(callback: (data: any) => void) {
  return onSnapshot(collection(db,'tables'), snap => {
    const map: any = {}
    snap.docs.forEach(d => { map[d.id] = {id:d.id,...d.data()} })
    callback(map)
  })
}

export async function initializeTables(total: number = 15) {
  await Promise.all(Array.from({length:total},(_,i)=>{
    const id = String(i+1)
    return setDoc(doc(db,'tables',id), { id, status:'empty', adults:0, children:0, kidPlate:false, totalAmount:0 }, {merge:true})
  }))
}