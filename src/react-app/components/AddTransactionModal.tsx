import { useState } from "react";
import { X, Search } from "lucide-react";
import { Instrument } from "@/shared/types";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transaction: {
    instrument_id: number;
    side: 'BUY' | 'SELL';
    qty: number;
    price: number;
    fees: number;
    trade_date: string;
  }) => void;
}

export default function AddTransactionModal({ isOpen, onClose, onSubmit }: AddTransactionModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null);
  const [searchResults, setSearchResults] = useState<Instrument[]>([]);
  const [formData, setFormData] = useState({
    side: 'BUY' as 'BUY' | 'SELL',
    qty: '',
    price: '',
    fees: '0',
    trade_date: new Date().toISOString().split('T')[0]
  });

  const searchInstruments = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`/api/instruments/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const results = await response.json();
        setSearchResults(results);
      }
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    searchInstruments(value);
  };

  const selectInstrument = (instrument: Instrument) => {
    setSelectedInstrument(instrument);
    setSearchQuery(instrument.symbol);
    setSearchResults([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedInstrument) {
      alert("Please select a stock");
      return;
    }

    if (!formData.qty || !formData.price) {
      alert("Please fill in all required fields");
      return;
    }

    onSubmit({
      instrument_id: selectedInstrument.id,
      side: formData.side,
      qty: parseFloat(formData.qty),
      price: parseFloat(formData.price),
      fees: parseFloat(formData.fees),
      trade_date: formData.trade_date
    });

    // Reset form
    setSelectedInstrument(null);
    setSearchQuery("");
    setFormData({
      side: 'BUY',
      qty: '',
      price: '',
      fees: '0',
      trade_date: new Date().toISOString().split('T')[0]
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">Add Transaction</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Stock Search */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Search Stock <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search by symbol or company name..."
                className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
            
            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-2 bg-white border border-slate-200 rounded-xl shadow-lg max-h-40 overflow-y-auto">
                {searchResults.map((instrument) => (
                  <button
                    key={instrument.id}
                    type="button"
                    onClick={() => selectInstrument(instrument)}
                    className="w-full px-4 py-3 text-left hover:bg-slate-50 first:rounded-t-xl last:rounded-b-xl"
                  >
                    <div className="font-medium text-slate-900">{instrument.symbol}</div>
                    <div className="text-sm text-slate-500">{instrument.name}</div>
                  </button>
                ))}
              </div>
            )}

            {/* Selected Stock */}
            {selectedInstrument && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="font-medium text-blue-900">{selectedInstrument.symbol}</div>
                <div className="text-sm text-blue-700">{selectedInstrument.name}</div>
              </div>
            )}
          </div>

          {/* Transaction Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Transaction Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, side: 'BUY' }))}
                className={`py-3 px-4 rounded-xl border font-medium transition-colors ${
                  formData.side === 'BUY'
                    ? 'bg-green-50 border-green-300 text-green-700'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Buy
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, side: 'SELL' }))}
                className={`py-3 px-4 rounded-xl border font-medium transition-colors ${
                  formData.side === 'SELL'
                    ? 'bg-red-50 border-red-300 text-red-700'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Sell
              </button>
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Number of Shares <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.qty}
              onChange={(e) => setFormData(prev => ({ ...prev, qty: e.target.value }))}
              placeholder="e.g. 100"
              min="0"
              step="0.01"
              className="block w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              required
            />
          </div>

          {/* Price per Share */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Price per Share <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-slate-500">₹</span>
              </div>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="block w-full pl-8 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                required
              />
            </div>
          </div>

          {/* Fees */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Fees & Commissions
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-slate-500">₹</span>
              </div>
              <input
                type="number"
                value={formData.fees}
                onChange={(e) => setFormData(prev => ({ ...prev, fees: e.target.value }))}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="block w-full pl-8 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Trade Date */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Trade Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.trade_date}
              onChange={(e) => setFormData(prev => ({ ...prev, trade_date: e.target.value }))}
              className="block w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              required
            />
          </div>

          {/* Total Calculation */}
          {formData.qty && formData.price && (
            <div className="p-4 bg-slate-50 rounded-xl">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Subtotal:</span>
                <span className="text-slate-900">
                  ₹{(parseFloat(formData.qty || '0') * parseFloat(formData.price || '0')).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm mt-1">
                <span className="text-slate-600">Fees:</span>
                <span className="text-slate-900">₹{parseFloat(formData.fees || '0').toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center font-semibold mt-2 pt-2 border-t border-slate-200">
                <span className="text-slate-900">Total:</span>
                <span className="text-slate-900">
                  ₹{(
                    parseFloat(formData.qty || '0') * parseFloat(formData.price || '0') +
                    (formData.side === 'BUY' ? parseFloat(formData.fees || '0') : -parseFloat(formData.fees || '0'))
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!selectedInstrument || !formData.qty || !formData.price}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Add Transaction
          </button>
        </form>
      </div>
    </div>
  );
}
