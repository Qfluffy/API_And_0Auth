"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CATEGORIES, ProductDraftSchema } from "../../lib/products";
import type { ProductDraft, Product } from "../../lib/products";
import { createProductAction } from "@/app/actions";
import { useState } from "react";

interface ProductFormProps {
  editing?: Product | null;
  onSave?: (draft: ProductDraft) => void;
  onCancel?: () => void;
}

export default function ProductForm({ onSave }: ProductFormProps) {
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ProductDraft>({
    resolver: zodResolver(ProductDraftSchema),
    mode: "onTouched",
    defaultValues: {
      title: "",
      price: 0,
      stock: 0,
    },
  });

  const onSubmit: SubmitHandler<ProductDraft> = async (values) => {
    setServerError("");
    try {
      await createProductAction(values);
      if (onSave) {
        onSave(values);
      }
      reset();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการบันทึก");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {serverError && (
        <div className="p-3 text-xs text-red-600 bg-red-50 dark:bg-red-950/40 rounded-lg border border-red-200">
          {serverError}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-xs font-semibold mb-1 text-zinc-600 dark:text-zinc-300">
          ชื่อสินค้า
        </label>
        <input
          id="title"
          {...register("title")}
          placeholder="เช่น Gaming Mouse"
          className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.title && <span className="text-xs text-red-500 mt-1 block">{errors.title.message}</span>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="price" className="block text-xs font-semibold mb-1 text-zinc-600 dark:text-zinc-300">
            ราคา (บาท)
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("price", { valueAsNumber: true })}
            className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.price && <span className="text-xs text-red-500 mt-1 block">{errors.price.message}</span>}
        </div>

        <div>
          <label htmlFor="stock" className="block text-xs font-semibold mb-1 text-zinc-600 dark:text-zinc-300">
            คงเหลือ
          </label>
          <input
            id="stock"
            type="number"
            step="1"
            placeholder="0"
            {...register("stock", { valueAsNumber: true })}
            className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.stock && <span className="text-xs text-red-500 mt-1 block">{errors.stock.message}</span>}
        </div>
      </div>

      <div>
        <label htmlFor="category" className="block text-xs font-semibold mb-1 text-zinc-600 dark:text-zinc-300">
          หมวดหมู่
        </label>
        <select
          id="category"
          {...register("category")}
          className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">กรุณาเลือกหมวดหมู่</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {errors.category && <span className="text-xs text-red-500 mt-1 block">{errors.category.message}</span>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !isValid}
        className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition disabled:opacity-50 cursor-pointer shadow-sm"
      >
        {isSubmitting ? "กำลังบันทึก..." : "+ เพิ่มสินค้าใหม่"}
      </button>
    </form>
  );
}