"use client";
import { useState } from "react";

export default function ProductSelect({ products, onAdd }) {
  const [selectedId, setSelectedId] = useState(products[0].id);

  const handleAdd = () => {
    const product = products.find((p) => p.id === Number(selectedId));
    if (product) onAdd(product);
  };

  return (
    <div className="flex gap-2">
      <select
        className="border p-2 rounded"
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
      >
        {products.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleAdd}
      >
        Додати
      </button>
    </div>
  );
}
