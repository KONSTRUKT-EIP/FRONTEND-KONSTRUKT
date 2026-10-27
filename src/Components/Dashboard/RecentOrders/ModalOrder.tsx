import React, { useState } from "react";
import { Field } from "../../Tools/Input/Input";

export type CreateOrderPayload = {
  siteId: string;
  productName: string;
  productIcon?: string;
  price: number;
  totalOrder: number;
  total: number;
};

interface CreateOrderModalProps {
  isOpen: boolean;
  siteId: string;
  onClose: () => void;
  onSubmit: (payload: CreateOrderPayload) => Promise<void>;
}

const emptyForm = {
  productName: "",
  productIcon: "",
  price: "",
  totalOrder: "",
};

export default function CreateOrderModal({ isOpen, siteId,onClose, onSubmit }: CreateOrderModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen)
    return null;

  const total = Number(form.price) * Number(form.totalOrder);
  const formattedTotal = Number.isFinite(total)
    ? total.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })
    : "—";

  const handleClose = () => {
    setForm(emptyForm);
    setError(null);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!siteId) {
    setError("Chantier introuvable, recharge la page.");
    return;
  }

  const payload = {
    siteId,
    productName: form.productName.trim(),
    productIcon: form.productIcon || undefined,
    price: Number(form.price),
    totalOrder: Number(form.totalOrder),
    total,
  };

  if (!Number.isInteger(payload.totalOrder) || payload.totalOrder < 1) {
    setError("La quantité doit être un nombre entier d'au moins 1.");
    return;
  }

  setLoading(true);
  setError(null);
  try {
    await onSubmit(payload);
    handleClose();
  } catch (err) {
    // La modale reste ouverte pour que l'utilisateur puisse corriger sans tout ressaisir
    setError(err instanceof Error ? err.message : "Impossible de créer la commande.");
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      {/* BackGround */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-7">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Créer une commande</h2>
            <button
              onClick={handleClose}
              aria-label="Fermer"
              className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field label="Nom du produit" name="productName" value={form.productName} onChange={handleChange} required />
            <Field label="Icône produit (URL)" name="productIcon" value={form.productIcon} onChange={handleChange} />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Prix unitaire (€)" name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required />
              <Field label="Quantité" name="totalOrder" type="number" min={1} step={1} value={form.totalOrder} onChange={handleChange} required />
            </div>
            <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
              <span className="text-sm font-medium text-gray-600">Total</span>
              <span className="text-lg font-bold text-gray-900">{formattedTotal}</span>
            </div>

            {error && (
              <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </p>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={handleClose}
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
