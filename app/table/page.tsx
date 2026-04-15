'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TablePage() {
  const [selected, setSelected] = useState<number | null>(null)
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const router = useRouter()

  return (
    <div style={{ minHeight: '100vh', background: '#1b4332', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ padding: '40px 24px', textAlign: 'center', color: 'white' }}>
        <div style={{ fontSize: 40 }}>🍽️</div>
        <h1 style={{ margin: '10px 0', fontSize: 24 }}>พบรัก ณ บางน้ำผึ้ง</h1>
      </div>
      <div style={{ width: '100%', maxWidth: 430, background: 'white', borderRadius: '28px 28px 0 0', flex: 1, padding: '26px 20px' }}>
        
        <div style={{ fontWeight: 800, color: '#1b4332', marginBottom: 14, fontSize: 16 }}>เลือกโต๊ะ</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 9, marginBottom: 24 }}>
          {Array.from({ length: 15 }, (_, i) => i + 1).map(n => (
            <button key={n} onClick={() => setSelected(n)} style={{ aspectRatio: '1', borderRadius: 14, border: selected === n ? '3px solid #2d6a4f' : '2px solid #eee', background: selected === n ? '#2d6a4f' : '#fafafa', color: selected === n ? 'white' : '#333', fontWeight: 900, fontSize: 19, cursor: 'pointer' }}>
              {n}
            </button>
          ))}
        </div>

        <div style={{ fontWeight: 800, color: '#1b4332', marginBottom: 12, fontSize: 16 }}>จำนวนคน</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: