'use client';
import {CartContext, cartProductPrice} from "@/components/AppContext";
import MethodPayment from "@/components/cart/MethodPayment";
import AddressInputs from "@/components/layout/AddressInputs";
import SectionHeaders from "@/components/layout/SectionHeaders";
import CartProduct from "@/components/menu/CartProduct";
import {useProfile} from "@/components/UseProfile";
import { formatFromMoney } from "@/libs/formatInput";
import { useRouter } from "next/navigation";
import {useContext, useEffect, useState} from "react";
import toast from "react-hot-toast";

export default function CartPage() {
  const {cartProducts,removeCartProduct, clearCart} = useContext(CartContext);
  const [address, setAddress] = useState({});
  const [disabled, setDisabled] = useState(true);
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [deliveryDefault, setDeliveryDefault] = useState(0);
  const [deliveryDetails, setDeliveryDetails] = useState({
    delivery: 'delivery',
    paymentMethod: 'card',
    changeFor: '',
  });

  const {data:profileData} = useProfile();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.location.href.includes('canceled=1')) {
        toast.error('Payment failed 😔');
      }
    }
  }, []);

  useEffect(() => {
    if (profileData?.streetAddress) {
      const {phone, streetAddress, neighborhood, number, complement, city} = profileData;
      const addressFromProfile = {
        phone,
        streetAddress,
        neighborhood,
        number,
        complement,
        city
      };
      setAddress(addressFromProfile);
      if (phone && streetAddress && neighborhood && number && complement && city) {
        setDisabled(false);
      }
    }
  }, [profileData]);

  useEffect(() => {
    if (cartProducts?.length > 0) {
      setDeliveryPrice(cartProducts[0]?.delivery)
      setDeliveryDefault(cartProducts[0]?.delivery)
    }
  }, [cartProducts])

  let subtotal = 0;
  for (const p of cartProducts) {
    subtotal += cartProductPrice(p);
  }
  function handleAddressChange(propName, value) {
    setAddress(prevAddress => ({...prevAddress, [propName]:value}));
  }
  async function proceedToCheckout(ev) {
    ev.preventDefault();
    if (!profileData?.id) {
      router.push('/login');
      alert('Faça login para continuar');
      return;
    }
    const promise = new Promise((resolve, reject) => {
      if (!address.phone || !address.streetAddress || !address.neighborhood || !address.number || !address.complement || !address.city) {
        reject('Preencha todos os campos do endereço');
        return;
      }
      if (cartProducts.length === 0) {
        reject('Adicione produtos ao seu carrinho');
        return;
      }
      // const cartProductsValid = cartProducts.filter(product => {
      //   if (product?.basePrice <= 0) {
      //     return false
      //   }

      //   if (product?.extraIngredientPrices.length > 0) {
      //     const extraIngredientPriceValid = product?.extraIngredientPrices.filter(
      //       extraIngredient => {
      //         if (extraIngredient?.price <= 0 || !extraIngredient?.name) {
      //           return false
      //         }
      //         return true
      //       }
      //     )
      //     if (extraIngredientPriceValid.length <= 0) {
      //       return false
      //     }
      //   }

      //   if (product?.sizes.length > 0) {
      //     const sizesValid = product?.sizes.filter(size => {
      //       if (size?.price <= 0 || !size?.name) {
      //         return false
      //       }
      //       return true
      //     })

      //     if (sizesValid.length <= 0) {
      //       return false
      //     }
      //   }
      // })

      fetch('/api/checkout', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          address,
          cartProducts,
          deliveryDetails
        }),
      }).then(async (response) => {
        if (response?.ok) {
          resolve();
          clearCart();
          router.push('/orders');
        } else {
          reject('Erro ao processar o pedido');
        }
      });
    });

    await toast.promise(promise, {
      loading: 'Preparando seu pedido...',
      success: 'Redirecionando pedido...',
      error: 'Ixi 😔, algo deu errado. Tente novamente.',
    })
  }

  if (cartProducts?.length === 0) {
    return (
      <section className="mt-8 text-center">
        <SectionHeaders mainHeader="Carrinho" />
        <p className="mt-4">Seu carrinho está vazio 😔</p>
      </section>
    );
  }

  return (
    <section className="max-w-2xl mx-auto mt-8">
      <div className="text-center">
        <SectionHeaders mainHeader="Carrinho" />
        {disabled && (
          <p className="mt-4">Realize o seu cadastro no Foodnoow ou faça o login para continuar a colocar mais coisas no seu carrinho 😄</p>
        )}
      </div>
      <div className="mt-8 grid gap-8 sm:grid-cols-1 md:grid-cols-2">
        <div>
          {cartProducts?.length === 0 && (
            <div>Nenhum produto em seu carrinho</div>
          )}
          {cartProducts?.length > 0 && cartProducts.map((product,index) => (
            <CartProduct
              key={index}
              indexProduct={index}
              product={product}
              onRemove={removeCartProduct}
            />
          ))}
          <div className="py-2 pr-16 flex justify-end items-center">
            <div className="text-gray-500">
              Subtotal:<br />
              Delivery:<br />
              Total:
            </div>
            <div className="font-semibold pl-2 text-right">
              {formatFromMoney(subtotal)}<br />
              {formatFromMoney(deliveryPrice)}<br />
              {formatFromMoney(subtotal + deliveryPrice)}
            </div>
          </div>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2>Checkout</h2>
          <form onSubmit={proceedToCheckout}>
            <AddressInputs
              addressProps={address}
              setAddressProp={handleAddressChange}
              setChangeValues={setDisabled}
              disabled={disabled}
            />
            <MethodPayment
              deliveryDefault={deliveryDefault}
              deliveryPrice={setDeliveryPrice}
              deliveryDetails={setDeliveryDetails}
              disabled={disabled}
            />
            <button
              className="w-full mt-4 bg-red-500 text-white py-2 rounded hover:bg-red-600 disabled:opacity-50"
              disabled={disabled} type="submit">Fechar pedido {formatFromMoney(subtotal+deliveryPrice)}</button>
          </form>
        </div>
      </div>
    </section>
  );
}