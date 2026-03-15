interface Props {
  online: boolean;
}

export function StatusIndicator({ online }: Props) {
  return (
    <div 
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border-2 transition-all ${
        online 
          ? "bg-green-50 border-green-200 text-green-700" 
          : "bg-red-50 border-red-200 text-red-700"
      }`}
    >
      {/* Indicator Dot */}
      <span className="relative flex h-2 w-2">
        {online && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        )}
        <span 
          className={`relative inline-flex rounded-full h-2 w-2 ${
            online ? "bg-green-600" : "bg-red-600"
          }`} 
        />
      </span>

      {/* Status Label */}
      <span className="text-[10px] font-black uppercase tracking-widest leading-none">
        {online ? "System Live" : "System Offline"}
      </span>
    </div>
  );
}