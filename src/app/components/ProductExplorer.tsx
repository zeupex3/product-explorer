"use client";

import ProductSearchForm from "./ProductSearchForm";
import { useState, useEffect } from "react";
import { defaultQuery, fetchProducts } from "../lib/products";
import type {
  Product,
  ProductDraft,
  ProductList,
  SearchQuery,
} from "../lib/products";
import ProductForm from "./ProductForm";

type LoadState = "idle" | "loading" | "error" | "ready";

export default function ProductExplorer() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<LoadState>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  function showResult(list: ProductList) {
    setProducts(list.products);
    setStatus("ready");
  }

  function showError(error: unknown) {
    setErrorMessage(
      error instanceof Error ? error.message : "เรียกข้อมูลไม่สำเร็จ",
    );
    setStatus("error");
  }

  useEffect(() => {
    fetchProducts(defaultQuery).then(showResult).catch(showError);
  }, []);

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
    setProducts([...products, { ...draft, id: Date.now() }]);
    setStatus("ready");
  }

  return (
    <main className="max-w-5xl mx-auto p-6 md:p-12 font-sans relative z-10">
      <header className="mb-12 flex justify-between items-end border-b border-white/10 pb-6">
        <h1 className="text-3xl font-bold tracking-wide text-white">
          รายการสินค้า
        </h1>
        <button
          type="button"
          onClick={() => loadProducts(defaultQuery)}
          disabled={status === "loading"}
          className="text-sm px-4 py-2 bg-white/5 border border-white/15 rounded-xl hover:bg-white/10 text-white backdrop-blur-md transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
        >
          {status === "loading" ? "กำลังโหลด..." : "โหลดข้อมูลใหม่"}
        </button>
      </header>

      <ProductSearchForm onSearch={loadProducts} />

      <section aria-live="polite" className="mb-16">
        {status === "loading" && (
          <p className="text-white/40 animate-pulse">กำลังโหลดข้อมูล...</p>
        )}
        {status === "error" && (
          <p role="alert" className="text-red-400 font-medium">
            {errorMessage}
          </p>
        )}
        {status === "ready" && products.length === 0 && (
          <p className="text-white/40">ไม่พบสินค้าที่ตรงกับเงื่อนไข</p>
        )}

        {status === "ready" && products.length > 0 && (
          <div className="w-full overflow-x-auto rounded-2xl border border-white/15 bg-white/[0.03] backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)]">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="border-b border-white/10 bg-white/[0.02]">
                <tr>
                  <th className="p-4 font-normal text-white/50 tracking-wider text-xs uppercase">
                    รูปสินค้า
                  </th>
                  <th className="p-4 font-normal text-white/50 tracking-wider text-xs uppercase">
                    ชื่อสินค้า
                  </th>
                  <th className="p-4 font-normal text-white/50 tracking-wider text-xs uppercase">
                    ราคา
                  </th>
                  <th className="p-4 font-normal text-white/50 tracking-wider text-xs uppercase">
                    คงเหลือ
                  </th>
                  <th className="p-4 font-normal text-white/50 tracking-wider text-xs uppercase">
                    หมวดหมู่
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-white/[0.04] transition-colors duration-150"
                  >
                    <td className="p-4">
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-12 h-12 object-cover rounded-lg border border-white/15 shadow-sm"
                        />
                      ) : (
                        <span className="text-xs text-white/30">ไม่มีรูป</span>
                      )}
                    </td>
                    <td className="p-4 text-white/90 font-medium">
                      {item.title}
                    </td>
                    <td className="p-4 text-white/80">${item.price}</td>
                    <td className="p-4 text-white/60">{item.stock}</td>
                    <td className="p-4 capitalize text-white/60">
                      {item.category.replace("-", " ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="pt-8 border-t border-white/10">
        <h2 className="text-xl font-bold mb-6 text-white">เพิ่มสินค้าใหม่</h2>
        <ProductForm editing={null} onSave={saveProduct} onCancel={() => {}} />
      </div>
    </main>
  );
}
