import { Loader2 } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="animate-spin">
        <Loader2 className="w-8 h-8 text-blue-600" />
      </div>
      <p className="mt-4 text-sm text-slate-600">Loading...</p>
    </div>
  );
}
