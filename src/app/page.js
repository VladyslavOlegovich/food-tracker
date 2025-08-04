"use client";
import { useState, useEffect } from "react";
// import ProductSelect from "@/components/ProductSelect";
import { products } from "./data/products";
import ProductSelect from "./components/ProductSelect";
ProductSelect;
export default function Home() {
  const [meal, setMeal] = useState([]);
  const [summary, setSummary] = useState(null);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customProduct, setCustomProduct] = useState({
    name: "",
    calories: "",
    protein: "",
    fat: "",
    carbs: "",
  });

  // Завантажуємо історію з LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("meal");
    if (saved) setMeal(JSON.parse(saved));
  }, []);

  // Зберігаємо історію в LocalStorage
  useEffect(() => {
    localStorage.setItem("meal", JSON.stringify(meal));
  }, [meal]);

  const addProduct = (product) => {
    setMeal((prev) => [...prev, product]);
  };

  const calculateMeal = () => {
    const total = meal.reduce(
      (acc, p) => ({
        calories: acc.calories + p.calories,
        protein: acc.protein + p.protein,
        fat: acc.fat + p.fat,
        carbs: acc.carbs + p.carbs,
      }),
      { calories: 0, protein: 0, fat: 0, carbs: 0 }
    );

    // Округлення до двох знаків після коми
    const roundedTotal = {
      calories: Number(total.calories.toFixed(2)),
      protein: Number(total.protein.toFixed(2)),
      fat: Number(total.fat.toFixed(2)),
      carbs: Number(total.carbs.toFixed(2)),
    };

    setSummary(roundedTotal);
  };

  const clearMeal = () => {
    setMeal([]);
    setSummary(null);
    localStorage.removeItem("meal");
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();

    const product = {
      id: Date.now(),
      name: customProduct.name || "Мій продукт",
      calories: Number(customProduct.calories) || 0,
      protein: Number(customProduct.protein) || 0,
      fat: Number(customProduct.fat) || 0,
      carbs: Number(customProduct.carbs) || 0,
    };

    addProduct(product);
    setCustomProduct({
      name: "",
      calories: "",
      protein: "",
      fat: "",
      carbs: "",
    });
    setShowCustomForm(false);
  };

  return (
    <main className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">🍽 Мій прийом їжі</h1>

      <ProductSelect products={products} onAdd={addProduct} />

      <button
        className="bg-purple-500 text-white px-4 py-2 rounded"
        onClick={() => setShowCustomForm(!showCustomForm)}
      >
        {showCustomForm ? "Скасувати" : "➕ Додати свій продукт"}
      </button>

      {showCustomForm && (
        <form
          onSubmit={handleCustomSubmit}
          className="space-y-2 border p-3 rounded bg-gray-50"
        >
          <input
            type="text"
            placeholder="Назва продукту"
            className="w-full border p-2 rounded"
            value={customProduct.name}
            onChange={(e) =>
              setCustomProduct({ ...customProduct, name: e.target.value })
            }
          />
          <div className="grid grid-cols-4 gap-2">
            <input
              type="number"
              placeholder="Ккал"
              className="border p-2 rounded"
              value={customProduct.calories}
              onChange={(e) =>
                setCustomProduct({ ...customProduct, calories: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Б"
              className="border p-2 rounded"
              value={customProduct.protein}
              onChange={(e) =>
                setCustomProduct({ ...customProduct, protein: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Ж"
              className="border p-2 rounded"
              value={customProduct.fat}
              onChange={(e) =>
                setCustomProduct({ ...customProduct, fat: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="В"
              className="border p-2 rounded"
              value={customProduct.carbs}
              onChange={(e) =>
                setCustomProduct({ ...customProduct, carbs: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded w-full"
          >
            Додати продукт
          </button>
        </form>
      )}

      <ul className="border rounded p-2">
        {meal.map((item, index) => (
          <li key={index} className="flex justify-between border-b py-1">
            <span>{item.name}</span>
            <span>{item.calories} ккал</span>
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={calculateMeal}
        >
          Сформувати прийом
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={clearMeal}
        >
          Очистити
        </button>
      </div>

      {summary && (
        // <div className="border p-3 rounded bg-gray-100">
        //   <h2 className="font-bold mb-2">Разом:</h2>
        //   <p>Ккал: {summary.calories}</p>
        //   <p>Б: {summary.protein} г</p>
        //   <p>Ж: {summary.fat} г</p>
        //   <p>В: {summary.carbs} г</p>
        // </div>
        <div className="border p-3 rounded bg-gray-100 relative">
          <h2 className="font-bold mb-2">Разом:</h2>
          <p>Ккал: {summary.calories}</p>
          <p>Б: {summary.protein} г</p>
          <p>Ж: {summary.fat} г</p>
          <p>В: {summary.carbs} г</p>

          <button
            className="mt-3 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            onClick={() => {
              const textToCopy = `
Ккал: ${summary.calories}
Б: ${summary.protein} г
Ж: ${summary.fat} г
В: ${summary.carbs} г`;
              navigator.clipboard
                .writeText(textToCopy)
                .then(() => alert("✅ Скопійовано в буфер обміну!"))
                .catch(() => alert("❌ Не вдалося скопіювати"));
            }}
          >
            Скопіювати
          </button>
        </div>
      )}
    </main>
  );
}
