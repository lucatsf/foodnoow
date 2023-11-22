import { formatFromMoney } from "@/libs/formatInput";

export default function AddToCartButton({
  onClick, basePrice
}) {
  const textButton = basePrice ? `Adicionar ${formatFromMoney(basePrice)}` : 'Adicionar';
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-4 bg-primary text-white rounded-full px-8 py-2"
    >
      <span>{textButton}</span>
    </button>
  );
}