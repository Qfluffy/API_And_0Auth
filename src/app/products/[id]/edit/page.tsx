import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getProduct } from "@/lib/products";
import { updateProductAction } from "@/app/actions";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const { id } = await params;
  const product = getProduct(id);

  if (!product) {
    notFound();
  }

  const updateAction = updateProductAction.bind(null, product.id);

  return (
    <main className="max-w-xl mx-auto px-4 py-12">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
          แก้ไขสินค้า
        </h1>

        <form action={updateAction} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-xs font-semibold mb-1.5 text-zinc-700 dark:text-zinc-300">
              ชื่อสินค้า
            </label>
            <input
              id="name"
              name="name"
              defaultValue={product.name}
              required
              className="w-full px-3.5 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-xs font-semibold mb-1.5 text-zinc-700 dark:text-zinc-300">
              ราคา (บาท)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              defaultValue={product.price}
              required
              className="w-full px-3.5 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-xs font-semibold mb-1.5 text-zinc-700 dark:text-zinc-300">
              รายละเอียด
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={product.description}
              required
              className="w-full px-3.5 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-3 flex items-center gap-3">
            <button
              type="submit"
              className="flex-1 py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition cursor-pointer shadow-sm"
            >
              บันทึกการแก้ไข
            </button>
            <Link
              href="/"
              className="py-2 px-4 rounded-lg border border-zinc-300 dark:border-zinc-700 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
            >
              ยกเลิก
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}