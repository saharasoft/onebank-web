'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [rates, setRates] = useState([]);
  const [lang, setLang] = useState('uz');
  const [activeTab, setActiveTab] = useState('omonat');
  const [loanAmount, setLoanAmount] = useState(10000000);
  const [loanMonths, setLoanMonths] = useState(24);
  const [loanRate, setLoanRate] = useState(20);

  useEffect(() => {
    supabase.from('exchange_rates').select('*')
      .in('currency_code', ['USD','EUR','RUB','GBP','CNY','KZT'])
      .then(({ data }) => setRates(data || []));
  }, []);

  const monthlyPayment = Math.round(
    (loanAmount * (loanRate/100/12)) / 
    (1 - Math.pow(1 + loanRate/100/12, -loanMonths))
  );

  const t = {
    uz: {
      nav: ['Valyuta','Banklar','Kreditlar','Narxlar','Investitsiya','Biznes','Yangiliklar'],
      signin: 'Kirish',
      ticker: 'O\'zR MB kurslari',
      hero: 'O\'zbekiston moliyasi — bir joyda',
      herosub: 'Valyuta kurslari, bank kreditlari, benzin narxlari — avtomatik yangilanadi',
    },
    ru: {
      nav: ['Валюта','Банки','Кредиты','Цены','Инвестиции','Бизнес','Новости'],
      signin: 'Войти',
      ticker: 'Курсы ЦБ РУз',
      hero: 'Все финансы Узбекистана в одном месте',
      herosub: 'Курсы валют, кредиты, цены на бензин — обновляется автоматически',
    }
  };

  const tx = t[lang];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* 1. NAVBAR */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center text-white font-bold text-sm">O</div>
            <span className="font-bold text-blue-900 text-lg">OneBank.uz</span>
          </div>
          <div className="flex items-center gap-1">
            {tx.nav.map(item => (
              <button key={item} className="px-3 py-1.5 text-sm text-gray-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors">{item}</button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button onClick={() => setLang('uz')} className={`px-3 py-1 text-xs font-semibold ${lang==='uz' ? 'bg-blue-900 text-white' : 'text-gray-500'}`}>UZ</button>
              <button onClick={() => setLang('ru')} className={`px-3 py-1 text-xs font-semibold ${lang==='ru' ? 'bg-blue-900 text-white' : 'text-gray-500'}`}>RU</button>
            </div>
            <button className="px-4 py-1.5 bg-blue-900 text-white text-sm font-semibold rounded-lg">{tx.signin}</button>
          </div>
        </div>
      </nav>

      {/* 2. TICKER */}
      <div className="bg-blue-900 py-2 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center gap-6">
          <span className="text-blue-300 text-xs font-semibold whitespace-nowrap">{tx.ticker}</span>
          <div className="flex gap-6 overflow-x-auto scrollbar-hide">
            {rates.map(r => (
              <div key={r.id} className="flex items-center gap-2 whitespace-nowrap">
                <span className="text-blue-300 text-xs font-bold">{r.currency_code}</span>
                <span className="text-white text-sm font-semibold">{Number(r.rate).toLocaleString('ru-RU', {maximumFractionDigits:2})}</span>
                <span className="text-green-400 text-xs">▲</span>
              </div>
            ))}
          </div>
          <span className="text-blue-300 text-xs whitespace-nowrap ml-auto cursor-pointer hover:text-white">Barcha kurslar →</span>
        </div>
      </div>

      {/* 3. REKLAMA BANNERI */}
      <div className="max-w-7xl mx-auto px-6 mt-4">
        <div className="bg-blue-50 border-2 border-dashed border-blue-200 rounded-2xl h-28 flex items-center justify-center">
          <span className="text-blue-300 text-xl font-semibold">Reklama banneri</span>
        </div>
      </div>

      {/* 4. 4 TA ASOSIY BLOK */}
      <div className="max-w-7xl mx-auto px-6 mt-4 grid grid-cols-4 gap-3">
        {/* Valyuta */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="font-bold text-sm text-gray-900 mb-3 underline cursor-pointer">Eng yaxshi valyuta</div>
          {[['USD','12 178','BRB Bank'],['EUR','14 053','Kapitalbank'],['RUB','146','Anorbank'],['GBP','16 272','TBC Bank']].map(([code,val,bank]) => (
            <div key={code} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
              <span className="text-xs text-gray-600">{code}</span>
              <div className="text-right">
                <div className="text-xs font-bold text-blue-900">{val} so'm</div>
                <div className="text-xs text-blue-600 underline cursor-pointer">{bank}</div>
              </div>
            </div>
          ))}
        </div>
        {/* Kredit */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="font-bold text-sm text-gray-900 mb-3 underline cursor-pointer">Eng yaxshi kredit</div>
          {[['Avtokredit','10mln','20%','Anorbank'],['Ipoteka','50mln','15%','Kapitalbank'],['Iste\'mol','5mln','22%','Uzum'],['Biznes','100mln','18%','Hamkor']].map(([type,sum,rate,bank]) => (
            <div key={type} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
              <div>
                <div className="text-xs text-gray-600">{type}</div>
                <div className="text-xs text-gray-400">{sum} gacha</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-blue-900">{rate}</div>
                <div className="text-xs text-blue-600 underline cursor-pointer">{bank}</div>
              </div>
            </div>
          ))}
        </div>
        {/* Narxlar */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="font-bold text-sm text-gray-900 mb-3 underline cursor-pointer">Narxlar</div>
          {[['AI-80','10 700','arzon','green'],['AI-91','12 400','o\'rtacha','amber'],['AI-95','14 800','premium','amber'],['Gaz','3 200','metan','blue']].map(([type,price,badge,color]) => (
            <div key={type} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
              <span className="text-xs text-gray-600">{type}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-gray-900">{price}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${color==='green'?'bg-green-50 text-green-700':color==='blue'?'bg-blue-50 text-blue-700':'bg-amber-50 text-amber-700'}`}>{badge}</span>
              </div>
            </div>
          ))}
        </div>
        {/* Investitsiya */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="font-bold text-sm text-gray-900 mb-3 underline cursor-pointer">Investitsiya</div>
          {[['Oltin 1g','$95','Zara Golden','amber'],['Kumush 1g','$1.2','Market','gray'],['BTC','$84,200','+2.1%','green'],['USDT','$1.00','Stable','gray']].map(([name,val,sub,color]) => (
            <div key={name} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
              <span className="text-xs text-gray-600">{name}</span>
              <div className="text-right">
                <div className="text-xs font-bold text-gray-900">{val}</div>
                <div className={`text-xs ${color==='green'?'text-green-600':'text-gray-400'}`}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. IKONKALAR */}
      <div className="max-w-7xl mx-auto px-6 mt-4">
        <div className="grid grid-cols-8 gap-0 border border-gray-100 rounded-2xl overflow-hidden">
          {[['💱','Valyuta kurslari'],['🏦','Mikroqarzlar'],['🚗','Avtokreditlar'],['🛡️','Avtosug\'urta'],['🏠','Ipoteka'],['💳','Visa kartalari'],['💸','Pul o\'tkazmalari'],['🥇','Oltin narxi']].map(([icon,label]) => (
            <div key={label} className="bg-white hover:bg-blue-50 transition-colors cursor-pointer p-4 flex flex-col items-center gap-2 border-r border-gray-100 last:border-0">
              <span className="text-2xl">{icon}</span>
              <span className="text-xs text-gray-600 text-center leading-tight">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 6. KURSLAR DETALI */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Eng yaxshi xorijiy valyuta kurslari</h2>
        <div className="grid grid-cols-4 gap-4">
          {[
            {title:'MB kursi', rows:[['Dollar','12 178.85','+49.84'],['Rubl','146.54','-1.45'],['Yevro','14 053.18','+84.2']]},
            {title:'Eng yaxshi olish kursi', rows:[['Dollar','12 900','Biznesni rivojlantirish banki'],['Rubl','139.00','Kapitalbank'],['Yevro','13 830','Anor Bank']]},
            {title:'Eng yaxshi sotish kursi', rows:[['Dollar','12 200','Orient Finans, Aloqabank'],['Rubl','147.00','Trastbank, Poytaxt'],['Yevro','14 080','Trastbank']]},
            {title:'Mobil ilovalar kursi', rows:[['Dollar','12 950','6 ta bank'],['Rubl','148.00','Invest Finance'],['Yevro','14 100','Invest Finance']]},
          ].map(card => (
            <div key={card.title} className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">{card.title}</div>
              {card.rows.map(([name,val,sub]) => (
                <div key={name} className="mb-2.5">
                  <div className="flex justify-between">
                    <span className="text-sm font-semibold text-blue-700">{name}</span>
                    <span className="text-sm font-bold text-gray-900">{val} <span className="text-xs text-gray-400 font-normal">So'm</span></span>
                  </div>
                  <div className={`text-xs ${sub.startsWith('+')?'text-green-600':sub.startsWith('-')?'text-red-500':'text-gray-400'}`}>{sub}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-3"><span className="text-sm text-blue-700 cursor-pointer hover:underline">Barcha kurslar →</span></div>
      </div>

      {/* 7. ENG YAXSHI TAKLIFLAR */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Eng yaxshi takliflar</h2>
        <div className="flex gap-2 border-b border-gray-200 mb-4">
          {[['omonat','Omonatlar'],['dollar','Dollar omonatlar'],['mikro','Mikroqarz'],['avto','Avtokredit'],['ipoteka','Ipoteka'],['karta','Debet kartalar']].map(([key,label]) => (
            <button key={key} onClick={() => setActiveTab(key)} className={`pb-2 px-3 text-sm border-b-2 transition-colors ${activeTab===key ? 'border-blue-900 text-blue-900 font-semibold' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>{label}</button>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[['AA','Asia Alliance','Standart online','23%','24 oy'],['HB','Hayot Bank','Hayot baraka','23%','18 oy'],['XB','Xalq Bank','Xazna','23%','24 oy'],['KB','Kapitalbank','Premium','25%','18 oy']].map(([abbr,bank,name,rate,term]) => (
            <div key={name} className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xs font-bold text-blue-900">{abbr}</div>
                <span className="text-sm text-amber-500 font-semibold">★ 5.0</span>
              </div>
              <div className="text-sm font-bold text-gray-900 mb-3">"{name}"</div>
              <div className="grid grid-cols-2 gap-2 bg-gray-50 rounded-xl p-3">
                <div><div className="text-xs text-gray-400">Foiz</div><div className="text-sm font-bold">{rate}</div></div>
                <div><div className="text-xs text-gray-400">Muddat</div><div className="text-sm font-bold">{term}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 8. CEO */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 flex gap-8 items-start">
          <div className="w-48 h-56 bg-blue-900 rounded-2xl flex items-center justify-center text-white font-semibold flex-shrink-0">CEO foto</div>
          <div>
            <div className="text-xl font-bold text-gray-900 mb-1">Sayyid Muhammad</div>
            <div className="text-sm text-blue-700 font-semibold mb-4">Founder & CEO — OneBank.uz</div>
            <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">O'zbekiston moliyaviy ma'lumotlar platformasini yaratish g'oyasi 2025-yilda tug'ildi. Maqsadimiz — har bir o'zbek fuqarosi uchun moliyaviy ma'lumotlarni ochiq, qulay va tushunarli qilish. OneBank.uz orqali banklar, kreditlar, valyuta kurslari va boshqa moliyaviy ma'lumotlar bir joyda jamlangan.</p>
          </div>
        </div>
      </div>

      {/* 9. KALKULYATOR */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="bg-blue-900 rounded-2xl p-8">
          <h2 className="text-lg font-bold text-white mb-6">Kredit kalkulyatori</h2>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="text-blue-300 text-xs font-semibold mb-2 block">Kredit summasi</label>
              <input type="range" min="1000000" max="100000000" step="1000000" value={loanAmount} onChange={e => setLoanAmount(Number(e.target.value))} className="w-full mb-1"/>
              <div className="text-white font-bold">{loanAmount.toLocaleString('ru-RU')} so'm</div>
            </div>
            <div>
              <label className="text-blue-300 text-xs font-semibold mb-2 block">Muddat</label>
              <input type="range" min="6" max="84" step="6" value={loanMonths} onChange={e => setLoanMonths(Number(e.target.value))} className="w-full mb-1"/>
              <div className="text-white font-bold">{loanMonths} oy</div>
            </div>
            <div>
              <label className="text-blue-300 text-xs font-semibold mb-2 block">Foiz stavkasi</label>
              <input type="range" min="10" max="35" step="1" value={loanRate} onChange={e => setLoanRate(Number(e.target.value))} className="w-full mb-1"/>
              <div className="text-white font-bold">{loanRate}% yillik</div>
            </div>
          </div>
          <div className="mt-6 bg-white/10 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="text-blue-300 text-xs font-semibold">Oylik to'lov</div>
              <div className="text-white text-2xl font-bold">{monthlyPayment.toLocaleString('ru-RU')} so'm</div>
            </div>
            <button className="px-6 py-3 bg-white text-blue-900 font-bold rounded-xl text-sm">Kredit topish →</button>
          </div>
        </div>
      </div>

      {/* 10. YANGILIKLAR */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Moliyaviy yangiliklar</h2>
          <span className="text-sm text-blue-700 cursor-pointer hover:underline">Barchasini o'qish →</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            ['Dollar kursi yana ko\'tarildi','ЦБ РУз rasmiy kursni yangiladi. Dollar 12,178 so\'mga yetdi.','Bugun'],
            ['Kapitalbank yangi kredit mahsuloti taqdim etdi','Yillik 15% stavka bilan ipoteka krediti ishga tushdi.','Kecha'],
            ['Benzin narxlari o\'zgardi','AI-95 narxi 14,800 so\'mga ko\'tarildi. Barcha AZSlarda.','2 kun oldin'],
          ].map(([title,desc,date]) => (
            <div key={title} className="bg-white rounded-2xl border border-gray-100 p-4 cursor-pointer hover:border-blue-200 transition-colors">
              <div className="w-full h-28 bg-gray-100 rounded-xl mb-3 flex items-center justify-center text-gray-300 text-sm">Rasm</div>
              <div className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">{title}</div>
              <div className="text-xs text-gray-500 mb-2 line-clamp-2">{desc}</div>
              <div className="text-xs text-gray-400">{date}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 11. BIZNES */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Biznes uchun</h2>
        <div className="grid grid-cols-4 gap-4">
          {[['📋','Soliq kalkulyatori','НДФЛ, ИНПС hisoblash'],['🏛️','Tenderlar','Davlat buyurtmalari'],['👨‍💼','Buxgalterlar','Onlayn xizmat'],['⚖️','Yuristlar','Huquqiy maslahat']].map(([icon,title,sub]) => (
            <div key={title} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-start gap-3 cursor-pointer hover:border-blue-200 transition-colors">
              <span className="text-2xl">{icon}</span>
              <div>
                <div className="text-sm font-bold text-gray-900">{title}</div>
                <div className="text-xs text-gray-500 mt-0.5">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 12. ILOVA */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="bg-blue-50 rounded-2xl p-8 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Ilovani yuklab oling</h2>
            <p className="text-sm text-gray-600 mb-4">Valyuta kurslari, kreditlar va narxlar — har doim qo'lingizda</p>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold">
                <span>▶</span> Google Play
              </button>
              <button className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold">
                <span>🍎</span> App Store
              </button>
            </div>
          </div>
          <div className="w-32 h-32 bg-white rounded-2xl border border-gray-200 flex items-center justify-center text-gray-400 text-xs">QR kod</div>
        </div>
      </div>

      {/* 13. TELEGRAM */}
      <div className="max-w-7xl mx-auto px-6 mt-4">
        <div className="bg-blue-500 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white mb-1">Telegram kanalga obuna bo'ling</h2>
            <p className="text-blue-100 text-sm">Kurslarni birinchi bo'lib biling — 50,000+ obunachi</p>
          </div>
          <button className="px-6 py-2.5 bg-white text-blue-600 font-bold rounded-xl text-sm">Obuna bo'lish →</button>
        </div>
      </div>

      {/* 14. HAMKORLAR */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide text-center mb-4">Biz ishlaydigan banklar</h2>
        <div className="flex items-center justify-center gap-6 flex-wrap">
          {['Kapitalbank','Uzum Bank','Hamkorbank','TBC Bank','Ipoteka Bank','Agrobank','Anorbank','Asaka Bank'].map(bank => (
            <div key={bank} className="bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm text-gray-600 font-medium hover:border-blue-200 cursor-pointer transition-colors">{bank}</div>
          ))}
        </div>
      </div>

      {/* 15. FOOTER */}
      <footer className="bg-blue-900 mt-8 py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-blue-900 font-bold text-xs">O</div>
                <span className="text-white font-bold">OneBank.uz</span>
              </div>
              <p className="text-blue-300 text-xs leading-relaxed">O'zbekiston moliyaviy ma'lumotlar platformasi</p>
            </div>
            <div>
              <div className="text-white font-semibold text-sm mb-3">Xizmatlar</div>
              {['Valyuta kurslari','Bank kreditlari','Depozitlar','Kartalar','Benzin narxlari'].map(item => (
                <div key={item} className="text-blue-300 text-xs mb-1.5 cursor-pointer hover:text-white">{item}</div>
              ))}
            </div>
            <div>
              <div className="text-white font-semibold text-sm mb-3">Kompaniya</div>
              {['Biz haqimizda','Yangiliklar','Hamkorlik','Vakansiyalar','Bog\'lanish'].map(item => (
                <div key={item} className="text-blue-300 text-xs mb-1.5 cursor-pointer hover:text-white">{item}</div>
              ))}
            </div>
            <div>
              <div className="text-white font-semibold text-sm mb-3">Ijtimoiy tarmoqlar</div>
              {['Telegram','Instagram','Facebook','YouTube'].map(item => (
                <div key={item} className="text-blue-300 text-xs mb-1.5 cursor-pointer hover:text-white">{item}</div>
              ))}
            </div>
          </div>
          <div className="border-t border-blue-800 pt-4 flex items-center justify-between">
            <div className="text-blue-400 text-xs">© 2026 OneBank.uz — Barcha huquqlar himoyalangan</div>
            <div className="text-blue-400 text-xs">Ma'lumotlar faqat ma'lumot uchun · Rasmiy manba emas</div>
          </div>
        </div>
      </footer>

    </div>
  );
}