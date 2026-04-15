import { doc, setDoc, updateDoc, onSnapshot, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function openTable(tableId, adults, children, kidPlate) {
  await setDoc(doc(db,'tables',tableId), { id:tableId, status:'occupied', adults, children, kidPlate, totalAmount:0, openedAt:serverTimestamp() })
}

export async function closeTable(tableId) {
  await updateDoc(doc(db,'tables',tableId), { status:'empty', totalAmount:0, closedAt:serverTimestamp() })
}

export function subscribeToTables(callback) {
  return onSnapshot(collection(db,'tables'), snap => {
    const map = {}
    snap.docs.forEach(d => { map[d.id] = {id:d.id,...d.data()} })
    callback(map)
  })
}

export async function initializeTables(total=15) {
  await Promise.all(Array.from({length:total},(_,i)=>{
    const id = String(i+1)
    return setDoc(doc(db,'tables',id), { id, status:'empty', adults:0, children:0, kidPlate:false, totalAmount:0 }, {merge:true})
  }))
  console.log('Tables initialized!')
}
