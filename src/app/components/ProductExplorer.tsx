"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { defaultQuery, fetchProducts } from "../../lib/products";
import type { Product, ProductDraft, ProductList, SearchQuery } from "../../lib/products";
import ProductSearchForm from "./ProductSearchForm";
import ProductForm from "./ProductForm";

type LoadState = "loading" | "error" | "ready";

export default function ProductExplorer() {
  const [products, setProducts] = useState<Product[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [status, setStatus] = useState<LoadState>("loading");

  useEffect(() => {
    loadProducts(defaultQuery);
  }, []);

  function showResult(list: ProductList) {
    setProducts(list.products);
    setStatus("ready");
  }

  function showError(error: unknown) {
    setErrorMessage(
      error instanceof Error ? error.message : "เรียกข้อมูลไม่สำเร็จ"
    );
    setStatus("error");
  }

  async function loadProducts(query: SearchQuery) {
    setStatus("loading");
    setErrorMessage("");
    try {
      showResult(await fetchProducts(query));
    } catch (error) {
      showError(error);
    }
  }

  function saveProduct(draft: ProductDraft) {
    const newProduct: Product = {
      ...draft,
      id: `p${Date.now()}`,
      name: draft.title,
      description: `หมวดหมู่: ${draft.category} (คงเหลือ ${draft.stock} ชิ้น)`,
    };
    setProducts((prev) => [newProduct, ...prev]);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2 space-y-6">
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
          <ProductSearchForm onSearch={loadProducts} />
        </div>

        <section aria-live="polite" className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              ผลลัพธ์ทั้งหมด: {products.length} รายการ
            </span>
            <button
              type="button"
              onClick={() => loadProducts(defaultQuery)}
              disabled={status === "loading"}
              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition disabled:opacity-50 cursor-pointer"
            >
              {status === "loading" ? "กำลังโหลด..." : "รีเซ็ตข้อมูลเริ่มต้น"}
            </button>
          </div>

          {status === "loading" && (
            <div className="p-12 text-center text-zinc-500 animate-pulse">
              กำลังดาวน์โหลดข้อมูลสินค้าจาก API...
            </div>
          )}

          {status === "error" && (
            <div role="alert" className="m-4 p-4 text-sm text-red-700 bg-red-50 dark:bg-red-950/40 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-900">
              {errorMessage}
            </div>
          )}

          {status === "ready" && products.length === 0 && (
            <div className="p-12 text-center text-zinc-500">
              ไม่พบสินค้าที่ตรงกับเงื่อนไขการค้นหา
            </div>
          )}

          {status === "ready" && products.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-300 font-semibold border-b border-zinc-200 dark:border-zinc-800">
                  <tr>
                    <th className="py-3.5 px-4">รูปภาพ</th>
                    <th className="py-3.5 px-4">ชื่อสินค้า</th>
                    <th className="py-3.5 px-4 text-right">ราคา ($)</th>
                    <th className="py-3.5 px-4 text-center">คงเหลือ</th>
                    <th className="py-3.5 px-4">หมวดหมู่</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {products.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 transition">
                      <td className="py-3 px-4">
                        {item.thumbnail ? (
                          <Image
                            src={item.thumbnail}
                            alt={item.title}
                            width={48}
                            height={48}
                            className="rounded-lg object-cover bg-zinc-100 dark:bg-zinc-800"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-[10px] text-zinc-400">
                            ไม่มีรูป
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium text-zinc-900 dark:text-zinc-100">
                        {item.title}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                        ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${item.stock < 10 ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"}`}>
                          {item.stock}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-full border border-indigo-100 dark:border-indigo-900">
                          {item.category}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 sticky top-6">
        <h2 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
          เพิ่มสินค้าใหม่
        </h2>
        <ProductForm onSave={saveProduct} />
      </div>
    </div>
  );
}