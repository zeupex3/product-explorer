"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SORT_FIELDS, SearchQuerySchema, defaultQuery } from "../lib/products";
import type { SearchQuery } from "../lib/products";

type ProductSearchFormProps = {
  onSearch: (query: SearchQuery) => Promise<void>;
};

export default function ProductSearchForm({
  onSearch,
}: ProductSearchFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SearchQuery>({
    resolver: zodResolver(SearchQuerySchema),
    mode: "onChange",
    defaultValues: defaultQuery,
  });

  const getFieldClass = (hasError: boolean) => {
    const baseClass =
      "w-full px-4 py-2 bg-white/[0.04] backdrop-blur-xl border rounded-xl focus:outline-none transition-all duration-200 text-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] text-white";
    const normalClass =
      "border-white/10 hover:border-white/20 focus:border-white/40 focus:bg-white/[0.07]";
    const errorClass =
      "border-red-500/80 focus:border-red-400 bg-red-500/[0.05] shadow-[0_0_15px_rgba(239,68,68,0.25)]";

    return `${baseClass} ${hasError ? errorClass : normalClass}`;
  };

  const labelClass =
    "block text-xs uppercase tracking-wider mb-1.5 text-white/50";

  return (
    <form
      onSubmit={handleSubmit(onSearch)}
      noValidate
      className="flex flex-wrap items-start gap-4 mb-10 w-full relative"
    >
      <div className="flex-1 min-w-[200px]">
        <label htmlFor="q" className={labelClass}>
          คำค้น
        </label>
        <input
          id="q"
          {...register("q")}
          placeholder="พิมพ์ชื่อสินค้า..."
          className={getFieldClass(!!errors.q)}
        />
      </div>

      <div className="w-28 relative">
        <label htmlFor="limit" className={labelClass}>
          จำนวน
        </label>
        <input
          id="limit"
          type="number"
          required
          {...register("limit", { valueAsNumber: true })}
          aria-invalid={!!errors.limit}
          className={getFieldClass(!!errors.limit)}
        />
        <span
          id="limit-error"
          role="alert"
          className="text-xs text-red-400 font-medium mt-1 absolute left-0 top-full whitespace-nowrap"
        >
          {errors.limit?.message}
        </span>
      </div>

      <div className="w-36">
        <label htmlFor="sortBy" className={labelClass}>
          เรียงตาม
        </label>
        <select
          id="sortBy"
          {...register("sortBy")}
          className={getFieldClass(!!errors.sortBy)}
        >
          {SORT_FIELDS.map((field) => (
            <option
              key={field}
              value={field}
              className="bg-[#12131a] text-white"
            >
              {field}
            </option>
          ))}
        </select>
      </div>

      <div className="self-end pb-[2px] mt-auto">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-white text-black font-medium rounded-xl hover:bg-white/90 shadow-[0_4px_20px_rgba(255,255,255,0.2)] transition-all text-sm disabled:opacity-50"
        >
          {isSubmitting ? "กำลังค้นหา..." : "ค้นหา"}
        </button>
      </div>
    </form>
  );
}
