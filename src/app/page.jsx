"use client";

import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Info, TrendingUp, Shield, DollarSign, AlertTriangle, BookOpen, Activity, Youtube } from 'lucide-react';

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden ${className}`}>
    {children}
  </div>
);

const SectionTitle = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mb-4 text-blue-800 border-b pb-2 border-blue-100">
    <Icon className="w-6 h-6" />
    <h2 className="text-xl font-bold">{title}</h2>
  </div>
);

export default function Home() {
  const [activeTab, setActiveTab] = useState('concept');

  // State for Simulation
  const [stockPrice, setStockPrice] = useState(22.00);
  const [longPutStrike, setLongPutStrike] = useState(22.00);
  const [shortCallStrike, setShortCallStrike] = useState(21.50);
  const [longCallStrike, setLongCallStrike] = useState(23.00);
  const [initialCost, setInitialCost] = useState(3.00);
  const [rollCredit, setRollCredit] = useState(0.20);
  const [weeksRolled, setWeeksRolled] = useState(0);

  const chartData = useMemo(() => {
    const data = [];
    const minRange = Math.min(longPutStrike, shortCallStrike) * 0.7;
    const maxRange = Math.max(longCallStrike, shortCallStrike) * 1.3;
    const steps = 50;
    const stepSize = (maxRange - minRange) / steps;

    const accumulatedCredit = rollCredit * weeksRolled;
    const totalCost = initialCost - accumulatedCredit;

    for (let i = 0; i <= steps; i++) {
      const price = minRange + (i * stepSize);
      const longPutValue = Math.max(longPutStrike - price, 0);
      const longCallValue = Math.max(price - longCallStrike, 0);
      const shortCallValue = 2 * Math.max(price - shortCallStrike, 0);
      const structureValue = longPutValue + longCallValue - shortCallValue;
      const pnl = structureValue - totalCost;

      data.push({
        price: parseFloat(price.toFixed(2)),
        pnl: parseFloat(pnl.toFixed(2)),
        structureValue: parseFloat(structureValue.toFixed(2)),
        zeroLine: 0
      });
    }
    return data;
  }, [stockPrice, longPutStrike, shortCallStrike, longCallStrike, initialCost, rollCredit, weeksRolled]);

  const currentPnL = useMemo(() => {
    const accumulatedCredit = rollCredit * weeksRolled;
    const totalCost = initialCost - accumulatedCredit;
    const longPutValue = Math.max(longPutStrike - stockPrice, 0);
    const longCallValue = Math.max(stockPrice - longCallStrike, 0);
    const shortCallValue = 2 * Math.max(stockPrice - shortCallStrike, 0);
    return (longPutValue + longCallValue - shortCallValue - totalCost).toFixed(2);
  }, [stockPrice, longPutStrike, shortCallStrike, longCallStrike, initialCost, rollCredit, weeksRolled]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-2">Simulador da Mônada</h1>
          <p className="text-gray-600 text-lg">Análise da Estrutura "Alimentador Over Strip Long Put Long Call"</p>
          <p className="text-sm text-gray-500 mt-1">Baseado no vídeo do canal Mestre dos Derivativos</p>
        </header>

        <div className="flex justify-center mb-6">
          <div className="bg-white p-1 rounded-lg shadow-sm border border-gray-200 inline-flex">
            <button
              onClick={() => setActiveTab('concept')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                activeTab === 'concept' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BookOpen className="inline w-4 h-4 mr-2" />
              Conceitos Chave
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                activeTab === 'simulator' 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Activity className="inline w-4 h-4 mr-2" />
              Simulador Interativo
            </button>
          </div>
        </div>

        {activeTab === 'concept' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 md:col-span-2">
              <SectionTitle icon={Youtube} title="Vídeo Base: Mestre dos Derivativos" />
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-gray-700 mb-2">
                  Assista ao vídeo original para entender todos os detalhes da estratégia:
                </p>
                {/* ✅ Corrigido: removido espaço extra na URL */}
                <a 
                  href="https://www.youtube.com/watch?v=-YVI-P8WP1I" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-bold underline flex items-center gap-2"
                >
                  <Youtube className="w-5 h-5" />
                  Construção de uma Mônada - Alimentador Over Strip Long Put Long Call
                </a>
              </div>
            </Card>

            <Card className="p-6">
              <SectionTitle icon={Shield} title="A Estrutura (Mônada)" />
              <p className="mb-4 text-gray-700 leading-relaxed">
                A "Mônada" descrita é uma estrutura híbrida desenhada para ter risco de perda financeira baixíssimo no longo prazo, embora tenha um <strong>custo inicial elevado</strong>.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-full text-green-700 mt-1"><TrendingUp size={16} /></div>
                  <div>
                    <span className="font-bold block text-gray-900">Long Put (Proteção)</span>
                    <span className="text-sm text-gray-600">Compra de uma Put longa (ex: 2 anos). Protege contra quedas bruscas do mercado ("Mega Batida").</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-full text-blue-700 mt-1"><TrendingUp size={16} /></div>
                  <div>
                    <span className="font-bold block text-gray-900">Long Call (Potencial)</span>
                    <span className="text-sm text-gray-600">Compra de uma Call (ex: 3 meses). Permite ganhar com a alta do ativo.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-red-100 p-2 rounded-full text-red-700 mt-1"><DollarSign size={16} /></div>
                  <div>
                    <span className="font-bold block text-gray-900">Short Call/Strangle (Financiamento)</span>
                    <span className="text-sm text-gray-600">Venda de opções curtas (Call ou Put) para gerar caixa recorrente e pagar o custo da estrutura.</span>
                  </div>
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <SectionTitle icon={Info} title="A Mágica da Rolagem" />
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                <p className="text-blue-800 font-medium">
                  "O grande segredo está na replicação."
                </p>
              </div>
              <p className="text-gray-700 mb-4">
                O objetivo não é lucrar apenas com a valorização direcional, mas usar o tempo a seu favor.
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-gray-800">Cenário Lateral ("Festa da Uva")</h3>
                  <p className="text-sm text-gray-600">Se o mercado ficar parado, as opções vendidas viram "pó" (perdem valor) e você embolsa o prêmio total. Isso abate o custo inicial.</p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">O Poder do Tempo</h3>
                  <p className="text-sm text-gray-600">Com rolagens sucessivas (ex: 15 semanas), o crédito acumulado pode zerar o custo da estrutura, transformando-a em uma posição de "Risco Zero" com proteção perpétua.</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 md:col-span-2">
              <SectionTitle icon={AlertTriangle} title="Riscos e Atenção" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-bold text-red-800 mb-2">1. Alta Explosiva</h3>
                  <p className="text-sm text-red-700">Se o mercado subir muito rápido, a perna vendida (Short Call x2) pode gerar prejuízo ilimitado. É necessário manejo (rolagem ou stop).</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-bold text-yellow-800 mb-2">2. Custo Inicial</h3>
                  <p className="text-sm text-yellow-700">É uma estrutura cara de montar (R$ 3,00 por estrutura no exemplo). Exige capital.</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-bold text-orange-800 mb-2">3. Paciência</h3>
                  <p className="text-sm text-orange-700">O lucro vem "de colherinha". Não é para quem quer ficar rico em uma semana, mas para quem quer construir patrimônio blindado.</p>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <Card className="p-5 bg-slate-50 border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Activity size={18} /> Parâmetros de Mercado
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Preço Atual da Ação (R$)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={stockPrice} 
                      onChange={(e) => setStockPrice(Number(e.target.value))}
                      className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-5">
                <h3 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
                  <Shield size={18} /> Estrutura da Mônada
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-green-600 uppercase mb-1">Strike Long Put (Proteção)</label>
                    <input 
                      type="range" min="15" max="35" step="0.5"
                      value={longPutStrike} 
                      onChange={(e) => setLongPutStrike(Number(e.target.value))}
                      className="w-full accent-green-600"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>R$ 15.00</span>
                      <span className="font-bold text-green-700">R$ {longPutStrike.toFixed(2)}</span>
                      <span>R$ 35.00</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-red-600 uppercase mb-1">Strike Short Call x2 (Venda)</label>
                    <input 
                      type="range" min="15" max="35" step="0.5"
                      value={shortCallStrike} 
                      onChange={(e) => setShortCallStrike(Number(e.target.value))}
                      className="w-full accent-red-600"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>R$ 15.00</span>
                      <span className="font-bold text-red-700">R$ {shortCallStrike.toFixed(2)}</span>
                      <span>R$ 35.00</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-blue-600 uppercase mb-1">Strike Long Call (Upside)</label>
                    <input 
                      type="range" min="15" max="35" step="0.5"
                      value={longCallStrike} 
                      onChange={(e) => setLongCallStrike(Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>R$ 15.00</span>
                      <span className="font-bold text-blue-700">R$ {longCallStrike.toFixed(2)}</span>
                      <span>R$ 35.00</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-5 bg-yellow-50 border-yellow-200">
                <h3 className="font-bold text-yellow-800 mb-4 flex items-center gap-2">
                  <DollarSign size={18} /> Simulação de Rolagem
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Custo Inicial da Estrutura (R$)</label>
                    <input 
                      type="number" step="0.1"
                      value={initialCost} 
                      onChange={(e) => setInitialCost(Number(e.target.value))}
                      className="w-full p-2 rounded border border-yellow-300 bg-white"
                    />
                  </div>
                   <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Crédito Médio por Rolagem (R$)</label>
                    <input 
                      type="number" step="0.01"
                      value={rollCredit} 
                      onChange={(e) => setRollCredit(Number(e.target.value))}
                      className="w-full p-2 rounded border border-yellow-300 bg-white"
                    />
                  </div>
                  <div className="pt-2 border-t border-yellow-200">
                    <label className="block text-xs font-bold text-purple-700 uppercase mb-2">Tempo Decorrido (Rolagens Feitas)</label>
                    <input 
                      type="range" min="0" max="52" step="1"
                      value={weeksRolled} 
                      onChange={(e) => setWeeksRolled(Number(e.target.value))}
                      className="w-full accent-purple-600"
                    />
                    <div className="text-center font-bold text-purple-800 text-lg">
                      {weeksRolled} Semanas
                    </div>
                    <div className="text-center text-xs text-gray-500 mt-1">
                      Crédito Acumulado: R$ {(weeksRolled * rollCredit).toFixed(2)}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-3 text-center bg-blue-600 text-white border-none">
                  <div className="text-xs opacity-80">Custo Ajustado</div>
                  <div className="text-xl font-bold">R$ {(initialCost - (weeksRolled * rollCredit)).toFixed(2)}</div>
                </Card>
                <Card className="p-3 text-center">
                  <div className="text-xs text-gray-500">Break-even Down</div>
                  <div className="text-xl font-bold text-green-600">
                    {longPutStrike - (initialCost - (weeksRolled * rollCredit)) > 0 
                      ? (longPutStrike - (initialCost - (weeksRolled * rollCredit))).toFixed(2) 
                      : "0.00"}
                  </div>
                </Card>
                <Card className="p-3 text-center">
                   <div className="text-xs text-gray-500">Lucro Máx (Lateral)</div>
                  <div className="text-xl font-bold text-gray-700">
                     R$ {(weeksRolled * rollCredit - initialCost).toFixed(2)}*
                  </div>
                   <div className="text-[10px] text-gray-400">*Se virar pó</div>
                </Card>
                 <Card className="p-3 text-center bg-gray-800 text-white border-none">
                  <div className="text-xs opacity-80">Resultado Agora</div>
                  <div className={`text-xl font-bold ${Number(currentPnL) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    R$ {currentPnL}
                  </div>
                </Card>
              </div>

              <Card className="p-4 h-[400px]">
                <h3 className="text-lg font-bold text-gray-700 mb-2">Gráfico de Payoff (No Vencimento)</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="price" 
                      label={{ value: 'Preço da Ação (R$)', position: 'insideBottom', offset: -5 }} 
                      type="number" 
                      domain={['auto', 'auto']}
                    />
                    <YAxis 
                      label={{ value: 'Lucro/Prejuízo (R$)', angle: -90, position: 'insideLeft' }} 
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: '1px solid #ddd' }}
                      labelStyle={{ fontWeight: 'bold', color: '#333' }}
                      formatter={(value) => `R$ ${value}`}
                    />
                    <Legend verticalAlign="top" height={36}/>
                    <ReferenceLine y={0} stroke="#666" strokeWidth={2} />
                    <ReferenceLine x={stockPrice} stroke="#3b82f6" strokeDasharray="5 5" label="Preço Atual" />
                    <Line 
                      type="monotone" 
                      dataKey="pnl" 
                      stroke={initialCost - (weeksRolled * rollCredit) <= 0 ? "#10b981" : "#8b5cf6"} 
                      strokeWidth={3} 
                      name="Resultado (P&L)"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 border border-blue-200">
                <strong>Análise do Gráfico:</strong>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>A linha roxa/verde mostra seu lucro ou prejuízo no dia do vencimento das opções curtas.</li>
                  <li>Observe como aumentar as <strong>"Semanas (Rolagens Feitas)"</strong> desloca a curva inteira para cima, reduzindo o prejuízo e aumentando a zona de lucro.</li>
                  <li>O "V" invertido profundo à direita mostra o risco da venda coberta dobrada (2x Short Call) se o mercado explodir sem manejo.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}