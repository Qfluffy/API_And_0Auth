import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getProduct } from "@/lib/products";
import { deleteProductAction } from "@/app/actions";

type DeleteProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DeleteProductPage({ params }: DeleteProductPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const { id } = await params;
  const product = getProduct(id);

  if (!product) {
    notFound();
  }

  const deleteAction = deleteProductAction.bind(null, product.id);

  return (
    <main className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-900/50 rounded-2xl p-6 sm:p-8 shadow-sm text-center">
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center mb-4">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>

        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">ยืนยันการลบสินค้า</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          คุณแน่ใจหรือไม่ว่าต้องการลบรายการ “<span className="font-semibold text-zinc-800 dark:text-zinc-200">{product.name}</span>” ออกจากระบบ?
        </p>

        <div className="mt-6 flex flex-col gap-2.5">
          <form action={deleteAction}>
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium text-sm transition cursor-pointer shadow-sm"
            >
              ยืนยันการลบ
            </button>
          </form>
          <Link
            href="/"
            className="py-2.5 px-4 rounded-lg border border-zinc-300 dark:border-zinc-700 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
          >
            ยกเลิก
          </Link>
        </div>
      </div>
    </main>
  );
}