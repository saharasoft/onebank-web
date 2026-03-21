'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRates() {
      const { data } = await supabase
        .from('exchange_rates')
        .select('*')
        .in('currency_code', ['USD', 'EUR', 'RUB', 'GBP', 'CNY'])
        .order('currency_code');
      setRates(data || []);
      setLoading(false);
    }
    fetchRates();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <span className="text-xl font-semibold text-blue-600">OneBank.uz</span>
        <div className="flex gap-4 text-sm text-gray-500">
          <a href="#" className="hover:text-gray-900">Курсы</a>
          <a href="#" className="hover:text-gray-900">Банки</a>
          <a href="#" className="hover:text-gray-900">Бензин</a>
          <a href="#" className="hover:text-gray-900">Бизнес</a>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-white px-4 py-8 text-center border-b border-gray-100">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Все финансы Узбекистана в одном месте
        </h1>
        <p className="text-gray-500 text-sm">
          Курсы ЦБ РУз, банки, бензин — обновляется автоматически
        </p>
      </div>

      {/* Курсы валют */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">
          Курсы валют — ЦБ РУз
        </h2>

        {loading ? (
          <p className="text-gray-400 text-sm">Загрузка...</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {rates.map((r) => (
              <div key={r.id} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="text-xs text-gray-400 mb-1">{r.currency_code}</div>
                <div className="text-lg font-semibold text-gray-900">
                  {Number(r.rate).toLocaleString('ru-RU')}
                </div>
                <div className="text-xs text-gray-400 mt-1">сум</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Скоро */}
      <div className="max-w-4xl mx-auto px-4 pb-6">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">
          Скоро
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {['Кредиты', 'Депозиты', 'Карты', 'Бензин'].map((item) => (
            <div key={item} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
              <div className="text-sm text-gray-400">{item}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}