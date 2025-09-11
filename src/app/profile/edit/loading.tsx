export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        {/* Clean branding */}
        <h1 className="text-4xl font-bold text-gray-700 mb-2">CureZone</h1>

        {/* Simple loading dots */}
        <div className="flex justify-center space-x-2 mb-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>

        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    </div>
  );
}
