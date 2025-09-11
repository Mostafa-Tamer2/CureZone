import { Loader2 } from "lucide-react";
import React from "react";

export default function ProductsLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-10 min-h-80 gap-4 bg-gray-100 w-full mt-10">
      <div className="space-x-2 flex items-center text-blue-700">
        <Loader2 className="w-5 h-6 animate-spin" />
        <span>Products are loading...</span>
      </div>
    </div>
  );
}
