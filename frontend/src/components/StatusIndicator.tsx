interface Props {
  online: boolean;
}

export function StatusIndicator({ online }: Props) {
  return (
    <span className="flex items-center gap-1.5 text-xs">
      <span
        className={`w-2 h-2 rounded-full ${
          online ? "bg-green-400 animate-pulse" : "bg-red-400"
        }`}
      />
      <span className={online ? "text-green-400" : "text-red-400"}>
        {online ? "online" : "offline"}
      </span>
    </span>
  );
}