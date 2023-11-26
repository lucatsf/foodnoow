import {cartProductPrice} from "@/components/AppContext";
import Trash from "@/components/icons/Trash";
import { formatFromMoney } from "@/libs/formatInput";
import Image from "next/image";

export default function CartProduct({indexProduct,product,onRemove}) {
  return (
    <div className="flex items-center gap-4 border-b py-4" key={indexProduct}>
      <div className="w-24">
        <Image width={240} height={240} src={product?.image || '/not-image.png'} alt={product?.name} />
      </div>
      <div className="grow">
        <h3 className="font-semibold">
          {product?.name}
        </h3>
        {product?.size && (
          <div className="text-sm">
            Tamanho: <span>{product?.size?.name}</span>
          </div>
        )}
        {product?.extras?.length > 0 && (
          <div className="text-sm text-gray-500">
            {product?.extras.map(extra => (
              <div key={extra?.name}>{extra?.name} {formatFromMoney(extra?.price)}</div>
            ))}
          </div>
        )}
        {product?.flavorsPrices?.length > 0 && (
          <div className="text-sm text-gray-500">
            {product?.flavorsPrices.map(flavor => (
              <div key={flavor?.name}>{flavor?.name} {formatFromMoney(flavor?.price)}</div>
            ))}
          </div>
        )}
      </div>
      <div className="text-lg font-semibold">
        {formatFromMoney(cartProductPrice(product))}
      </div>
      {!!onRemove && (
        <div className="ml-2">
          <button
            type="button"
            onClick={() => onRemove(indexProduct)}
            className="p-2">
            <Trash />
          </button>
        </div>
      )}
    </div>
  );
}