"use server";

import { auth } from "@/auth";
import { deleteProduct, updateProduct, addProduct } from "@/lib/products"; // ✅ นำเข้า addProduct
import type { Product, ProductCategory } from "@/lib/products";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function createProductAction(data: {
  title: string;
  price: number;
  stock: number;
  category: ProductCategory;
}) {
  await requireUser();

  const newProduct: Product = {
    id: `p${Date.now()}`,
    name: data.title,
    title: data.title,
    price: data.price,
    stock: data.stock,
    category: data.category,
    description: `หมวดหมู่: ${data.category} (คงเหลือ ${data.stock} ชิ้น)`,
  };

  // ✅ เรียกใช้ addProduct แทนการ unshift ตรงๆ
  addProduct(newProduct);

  revalidatePath("/");
  return { success: true };
}

export async function updateProductAction(id: string, formData: FormData) {
  await requireUser();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = Number(formData.get("price"));

  if (!name || !description) {
    throw new Error("กรุณากรอกข้อมูลให้ครบ");
  }
  if (!Number.isFinite(price) || price < 0) {
    throw new Error("ราคาไม่ถูกต้อง");
  }

  updateProduct(id, { name, description, price });
  revalidatePath("/");
  redirect("/");
}

export async function deleteProductAction(id: string) {
  await requireUser();
  deleteProduct(id);
  revalidatePath("/");
  redirect("/");
}