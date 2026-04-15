'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TablePage() {
  const [selected, setSelected] = useState<number|null>(null)
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const router = useRouter()
  return (
    <div style={{minHeight:'100vh',background:'#1b4332',display:'flex',flexDirection:'column',alignItems:'center'}}>
      <div style={{padding:'40px 24px',textAlign:'center',color:'white'}}>
        <h1 style={{margin:'10px 0',fontSize:24}}>พบรัก ณ บางน้ำผึ้ง</h1>
      </div>
      <div style={{width:'100%',maxWidth:430,background:'white',borderRadius:'28px 28px 0 0',flex:1,padding:'26px 20px'}}>
        <div style={{fontWeight:800,color:'#1b4332',marginBottom:14}}>เลือกโต๊ะ</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:9,marginBottom:24}}>
          {Array.from({length:15},(_,i)=>i+1).map(n=>(
            <button key={n} onClick={()=>setSelected(n)} style={{aspectRatio:'1',borderRadius:14,border:selected===n?'3px solid #2d6a4f':'2px solid #eee',background:selected===n?'#2d6a4f':'#fafafa',color:selected===n?'white':'#333',fontWeight:900,fontSize:19,cursor:'pointer'}}>
              {n}
            </button>
          ))}
        </div>
        <div style={{fontWeight:800,color:'#1b4332',marginBottom:12}}>จำนวนคน</div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 0',borderBottom:'1px solid #f0f0f0'}}>
          <span>ผู้ใหญ่</span>
          <div style={{display:'flex',alignItems:'center',gap:14}}>
            <button onClick={()=>setAdults(v=>Math.max(1,v-1))} style={{width:34,height:34,borderRadius:'50%',border:'none',background:'#2d6a4f',color:'white',fontSize:20,cursor:'pointer'}}>-</button>
            <span style={{fontWeight:900,fontSize:22,minWidth:28,textAlign:'center'}}>{adults}</span>
            <button onClick={()=>setAdults(v=>v+1)} style={{width:34,height:34,borderRadius:'50%',border:'none',background:'#2d6a4f',color:'white',fontSize:20,cursor:'pointer'}}>+</button>
          </div>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 0',marginBottom:24}}>
          <span>เด็ก</span>
          <div style={{display:'flex',alignItems:'center',gap:14}}>
            <button onClick={()=>setChildren(v=>Math.max(0,v-1))} style={{width:34,height:34,borderRadius:'50%',border:'none',background:'#2d6a4f',color:'white',fontSize:20,cursor:'pointer'}}>-</button>
            <span style={{fontWeight:900,fontSize:22,minWidth:28,textAlign:'center'}}>{children}</span>
            <button onClick={()=>setChildren(v=>v+1)} style={{width:34,height:34,borderRadius:'50%',border:'none',background:'#2d6a4f',color:'white',fontSize:20,cursor:'pointer'}}>+</button>
          </div>
        </div>
        <button onClick={()=>selected&&router.push('/table/'+selected)} disabled={!selected} style={{width:'100%',padding:'17px',background:selected?'#2d6a4f':'#e0e0e0',color:selected?'white':'#aaa',border:'none',borderRadius:16,fontWeight:800,fontSize:17,cursor:selected?'pointer':'not-allowed'}}>
          {selected?'เข้าสู่เมนู โต๊ะ '+selected:'กรุณาเลือกโต๊ะก่อน'}
        </button>
      </div>
    </div>
  )
}
