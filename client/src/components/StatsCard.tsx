export default function StatsCard() {
  const stats = [
    { value: "$0.00849", label: "ESTIMATED PRICE", color: "text-yellow-400" },
    { value: "+6.3%", label: "24H CHANGE", color: "text-green-400" },
    { value: "$365K", label: "24H VOLUME", color: "text-blue-400" },
    { value: "1,247", label: "HOLDERS", color: "text-purple-400" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-6xl mx-auto p-4">
      {stats.map((item, i) => (
        <div
          key={i}
          className="flex flex-col items-center justify-center bg-black/80 rounded-2xl shadow-md p-6 text-center min-w-0"
        >
          <span className={`text-xl sm:text-2xl font-bold ${item.color} break-words`}>
            {item.value}
          </span>
          <span className="text-xs sm:text-sm text-gray-300 mt-1 break-words">{item.label}</span>
        </div>
      ))}
    </div>
  );
}