import { useEffect, useState } from "react";
import Layout from "@/react-app/components/Layout";
import { Upload, FileText, CheckCircle, XCircle, AlertCircle, Download, Trash2 } from "lucide-react";

interface UploadedStatement {
  id: number;
  filename: string;
  broker_code: string | null;
  status: string;
  error_summary: string | null;
  created_at: string;
  rows_total?: number;
  rows_parsed?: number;
  rows_flagged?: number;
  rows_committed?: number;
}

export default function Uploads() {
  const [statements, setStatements] = useState<UploadedStatement[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const handleBrokerConnect = async (brokerCode: string) => {
    try {
      const response = await fetch(`/api/brokers/${brokerCode}/connect`, {
        method: 'POST',
      });
      
      if (response.ok) {
        await response.json();
        // In production, redirect to broker's OAuth URL
        alert(`Mock OAuth flow for ${brokerCode}. In production, this would redirect to the broker's authorization page.`);
        
        // For demo, simulate successful connection
        setTimeout(async () => {
          const callbackResponse = await fetch(`/api/brokers/${brokerCode}/callback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: 'mock_auth_code' })
          });
          
          if (callbackResponse.ok) {
            alert(`Successfully connected to ${brokerCode}!`);
          }
        }, 2000);
      }
    } catch (error) {
      console.error('Connection error:', error);
      alert('Failed to connect to broker');
    }
  };

  useEffect(() => {
    fetchStatements();
  }, []);

  const fetchStatements = async () => {
    try {
      const response = await fetch("/api/statements");
      if (response.ok) {
        const data = await response.json();
        setStatements(data);
      }
    } catch (error) {
      console.error("Failed to fetch statements:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Basic client-side validation
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('File size too large. Maximum 10MB allowed.');
      event.target.value = '';
      return;
    }

    const allowedTypes = ['.csv', '.xlsx', '.xls'];
    const fileName = file.name.toLowerCase();
    const isValidType = allowedTypes.some(type => fileName.endsWith(type));
    
    if (!isValidType) {
      alert('Unsupported file type. Please upload CSV or Excel files only.');
      event.target.value = '';
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/statements/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadResult = await response.json();

      if (response.ok) {
        console.log('Upload result:', uploadResult);
        
        // Show success message
        if (uploadResult.processed > 0) {
          alert(`Success! Processed ${uploadResult.processed} transactions from your statement. Check the Transactions page to see them.`);
        } else if (uploadResult.errors > 0) {
          alert(`Upload completed but found ${uploadResult.errors} errors. Please check the file format or try the sample CSV.`);
        } else {
          alert('File uploaded successfully but no valid transactions were found. Please check the file format.');
        }
        
        fetchStatements(); // Refresh the list
        
      } else {
        console.error('Upload error:', uploadResult);
        alert(`Failed to upload file: ${uploadResult.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file. Please check your internet connection and try again.');
    } finally {
      setUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleDeleteStatement = async (statementId: number) => {
    if (!confirm('Are you sure you want to delete this statement? This will also remove all associated transactions.')) {
      return;
    }

    try {
      const response = await fetch(`/api/statements/${statementId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Statement deleted successfully');
        fetchStatements(); // Refresh the list
      } else {
        const error = await response.json();
        alert(`Failed to delete statement: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete statement. Please try again.');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'processing':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'completed_with_errors':
        return 'bg-orange-100 text-orange-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="h-96 bg-slate-200 rounded-xl"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Uploads & Connections</h1>
          <p className="text-slate-600 mt-1">Upload broker statements and connect your accounts</p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Upload Statement</h2>
            <a 
              href="/api/statements/sample-csv"
              download="sample-zerodha-statement.csv"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium underline"
            >
              Download Sample CSV
            </a>
          </div>
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
            <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-slate-900">Upload your broker statement</h3>
              <p className="text-slate-600">
                Supports CSV, Excel, and PDF files from major Indian brokers
              </p>
              <div className="mt-4">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    uploading 
                      ? 'text-slate-600 bg-slate-200 cursor-not-allowed' 
                      : 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                  }`}>
                    {uploading ? 'Processing...' : 'Choose File'}
                  </span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".csv,.xlsx,.xls,.pdf"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                </label>
              </div>
              <p className="text-xs text-slate-500">
                Supported formats: CSV, Excel (.xlsx, .xls), PDF
              </p>
              <div className="mt-2 p-2 bg-green-50 rounded-md">
                <p className="text-xs text-green-700">
                  💡 Try uploading the sample CSV above to see how statement processing works!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Broker Connections */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Broker Connections</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Auto-sync All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { code: 'zerodha', name: 'Zerodha', logo: '🟢', status: 'Not Connected' },
              { code: 'upstox', name: 'Upstox', logo: '🟡', status: 'Not Connected' },
              { code: 'icici_direct', name: 'ICICI Direct', logo: '🔵', status: 'Not Connected' },
              { code: 'hdfc_securities', name: 'HDFC Securities', logo: '🔴', status: 'Not Connected' },
              { code: 'angel_one', name: 'Angel One', logo: '⚫', status: 'Not Connected' },
              { code: 'groww', name: 'Groww', logo: '🟠', status: 'Not Connected' }
            ].map((broker) => (
              <div key={broker.name} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{broker.logo}</span>
                    <div>
                      <h3 className="font-medium text-slate-900">{broker.name}</h3>
                      <p className="text-sm text-slate-500">{broker.status}</p>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => handleBrokerConnect(broker.code)}
                  className="w-full bg-slate-100 text-slate-600 py-2 px-4 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
                >
                  Connect
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Auto-sync:</strong> Once connected, your broker accounts will automatically sync transactions daily. 
              You can also manually trigger a sync at any time.
            </p>
          </div>
        </div>

        {/* Uploaded Statements */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Upload History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">File</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Broker</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Progress</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Uploaded</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {statements.map((statement) => (
                  <tr key={statement.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-slate-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-slate-900">
                            {statement.filename}
                          </div>
                          {statement.error_summary && (
                            <div className="text-sm text-red-600">
                              {statement.error_summary}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {statement.broker_code || 'Auto-detect'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(statement.status)}
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(statement.status)}`}>
                          {statement.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {statement.rows_total && statement.rows_committed !== undefined ? (
                        <div>
                          {statement.rows_committed} / {statement.rows_total} rows
                          {(statement.rows_flagged || 0) > 0 && (
                            <div className="text-xs text-yellow-600">
                              {statement.rows_flagged} flagged
                            </div>
                          )}
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {formatDate(statement.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      <div className="flex space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-900"
                          title="Download statement"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteStatement(statement.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete statement"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {statements.length === 0 && (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No statements uploaded</h3>
                <p className="text-slate-500">Upload your first broker statement to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
