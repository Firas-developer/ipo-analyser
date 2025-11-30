import React from 'react'

const FinancialCharts = ({ financialMetrics }) => {
  if (!financialMetrics || !financialMetrics.yearly_data) {
    return null
  }

  const { yearly_data, total_revenue, total_profit, total_loss, avg_margin, revenue_growth_trend, profitability_trend } = financialMetrics

  // Calculate max values for scaling
  const maxRevenue = Math.max(...yearly_data.map(d => d.revenue))
  const maxProfit = Math.max(...yearly_data.map(d => Math.max(d.profit, d.loss)))

  return (
    <div className="space-y-6 animate-fade-in-stagger">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur border border-blue-500/30 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-400 text-sm font-medium">Total Revenue</span>
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-white mb-1">₹{total_revenue.toFixed(1)}M</p>
          <p className="text-xs text-slate-400">Total Revenue</p>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur border border-green-500/30 rounded-xl p-6 hover:border-green-500/50 transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-400 text-sm font-medium">Total Profit</span>
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-white mb-1">₹{total_profit.toFixed(1)}M</p>
          <p className="text-xs text-slate-400">Total Profit</p>
        </div>

        <div className="bg-gradient-to-br from-red-500/10 to-rose-500/10 backdrop-blur border border-red-500/30 rounded-xl p-6 hover:border-red-500/50 transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <span className="text-red-400 text-sm font-medium">Total Loss</span>
            <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-white mb-1">₹{total_loss.toFixed(1)}M</p>
          <p className="text-xs text-slate-400">Total Loss</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur border border-purple-500/30 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-400 text-sm font-medium">Avg Margin</span>
            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-white mb-1">{avg_margin.toFixed(1)}%</p>
          <p className="text-xs text-slate-400">Average Margin</p>
        </div>
      </div>

      {/* Revenue & Profit Chart */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur border border-slate-700/50 rounded-xl shadow-lg p-8 hover:border-cyan-500/30 transition-all duration-300 transform hover:scale-105">
        <h3 className="text-2xl font-bold text-white mb-6">Revenue & Profit Trend</h3>
        
        {/* Simple Bar Chart */}
        <div className="space-y-6">
          {yearly_data.map((year, index) => (
            <div key={year.year} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300 font-medium">{year.year}</span>
                <div className="flex items-center gap-4">
                  <span className="text-blue-400">Revenue: ₹{year.revenue.toFixed(1)}M</span>
                  <span className={year.profit > 0 ? "text-green-400" : "text-red-400"}>
                    {year.profit > 0 ? `Profit: ₹${year.profit.toFixed(1)}M` : `Loss: ₹${Math.abs(year.loss).toFixed(1)}M`}
                  </span>
                  <span className="text-purple-400">Margin: {year.margin.toFixed(1)}%</span>
                </div>
              </div>
              
              {/* Revenue Bar */}
              <div className="relative h-8 bg-slate-700/50 rounded-full overflow-hidden">
                <div 
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(year.revenue / maxRevenue) * 100}%` }}
                >
                  <div className="h-full flex items-center justify-end px-2">
                    <span className="text-xs text-white font-medium">₹{year.revenue.toFixed(1)}M</span>
                  </div>
                </div>
              </div>
              
              {/* Profit/Loss Bar */}
              <div className="relative h-6 bg-slate-700/50 rounded-full overflow-hidden">
                {year.profit > 0 ? (
                  <div 
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${(year.profit / maxProfit) * 100}%` }}
                  >
                    <div className="h-full flex items-center justify-end px-2">
                      <span className="text-xs text-white font-medium">₹{year.profit.toFixed(1)}M</span>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="absolute right-0 top-0 h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${(Math.abs(year.loss) / maxProfit) * 100}%` }}
                  >
                    <div className="h-full flex items-center justify-start px-2">
                      <span className="text-xs text-white font-medium">-₹{Math.abs(year.loss).toFixed(1)}M</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Growth Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur border border-slate-700/50 rounded-xl shadow-lg p-8 hover:border-cyan-500/30 transition-all duration-300 transform hover:scale-105">
          <h3 className="text-xl font-bold text-white mb-4">Revenue Growth Trend</h3>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${
              revenue_growth_trend === 'increasing' ? 'bg-green-500' : 
              revenue_growth_trend === 'decreasing' ? 'bg-red-500' : 'bg-yellow-500'
            }`} />
            <span className={`text-lg font-medium capitalize ${
              revenue_growth_trend === 'increasing' ? 'text-green-400' : 
              revenue_growth_trend === 'decreasing' ? 'text-red-400' : 'text-yellow-400'
            }`}>
              {revenue_growth_trend}
            </span>
          </div>
          
          {/* Growth Rate Bars */}
          <div className="mt-4 space-y-2">
            {yearly_data.map((year, index) => (
              <div key={year.year} className="flex items-center gap-3">
                <span className="text-slate-400 text-sm w-12">{year.year}</span>
                <div className="flex-1 h-4 bg-slate-700/50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                      year.growth_rate > 0 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                        : 'bg-gradient-to-r from-red-500 to-rose-500'
                    }`}
                    style={{ width: `${Math.abs(year.growth_rate) * 5}%` }}
                  />
                </div>
                <span className={`text-sm font-medium w-20 text-right ${
                  year.growth_rate > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {year.growth_rate > 0 ? '+' : ''}{year.growth_rate.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur border border-slate-700/50 rounded-xl shadow-lg p-8 hover:border-cyan-500/30 transition-all duration-300 transform hover:scale-105">
          <h3 className="text-xl font-bold text-white mb-4">Profitability Trend</h3>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${
              profitability_trend === 'improving' ? 'bg-green-500' : 
              profitability_trend === 'declining' ? 'bg-red-500' : 'bg-yellow-500'
            }`} />
            <span className={`text-lg font-medium capitalize ${
              profitability_trend === 'improving' ? 'text-green-400' : 
              profitability_trend === 'declining' ? 'text-red-400' : 'text-yellow-400'
            }`}>
              {profitability_trend}
            </span>
          </div>
          
          {/* Margin Bars */}
          <div className="mt-4 space-y-2">
            {yearly_data.map((year, index) => (
              <div key={year.year} className="flex items-center gap-3">
                <span className="text-slate-400 text-sm w-12">{year.year}</span>
                <div className="flex-1 h-4 bg-slate-700/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${year.margin * 5}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-20 text-right text-purple-400">
                  {year.margin.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FinancialCharts
