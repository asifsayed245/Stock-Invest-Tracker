import { useEffect, useState } from "react";
import Layout from "@/react-app/components/Layout";
import { DashboardData } from "@/shared/types";
import { TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react";
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, Tooltip, Pie } from "recharts";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/dashboard");
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
            ))}
          </div>
          <div className="h-96 bg-slate-200 rounded-xl"></div>
        </div>
      </Layout>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? "+" : ""}${percent.toFixed(2)}%`;
  };

  // Prepare pie chart data
  const pieData = dashboardData?.holdings?.slice(0, 8).map((holding, index) => ({
    name: holding.instrument?.symbol || `Position ${index + 1}`,
    value: holding.mv_local || 0,
    color: `hsl(${(index * 45) % 360}, 70%, 60%)`
  })) || [];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Portfolio Dashboard</h1>
          <p className="text-slate-600 mt-1">Track your investment performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Portfolio Value */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Portfolio Value</p>
                <p className="text-2xl font-bold text-slate-900">
                  {formatCurrency(dashboardData?.portfolio_value || 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Day Change */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Day Change</p>
                <p className="text-2xl font-bold text-slate-900">
                  {formatCurrency(dashboardData?.day_change || 0)}
                </p>
                <p className={`text-sm ${
                  (dashboardData?.day_change_percent || 0) >= 0 ? "text-green-600" : "text-red-600"
                }`}>
                  {formatPercent(dashboardData?.day_change_percent || 0)}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                (dashboardData?.day_change || 0) >= 0 ? "bg-green-50" : "bg-red-50"
              }`}>
                {(dashboardData?.day_change || 0) >= 0 ? (
                  <TrendingUp className="w-6 h-6 text-green-600" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-red-600" />
                )}
              </div>
            </div>
          </div>

          {/* Total P&L */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total P&L</p>
                <p className={`text-2xl font-bold ${
                  (dashboardData?.total_pl || 0) >= 0 ? "text-green-600" : "text-red-600"
                }`}>
                  {formatCurrency(dashboardData?.total_pl || 0)}
                </p>
                <p className={`text-sm ${
                  (dashboardData?.total_pl_percent || 0) >= 0 ? "text-green-600" : "text-red-600"
                }`}>
                  {formatPercent(dashboardData?.total_pl_percent || 0)}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                (dashboardData?.total_pl || 0) >= 0 ? "bg-green-50" : "bg-red-50"
              }`}>
                {(dashboardData?.total_pl || 0) >= 0 ? (
                  <TrendingUp className="w-6 h-6 text-green-600" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-red-600" />
                )}
              </div>
            </div>
          </div>

          {/* YTD Dividends */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">YTD Dividends</p>
                <p className="text-2xl font-bold text-slate-900">
                  {formatCurrency(dashboardData?.dividends_ytd || 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <PieChart className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Holdings Table and Allocation Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Holdings Table */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Current Holdings</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Symbol</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Avg Cost</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Market Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">P&L</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {dashboardData?.holdings?.map((holding) => (
                    <tr key={holding.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-slate-900">
                            {holding.instrument?.symbol || 'Unknown'}
                          </div>
                          <div className="text-sm text-slate-500">
                            {holding.instrument?.name || 'Unknown'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {holding.qty}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {formatCurrency(holding.avg_cost || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {formatCurrency(holding.mv_local || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${
                          (holding.pl || 0) >= 0 ? "text-green-600" : "text-red-600"
                        }`}>
                          {formatCurrency(holding.pl || 0)}
                        </div>
                        <div className={`text-xs ${
                          (holding.pl_percent || 0) >= 0 ? "text-green-600" : "text-red-600"
                        }`}>
                          {formatPercent(holding.pl_percent || 0)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(!dashboardData?.holdings || dashboardData.holdings.length === 0) && (
                <div className="text-center py-12">
                  <p className="text-slate-500">No holdings yet. Add your first transaction to get started.</p>
                </div>
              )}
            </div>
          </div>

          {/* Allocation Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Portfolio Allocation</h2>
            </div>
            <div className="p-6">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64">
                  <p className="text-slate-500">No data to display</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
