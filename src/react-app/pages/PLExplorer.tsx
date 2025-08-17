import { useEffect, useState } from "react";
import Layout from "@/react-app/components/Layout";
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

interface PLData {
  period: string;
  realized_pl: number;
  unrealized_pl: number;
  dividends: number;
  total_pl: number;
  returns_absolute: number;
  returns_percent: number;
}

export default function PLExplorer() {
  const [plData, setPLData] = useState<PLData | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('1y');
  const [loading, setLoading] = useState(true);

  const periods = [
    { value: '1m', label: '1M' },
    { value: '3m', label: '3M' },
    { value: '6m', label: '6M' },
    { value: '1y', label: '1Y' },
    { value: '3y', label: '3Y' },
    { value: '5y', label: '5Y' },
    { value: 'custom', label: 'Custom' }
  ];

  useEffect(() => {
    fetchPLData();
  }, [selectedPeriod]);

  const fetchPLData = async () => {
    try {
      const response = await fetch(`/api/pl-analysis?period=${selectedPeriod}`);
      if (response.ok) {
        const data = await response.json();
        setPLData(data.summary);
        setChartData(data.chartData || []);
      }
    } catch (error) {
      console.error("Failed to fetch P&L data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? "+" : ""}${percent.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
            ))}
          </div>
          <div className="h-96 bg-slate-200 rounded-xl"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">P&L Explorer</h1>
            <p className="text-slate-600 mt-1">Analyze your investment performance over time</p>
          </div>
          
          {/* Period Selection */}
          <div className="mt-4 sm:mt-0">
            <div className="flex space-x-2 bg-slate-100 rounded-lg p-1">
              {periods.map((period) => (
                <button
                  key={period.value}
                  onClick={() => setSelectedPeriod(period.value)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    selectedPeriod === period.value
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* P&L Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total P&L */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total P&L</p>
                <p className={`text-2xl font-bold ${
                  (plData?.total_pl || 0) >= 0 ? "text-green-600" : "text-red-600"
                }`}>
                  {formatCurrency(plData?.total_pl || 0)}
                </p>
                <p className={`text-sm ${
                  (plData?.returns_percent || 0) >= 0 ? "text-green-600" : "text-red-600"
                }`}>
                  {formatPercent(plData?.returns_percent || 0)}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                (plData?.total_pl || 0) >= 0 ? "bg-green-50" : "bg-red-50"
              }`}>
                {(plData?.total_pl || 0) >= 0 ? (
                  <TrendingUp className="w-6 h-6 text-green-600" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-red-600" />
                )}
              </div>
            </div>
          </div>

          {/* Realized P&L */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Realized P&L</p>
                <p className={`text-2xl font-bold ${
                  (plData?.realized_pl || 0) >= 0 ? "text-green-600" : "text-red-600"
                }`}>
                  {formatCurrency(plData?.realized_pl || 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Unrealized P&L */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Unrealized P&L</p>
                <p className={`text-2xl font-bold ${
                  (plData?.unrealized_pl || 0) >= 0 ? "text-green-600" : "text-red-600"
                }`}>
                  {formatCurrency(plData?.unrealized_pl || 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Dividends */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Dividends</p>
                <p className="text-2xl font-bold text-slate-900">
                  {formatCurrency(plData?.dividends || 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Equity Curve */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Portfolio Value Over Time</h2>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Line type="monotone" dataKey="portfolioValue" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly P&L */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Monthly P&L</h2>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Bar dataKey="monthlyPL" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
