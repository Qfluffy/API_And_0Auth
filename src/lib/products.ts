import { z } from "zod";

export const CATEGORIES = [
  "beauty",
  "fragrances",
  "furniture",
  "groceries",
  "home-decoration",
  "kitchen-accessories",
  "laptops",
  "mens-shirts",
  "mens-shoes",
  "mens-watches",
  "mobile-accessories",
  "motorcycle",
  "skin-care",
  "smartphones",
  "sports-accessories",
  "sunglasses",
  "tablets",
  "tops",
  "vehicle",
  "womens-bags",
  "womens-dresses",
  "womens-jewellery",
  "womens-shoes",
  "womens-watches",
] as const;

export type ProductCategory = (typeof CATEGORIES)[number];

export const ProductDraftSchema = z.object({
  title: z.string().trim().min(1, "กรุณากรอกชื่อสินค้า"),
  price: z.number().min(0, "ราคาต้องไม่ติดลบ"),
  stock: z.number().int("จำนวนคงเหลือต้องเป็นจำนวนเต็ม").min(0, "จำนวนคงเหลือต้องไม่ติดลบ"),
  category: z.enum(CATEGORIES, { message: "กรุณาเลือกหมวดหมู่" }),
});

export type ProductDraft = z.infer<typeof ProductDraftSchema>;

export type Product = {
  id: string;
  name: string;
  title: string;
  price: number;
  description: string;
  thumbnail?: string;
  stock: number;
  category: ProductCategory;
};

export type ProductList = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

export type SearchQuery = {
  q?: string;
  category?: string;
};

// ตัวแปร In-Memory สำหรับพักสินค้าที่เพิ่มใหม่ (ประกาศเพียงที่เดียว)
declare global {
  // eslint-disable-next-line no-var
  var demoProducts: Product[] | undefined;
}

const customProducts: Product[] = globalThis.demoProducts ?? [];

if (process.env.NODE_ENV !== "production") {
  globalThis.demoProducts = customProducts;
}

// ฟังก์ชันสำหรับเพิ่มสินค้าใหม่
export function addProduct(newProduct: Product) {
  customProducts.unshift(newProduct);
}

const API_BASE = "https://dummyjson.com";

// ฟังก์ชันดึงสินค้าจาก API รวมกับสินค้าในหน่วยความจำ
export async function getProducts(query?: string): Promise<Product[]> {
  const q = query?.trim() ?? "";
  const params = new URLSearchParams();
  params.set("limit", "12");
  params.set("select", "id,title,price,stock,category,thumbnail,description");

  let apiProducts: Product[] = [];
  try {
    const endpoint = q
      ? `${API_BASE}/products/search?q=${encodeURIComponent(q)}&${params.toString()}`
      : `${API_BASE}/products?${params.toString()}`;

    const response = await fetch(endpoint, { cache: "no-store" });
    if (response.ok) {
      const data = await response.json();
      apiProducts = (data.products || []).map((item: any) => ({
        id: String(item.id),
        name: item.title,
        title: item.title,
        price: Number(item.price),
        description: item.description || `หมวดหมู่: ${item.category}`,
        thumbnail: item.thumbnail,
        stock: Number(item.stock),
        category: (item.category as ProductCategory) || "smartphones",
      }));
    }
  } catch (err) {
    console.error("Fetch API error:", err);
  }

  // กรองสินค้าที่ผู้ใช้เพิ่มเองใน Memory
  let filteredCustom = [...customProducts];
  if (q) {
    const lower = q.toLowerCase();
    filteredCustom = filteredCustom.filter(
      (p) =>
        p.title.toLowerCase().includes(lower) ||
        p.name.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower)
    );
  }

  return [...filteredCustom, ...apiProducts];
}

export function getProduct(id: string): Product | undefined {
  return customProducts.find((p) => String(p.id) === String(id));
}

export function updateProduct(
  id: string,
  values: Partial<Omit<Product, "id">>
) {
  const product = getProduct(id);
  if (!product) return;
  if (values.name !== undefined) product.name = values.name;
  if (values.title !== undefined) product.title = values.title;
  if (values.price !== undefined) product.price = values.price;
  if (values.description !== undefined) product.description = values.description;
  if (values.thumbnail !== undefined) product.thumbnail = values.thumbnail;
  if (values.stock !== undefined) product.stock = values.stock;
  if (values.category !== undefined) product.category = values.category;
}

export function deleteProduct(id: string) {
  const index = customProducts.findIndex((p) => String(p.id) === String(id));
  if (index !== -1) {
    customProducts.splice(index, 1);
  }
}