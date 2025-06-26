export default function Footer() {
  return (
    <div className="text-center mt-12 pb-8">
      <div className="space-y-3">
        <div className="flex items-center justify-center space-x-2 text-slate-400 dark:text-slate-500 text-sm">
          <span>Built with</span>
          <div className="flex space-x-1">
            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-medium">
              Next.js
            </span>
            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-medium">
              React
            </span>
            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-medium">
              Tailwind
            </span>
          </div>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-xs">
          Vimflow - Where elegance meets efficiency
        </p>
      </div>
    </div>
  );
}
