import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { getProducts } from "@/lib/products";
import { AuthButtons } from "./auth-buttons";
import ProductSearchForm from "./components/ProductSearchForm";
import ProductForm from "./components/ProductForm";

type HomePageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const { q } = await searchParams;
  const session = await auth();
  
  // เรียกข้อมูลสินค้าที่ดึงจาก DummyJSON API และ In-memory
  const products = await getProducts(q);
  const isLoggedIn = Boolean(session?.user);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* ส่วนหัว Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            ระบบจัดการสินค้า (Product Catalog)
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            ดึงข้อมูลสินค้าจริงจาก API ภายนอก พร้อมระบบล็อกอิน Google OAuth
          </p>
        </div>
        <AuthButtons isLoggedIn={isLoggedIn} userName={session?.user?.name} />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* คอลัมน์ซ้าย: กล่องค้นหา และรายการสินค้าจาก API */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <ProductSearchForm />
          </div>

          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
                รายการสินค้า {q && <span className="text-sm font-normal text-zinc-500">(ผลการค้นหา "{q}")</span>}
              </h2>
              <span className="text-xs text-zinc-500 font-medium">
                พบ {products.length} รายการ
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="flex flex-col justify-between p-5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition"
                >
                  <div>
                    {product.thumbnail && (
                      <div className="relative w-full h-44 mb-3 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                        <Image
                          src={product.thumbnail}
                          alt={product.name ?? product.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-medium uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded">
                        {product.category}
                      </span>
                      <span className="text-xs text-zinc-400">คงเหลือ {product.stock}</span>
                    </div>
                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100">
                      {product.name ?? product.title}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                      ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>

                    {/* แสดงปุ่มแก้ไข/ลบ เฉพาะเมื่อเข้าสู่ระบบแล้ว */}
                    {isLoggedIn && (
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/products/${product.id}/edit`}
                          className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition"
                        >
                          แก้ไข
                        </Link>
                        <Link
                          href={`/products/${product.id}/delete`}
                          className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 hover:bg-red-100 transition"
                        >
                          ลบ
                        </Link>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {products.length === 0 && (
              <div className="p-12 text-center text-zinc-500 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                ไม่พบสินค้าที่ตรงกับการค้นหา
              </div>
            )}
          </section>
        </div>

        {/* คอลัมน์ขวา: ฟอร์มเพิ่มสินค้า (แสดงเฉพาะผู้ใช้ที่เข้าสู่ระบบแล้ว) */}
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm sticky top-6">
          {isLoggedIn ? (
            <>
              <h2 className="text-lg font-bold mb-4 text-zinc-900 dark:text-zinc-100">
                เพิ่มสินค้าใหม่
              </h2>
              <ProductForm />
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-3 text-zinc-400">
                🔒
              </div>
              <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                เข้าสู่ระบบเพื่อจัดการสินค้า
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                กรุณาเข้าสู่ระบบด้วย Google เพื่อเพิ่ม แก้ไข หรือลบรายการสินค้า
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}