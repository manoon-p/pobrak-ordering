'use client'
import { useState, useEffect, useRef } from 'react'
import { subscribeToActiveOrders, updateOrderStatus } from '@/lib/firestore/orders'

export default function StaffDashboard() {
  const [orders, setOrders] = useState<any[]>([])
  const prevCountRef = useRef(0)
  const audioRef = useRef<AudioContext | null>(null)

  const playBeep = () => {
    try {
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 880
      gain.gain.value = 0.3
      osc.start()
      osc.stop(ctx.currentTime + 0.3)
    } catch (e) {}
  }

  useEffect(() => {
    const unsub = subscribeToActiveOrders((data) => {
      if (data.length > prevCountRef.current) playBeep()
      prevCountRef.current = data.length
      setOrders(data)
    })
    return () => unsub()
  }, [])

  const statusLabel: any = {
    pending: { label: 'รอรับออเดอร์', color: '#f59e0b', next: 'confirmed', nextLabel: '✅ รับออเดอร์' },
    confirmed: { label: 'กำลังทำ', color: '#3b82f6', next: 'served', nextLabel: '🍽️ เสิร์ฟแล้ว' },
    served: { label: 'เสิร์ฟแล้ว', color: '#10b981', next: null, nextLabel: null },
  }

  const pendingOrders = orders.filter(o => o.status === 'pending')
  const confirmedOrders = orders.filter(o => o.status === 'confirmed')
  const servedOrders = orders.filter(o => o.status === 'served')

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', fontFamily: 'sans-serif' }}>
      <div style={{ background: '#15803d', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>👨‍🍳 Staff Dashboard</div>
        <div style={{ color: '#bbf7d0', fontSize: 14 }}>ออเดอร์ทั้งหมด: {orders.length}</div>
      </div>

      <div style={{ padding: 16 }}>
        {orders.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af', fontSize: 18 }}>
            ยังไม่มีออเดอร์
          </div>
        )}

        {pendingOrders.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ color: '#f59e0b', marginBottom: 12, fontSize: 16 }}>🔔 รอรับออเดอร์ ({pendingOrders.length})</h2>
            {pendingOrders.map(order => <OrderCard key={order.id} order={order} statusLabel={statusLabel} onUpdate={updateOrderStatus} />)}
          </div>
        )}

        {confirmedOrders.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ color: '#3b82f6', marginBottom: 12, fontSize: 16 }}>🍳 กำลังทำ ({confirmedOrders.length})</h2>
            {confirmedOrders.map(order => <OrderCard key={order.id} order={order} statusLabel={statusLabel} onUpdate={updateOrderStatus} />)}
          </div>
        )}

        {servedOrders.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ color: '#10b981', marginBottom: 12, fontSize: 16 }}>✅ เสิร์ฟแล้ว ({servedOrders.length})</h2>
            {servedOrders.map(order => <OrderCard key={order.id} order={order} statusLabel={statusLabel} onUpdate={updateOrderStatus} />)}
          </div>
        )}
      </div>
    </div>
  )
}

function OrderCard({ order, statusLabel, onUpdate }: any) {
  const s = statusLabel[order.status] || {}
  return (
    <div style={{ background: 'white', borderRadius: 12, padding: 16, marginBottom: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderLeft: `4px solid ${s.color}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div>
          <span style={{ fontWeight: 'bold', fontSize: 18 }}>โต๊ะ {order.tableId}</span>
          <span style={{ marginLeft: 10, fontSize: 12, background: s.color, color: 'white', padding: '2px 8px', borderRadius: 10 }}>{s.label}</span>
        </div>
        <div style={{ fontWeight: 'bold', color: '#15803d' }}>฿{order.totalAmount}</div>
      </div>
      <div style={{ marginBottom: 10 }}>
        {(order.items || []).map((item: any, i: number) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#374151', padding: '4px 0', borderBottom: '1px solid #f3f4f6' }}>
            <span>{item.name} x{item.quantity}</span>
            <span>฿{item.price * item.quantity}</span>
          </div>
        ))}
      </div>
      {s.next && (
        <button
          onClick={() => onUpdate(order.id, s.next)}
          style={{ width: '100%', padding: '10px', background: s.color, color: 'white', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer', fontSize: 14 }}
        >
          {s.nextLabel}
        </button>
      )}
    </div>
  )
}