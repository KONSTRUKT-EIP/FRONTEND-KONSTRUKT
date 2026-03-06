import React, { useState } from "react";
import { Order } from "./OrderRow";
import { Field } from "../../Tools/Input/Input";

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (_payload: Omit<Order, "id">) => void;
}

const emptyForm = {
  productName: "",
  productIcon: "",
  price: "",
  totalOrder: "",
  total: "",
};

export default function CreateOrderModal({ isOpen, onClose, onSubmit }: CreateOrderModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  if (!isOpen)
    return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit({
      productName: form.productName,
      productIcon: form.productIcon || undefined,
      price: Number(form.price),
      totalOrder: Number(form.totalOrder),
      total: Number(form.total),
    });
    setForm(emptyForm);
    setLoading(false);
    onClose();
  };

  return (
    <>
      {/* BackGround */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-7">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Créer une commande</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
            >
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field label="Nom du produit" name="productName" value={form.productName} onChange={handleChange} required />
            <Field label="Icône produit (URL)" name="productIcon" value={form.productIcon} onChange={handleChange} />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Prix (€)" name="price" type="number" value={form.price} onChange={handleChange} required />
              <Field label="Total Order" name="totalOrder" type="number" value={form.totalOrder} onChange={handleChange} required />
            </div>
            <Field label="Total (€)" name="total" type="number" value={form.total} onChange={handleChange} required />

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xl text-gray-500 hover:text-gray-700 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xl font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? "Envoi..." : "Créer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
