export default function Home() {
  return (
    <main style={{padding:"40px",fontFamily:"sans-serif",textAlign:"center"}}>
      <h1 style={{fontSize:"28px",color:"#1b4332",marginBottom:"10px"}}>
        🍽️ พบรัก ณ บางน้ำผึ้ง
      </h1>
      <p style={{color:"#666",marginBottom:"30px"}}>
        ระบบสั่งอาหารออนไลน์
      </p>
      <div style={{display:"flex",gap:"20px",justifyContent:"center"}}>
        <a href="/table" style={{padding:"16px 32px",background:"#2d6a4f",color:"white",borderRadius:"12px",textDecoration:"none",fontSize:"18px",fontWeight:"bold"}}>
          📱 หน้าลูกค้า
        </a>
        <a href="/staff" style={{padding:"16px 32px",background:"#1d4ed8",color:"white",borderRadius:"12px",textDecoration:"none",fontSize:"18px",fontWeight:"bold"}}>
          🖥️ หน้าพนักงาน
        </a>
      </div>
    </main>
  )
}