"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CATEGORIES, ProductDraftSchema } from "../lib/products";
import type { Product, ProductDraft } from "../lib/products";

type ProductFormProps = {
  editing: Product | null;
  onSave: (draft: ProductDraft) => void;
  onCancel: () => void;
};

export default function ProductForm({
  editing,
  onSave,
  onCancel,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductDraft>({
    resolver: zodResolver(ProductDraftSchema),
    // ตรวจสอบตั้งแต่ส่งฟอร์ม และอัปเดตต่อทันทีเมื่อเริ่มแก้ไข
    mode: "onChange",
    defaultValues: editing
      ? {
          title: editing.title,
          price: editing.price,
          stock: editing.stock,
          category: editing.category,
          thumbnail: editing.thumbnail,
        }
      : { title: "", price: undefined, stock: undefined, thumbnail: "" },
  });

  function saveProduct(values: ProductDraft) {
    onSave(values);
    reset();
  }

  // ปรับแต่งขอบและพื้นผิวแก้ว: ขอบแดงสะท้อนแสงเมื่อมี Error
  const getFieldClass = (hasError: boolean) => {
    const baseClass =
      "w-full px-4 py-2.5 bg-white/[0.04] backdrop-blur-xl border rounded-xl focus:outline-none transition-all duration-200 text-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_8px_20px_rgba(0,0,0,0.25)] placeholder:text-white/20 text-white";
    const normalClass =
      "border-white/10 hover:border-white/25 focus:border-white/40 focus:bg-white/[0.07]";
    const errorClass =
      "border-red-500/80 focus:border-red-400 bg-red-500/[0.05] shadow-[0_0_15px_rgba(239,68,68,0.25)]";

    return `${baseClass} ${hasError ? errorClass : normalClass}`;
  };

  const labelClass = "block text-sm mb-1.5 text-white/70";
  // ตัวหนังสือแจ้งเตือนสีแดงสด มองเห็นชัดเจนบนพื้นกระจก
  const errorTextClass =
    "text-xs text-red-400 font-medium mt-1 block min-h-[1.25rem]";

  return (
    <form
      onSubmit={handleSubmit(saveProduct)}
      noValidate
      className="max-w-3xl space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="title" className={labelClass}>
            ชื่อสินค้า
          </label>
          <input
            id="title"
            required
            {...register("title")}
            aria-invalid={!!errors.title}
            className={getFieldClass(!!errors.title)}
          />
          <span className={errorTextClass}>{errors.title?.message}</span>
        </div>

        <div>
          <label htmlFor="category" className={labelClass}>
            หมวดหมู่
          </label>
          <select
            id="category"
            required
            {...register("category")}
            aria-invalid={!!errors.category}
            className={getFieldClass(!!errors.category)}
          >
            <option value="" className="bg-[#12131a] text-white">
              -- เลือกหมวดหมู่ --
            </option>
            {CATEGORIES.map((name) => (
              <option
                key={name}
                value={name}
                className="bg-[#12131a] text-white"
              >
                {name.replace("-", " ")}
              </option>
            ))}
          </select>
          <span className={errorTextClass}>{errors.category?.message}</span>
        </div>

        <div>
          <label htmlFor="price" className={labelClass}>
            ราคา
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            required
            {...register("price", { valueAsNumber: true })}
            aria-invalid={!!errors.price}
            className={getFieldClass(!!errors.price)}
          />
          <span className={errorTextClass}>{errors.price?.message}</span>
        </div>

        <div>
          <label htmlFor="stock" className={labelClass}>
            จำนวนคงเหลือ
          </label>
          <input
            id="stock"
            type="number"
            step="1"
            required
            {...register("stock", { valueAsNumber: true })}
            aria-invalid={!!errors.stock}
            className={getFieldClass(!!errors.stock)}
          />
          <span className={errorTextClass}>{errors.stock?.message}</span>
        </div>
      </div>

      <div>
        <label htmlFor="thumbnail" className={labelClass}>
          URL รูปภาพสินค้า
        </label>
        <input
          id="thumbnail"
          type="url"
          placeholder="https://example.com/image.jpg"
          {...register("thumbnail")}
          className={getFieldClass(!!errors.thumbnail)}
        />
        <span className={errorTextClass}>{errors.thumbnail?.message}</span>
      </div>

      <div className="flex gap-4 pt-4">
        {/* ปลดล็อกปุ่มให้กดส่งได้เสมอเพื่อ trigger error เมื่อกรอกไม่ครบ */}
        <button
          type="submit"
          className="px-6 py-2.5 bg-white text-black font-medium rounded-xl hover:bg-white/90 shadow-[0_4px_20px_rgba(255,255,255,0.2)] transition-all text-sm active:scale-95"
        >
          {editing ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
        </button>

        {editing && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-white transition-all text-sm"
          >
            ยกเลิก
          </button>
        )}
      </div>
    </form>
  );
}
