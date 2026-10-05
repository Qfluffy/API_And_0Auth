"use client";

import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import type { SearchQuery } from "../../lib/products";

interface ProductSearchFormProps {
  onSearch?: (query: SearchQuery) => Promise<void> | void;
}

export default function ProductSearchForm({ onSearch }: ProductSearchFormProps) {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") ?? "");
  const [isPending, startTransition] = useTransition();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      if (onSearch) {
        await onSearch({ q: searchTerm.trim() });
      }
    });
  }

  function handleReset() {
    setSearchTerm("");
    if (onSearch) {
      onSearch({ q: "" });
    }
  }

  return (
    <form onSubmit={handleSearch} className="flex gap-2 items-center">
      <div className="relative flex-1">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="ค้นหาชื่อสินค้าหรือคำอธิบาย..."
          className="w-full px-4 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleReset}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600"
          >
            ล้าง
          </button>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="px-5 py-2 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition disabled:opacity-50 cursor-pointer shadow-sm"
      >
        {isPending ? "กำลังค้นหา..." : "ค้นหา"}
      </button>
    </form>
  );
}