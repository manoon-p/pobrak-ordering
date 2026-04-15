'use client'
import { useState } from 'react'
import { menuItems, categories } from '@/data/menuData'
import { createOrder } from '@/lib/firestore/orders'

type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
}

export default function TableMenuPage({ params }: { params: any }) {
  const tableId = String(params?.tableId ?? '')
  const [activeCategory, setActiveCategory] = useState(categories[0])
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [ordered, setOrdered] = useState(false)
  const [loading, setLoading] = useState(false)

  const tableId = params?.tableId ?? 'unknown'
  const filteredItems = menuItems.filter(item => item.category === activeCategory)

  const addToCart = (item: { id: string; name: string; price: number }) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id)
      if (existing) return prev.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c)
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === id)
      if (existing && existing.quantity > 1) return prev.map(c => c.id === id ? { ...c, quantity: c.quantity - 1 } : c)
      return prev.filter(c => c.id !== id)
    })
  }

  const totalItems = cart.reduce((sum, c) => sum + c.quantity, 0)
  const totalPrice = cart.reduce((sum, c) => sum + c.price * c.quantity, 0)

  const submitOrder = async () => {
    if (cart.length === 0) return
    setLoading(true)
    try {
await createOrder({
  tableId,
  items: cart.map(item => ({
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
  })),
  totalAmount: totalPrice,
})
      setOrdered(true)
      setCart([])
      setShowCart(false)
} catch (e: any) {
  console.error('Firebase error:', e)
  alert('Error: ' + e.message)
}
    setLoading(false)
  }

  if (ordered) {
    return (
      <div style={{ minHeight: '100vh', background: '#f0fdf4', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ fontSize: '64px' }}>✅</div>
        <h2 style={{ color: '#16a34a', fontSize: '24px', fontWeight: 'bold', marginTop: '16px' }}>ส่งออเดอร์แล้วครับ!</h2>
        <p style={{ color: '#6b7280', marginTop: '8px' }}>โต๊ะ {tableId} — กรุณารอสักครู่</p>
        <button onClick={() => setOrdered(false)} style={{ marginTop: '24px', padding: '12px 32px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', cursor: 'pointer' }}>
          สั่งเพิ่ม
        </button>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', paddingBottom: '100px' }}>
      <div style={{ background: '#15803d', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        <div>
          <div style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>พบรัก ณ บางน้ำผึ้ง</div>
          <div style={{ color: '#bbf7d0', fontSize: '13px' }}>โต๊ะ {tableId}</div>
        </div>
        <button onClick={() => setShowCart(!showCart)} style={{ position: 'relative', background: 'white', border: 'none', borderRadius: '12px', padding: '8px 16px', cursor: 'pointer', fontWeight: 'bold', color: '#15803d', fontSize: '14px' }}>
          🛒 ตะกร้า
          {totalItems > 0 && (
            <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#ef4444', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold' }}>
              {totalItems}
            </span>
          )}
        </button>
      </div>

      <div style={{ display: 'flex', overflowX: 'auto', padding: '12px 16px', gap: '8px', background: 'white', borderBottom: '1px solid #e5e7eb' }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{ whiteSpace: 'nowrap', padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '500', background: activeCategory === cat ? '#15803d' : '#f3f4f6', color: activeCategory === cat ? 'white' : '#374151' }}>
            {cat}
          </button>
        ))}
      </div>

      <div style={{ padding: '16px' }}>
        <h3 style={{ color: '#15803d', fontWeight: 'bold', marginBottom: '12px', fontSize: '16px' }}>{activeCategory}</h3>
        {filteredItems.map(item => {
          const cartItem = cart.find(c => c.id === item.id)
          return (
            <div key={item.id} style={{ background: 'white', borderRadius: '12px', padding: '16px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '500', color: '#111827', fontSize: '15px' }}>{item.name}</div>
                <div style={{ color: '#15803d', fontWeight: 'bold', marginTop: '4px' }}>฿{item.price}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {cartItem && (
                  <>
                    <button onClick={() => removeFromCart(item.id)} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #15803d', background: 'white', color: '#15803d', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                    <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{cartItem.quantity}</span>
                  </>
                )}
                <button onClick={() => addToCart(item)} style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: '#15803d', color: 'white', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
              </div>
            </div>
          )
        })}
      </div>

      {showCart && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderRadius: '20px 20px 0 0', padding: '20px', boxShadow: '0 -4px 20px rgba(0,0,0,0.15)', zIndex: 50, maxHeight: '70vh', overflowY: 'auto' }}>
          <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '16px' }}>🛒 รายการที่เลือก</h3>
          {cart.length === 0 ? (
            <p style={{ color: '#9ca3af', textAlign: 'center', padding: '20px' }}>ยังไม่มีรายการ</p>
          ) : (
            <>
              {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ color: '#111827' }}>{item.name} x{item.quantity}</span>
                  <span style={{ fontWeight: 'bold', color: '#15803d' }}>฿{item.price * item.quantity}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', fontWeight: 'bold', fontSize: '18px' }}>
                <span>รวมทั้งหมด</span>
                <span style={{ color: '#15803d' }}>฿{totalPrice}</span>
              </div>
              <button onClick={submitOrder} disabled={loading} style={{ width: '100%', padding: '16px', background: loading ? '#9ca3af' : '#15803d', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'กำลังส่ง...' : '✅ ส่งออเดอร์'}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}