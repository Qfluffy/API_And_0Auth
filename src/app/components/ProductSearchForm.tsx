"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import type { SearchQuery } from "../../lib/products";

interface ProductSearchFormProps {
  onSearch?: (query: SearchQuery) => Promise<void> | void;
}

export default function ProductSearchForm({ onSearch }: ProductSearchFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") ?? "");
  const [isPending, startTransition] = useTransition();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const queryText = searchTerm.trim();

    startTransition(async () => {
      // 1. ถ้ามี onSearch ส่งเข้ามา ให้เรียกใช้งาน
      if (onSearch) {
        await onSearch({ q: queryText });
      }

      // 2. สั่งเปลี่ยน URL เพื่อให้ Server Component (page.tsx) กรองข้อมูลใหม่
      if (queryText) {
        router.push(`/?q=${encodeURIComponent(queryText)}`);
      } else {
        router.push("/");
      }
    });
  }

  function handleReset() {
    setSearchTerm("");
    startTransition(async () => {
      if (onSearch) {
        await onSearch({ q: "" });
      }
      router.push("/");
    });
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
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600 cursor-pointer"
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