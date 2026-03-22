'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const ADMIN_PASSWORD = 'onebank2026';

export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [fuelPrices, setFuelPrices] = useState([]);
  const [banks, setBanks] = useState([]);
  const [credits, setCredits] = useState([]);
  const [activeTab, setActiveTab] = useState('fuel');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (auth) {
      fetchData();
    }
  }, [auth]);

  async function fetchData() {
    const { data: fuel } = await supabase.from('fuel_prices').select('*').order('id');
    const { data: banksData } = await supabase.from('banks').select('*').order('id');
    const { data: creditsData } = await supabase.from('credits').select('*').order('id');
    setFuelPrices(fuel || []);
    setBanks(banksData || []);
    setCredits(creditsData || []);
  }

  async function updateFuelPrice(id, field, value) {
    setFuelPrices(prev => prev.map(f => f.id === id ? {...f, [field]: value} : f));
  }

  async function saveFuelPrice(id) {
    setSaving(true);
    const item = fuelPrices.find(f => f.id === id);
    const { error } = await supabase.from('fuel_prices').update({
      price: Number(item.price),
      station_name: item.station_name,
      fuel_type: item.fuel_type,
    }).eq('id', id);
    setSaving(false);
    setMessage(error ? 'Xato!' : 'Saqlandi ✅');
    setTimeout(() => setMessage(''), 2000);
  }

  async function addFuelPrice() {
    const { data } = await supabase.from('fuel_prices').insert({
      station_name: 'Yangi AZS',
      fuel_type: 'AI-91',
      price: 12000
    }).select();
    if (data) setFuelPrices(prev => [...prev, ...data]);
  }

  async function deleteFuelPrice(id) {
    await supabase.from('fuel_prices').delete().eq('id', id);
    setFuelPrices(prev => prev.filter(f => f.id !== id));
  }

  if (!auth) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 w-80">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-blue-900 rounded-xl flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">O</div>
            <div className="font-bold text-gray-900">OneBank Admin</div>
            <div className="text-xs text-gray-400 mt-1">Faqat administratorlar uchun</div>
          </div>
          <input
            type="password"
            placeholder="Parol"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && password === ADMIN_PASSWORD && setAuth(true)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-3 outline-none focus:border-blue-400"
          />
          <button
            onClick={() => password === ADMIN_PASSWORD ? setAuth(true) : setMessage('Noto\'g\'ri parol!')}
            className="w-full bg-blue-900 text-white py-3 rounded-xl text-sm font-semibold"
          >
            Kirish
          </button>
          {message && <p className="text-red-500 text-xs text-center mt-2">{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-900 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-blue-900 font-bold text-xs">O</div>
          <span className="text-white font-bold">OneBank Admin Panel</span>
        </div>
        <div className="flex items-center gap-3">
          {message && <span className="text-green-300 text-sm">{message}</span>}
          <button onClick={() => setAuth(false)} className="text-blue-300 text-sm hover:text-white">Chiqish</button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[['fuel','⛽ Benzin narxlari'],['banks','🏦 Banklar'],['credits','💰 Kreditlar']].map(([key,label]) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${activeTab===key ? 'bg-blue-900 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Benzin */}
        {activeTab === 'fuel' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Benzin narxlari</h2>
              <button onClick={addFuelPrice} className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-semibold">+ Qo'shish</button>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs text-gray-400 pb-2 font-semibold">AZS nomi</th>
                  <th className="text-left text-xs text-gray-400 pb-2 font-semibold">Yoqilg'i turi</th>
                  <th className="text-left text-xs text-gray-400 pb-2 font-semibold">Narx (so'm)</th>
                  <th className="text-left text-xs text-gray-400 pb-2 font-semibold">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {fuelPrices.map(f => (
                  <tr key={f.id} className="border-b border-gray-50">
                    <td className="py-2 pr-3">
                      <input value={f.station_name} onChange={e => updateFuelPrice(f.id,'station_name',e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-full outline-none focus:border-blue-400"/>
                    </td>
                    <td className="py-2 pr-3">
                      <select value={f.fuel_type} onChange={e => updateFuelPrice(f.id,'fuel_type',e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-400">
                        {['AI-80','AI-91','AI-92','AI-95','Dizel','Gaz','Elektro'].map(t => <option key={t}>{t}</option>)}
                      </select>
                    </td>
                    <td className="py-2 pr-3">
                      <input type="number" value={f.price} onChange={e => updateFuelPrice(f.id,'price',e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-32 outline-none focus:border-blue-400"/>
                    </td>
                    <td className="py-2">
                      <div className="flex gap-2">
                        <button onClick={() => saveFuelPrice(f.id)} disabled={saving}
                          className="px-3 py-1.5 bg-blue-900 text-white rounded-lg text-xs font-semibold">
                          {saving ? '...' : 'Saqlash'}
                        </button>
                        <button onClick={() => deleteFuelPrice(f.id)}
                          className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-semibold">
                          O'chirish
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Banklar */}
        {activeTab === 'banks' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-4">Banklar</h2>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs text-gray-400 pb-2 font-semibold">Bank nomi</th>
                  <th className="text-left text-xs text-gray-400 pb-2 font-semibold">Veb-sayt</th>
                  <th className="text-left text-xs text-gray-400 pb-2 font-semibold">Holat</th>
                </tr>
              </thead>
              <tbody>
                {banks.map(b => (
                  <tr key={b.id} className="border-b border-gray-50 py-2">
                    <td className="py-2 pr-3 text-sm font-medium text-gray-900">{b.name}</td>
                    <td className="py-2 pr-3 text-sm text-blue-600">{b.website}</td>
                    <td className="py-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${b.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                        {b.is_active ? 'Faol' : 'Nofaol'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Kreditlar */}
        {activeTab === 'credits' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-4">Kreditlar</h2>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs text-gray-400 pb-2 font-semibold">Nomi</th>
                  <th className="text-left text-xs text-gray-400 pb-2 font-semibold">Min stavka</th>
                  <th className="text-left text-xs text-gray-400 pb-2 font-semibold">Max summa</th>
                  <th className="text-left text-xs text-gray-400 pb-2 font-semibold">Max muddat</th>
                </tr>
              </thead>
              <tbody>
                {credits.map(c => (
                  <tr key={c.id} className="border-b border-gray-50">
                    <td className="py-2 pr-3 text-sm font-medium text-gray-900">{c.name}</td>
                    <td className="py-2 pr-3 text-sm text-gray-600">{c.min_rate}%</td>
                    <td className="py-2 pr-3 text-sm text-gray-600">{Number(c.max_amount).toLocaleString('ru-RU')} so'm</td>
                    <td className="py-2 text-sm text-gray-600">{c.max_months} oy</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}