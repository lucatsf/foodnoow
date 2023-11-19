'use client';
import {CartContext, cartProductPrice} from "@/components/AppContext";
import Trash from "@/components/icons/Trash";
import AddressInputs from "@/components/layout/AddressInputs";
import SectionHeaders from "@/components/layout/SectionHeaders";
import CartProduct from "@/components/menu/CartProduct";
import {useProfile} from "@/components/UseProfile";
import Image from "next/image";
import {useContext, useEffect, useState} from "react";
import toast from "react-hot-toast";

export default function CartPage() {
  const {cartProducts,removeCartProduct} = useContext(CartContext);
  const [address, setAddress] = useState({});
  const [disabled, setDisabled] = useState(true);
  const {data:profileData} = useProfile();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.location.href.includes('canceled=1')) {
        toast.error('Payment failed 😔');
      }
    }
  }, []);

  useEffect(() => {
    if (profileData?.streetAddress) {
      const {phone, streetAddress, neighborhood, number, complement} = profileData;
      const addressFromProfile = {
        phone,
        streetAddress,
        neighborhood,
        number,
        complement
      };
      setAddress(addressFromProfile);
      if (phone && streetAddress && neighborhood && number && complement) {
        setDisabled(false);
      }
    }
  }, [profileData]);

  let subtotal = 0;
  for (const p of cartProducts) {
    subtotal += cartProductPrice(p);
  }
  function handleAddressChange(propName, value) {
    setAddress(prevAddress => ({...prevAddress, [propName]:value}));
  }
  async function proceedToCheckout(ev) {
    ev.preventDefault();
    // address and shopping cart products

    const promise = new Promise((resolve, reject) => {
      fetch('/api/checkout', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          address,
          cartProducts,
        }),
      }).then(async (response) => {
        if (response.ok) {
          resolve();
          window.location = await response.json();
        } else {
          reject();
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
    <section className="mt-8">
      <div className="text-center">
        <SectionHeaders mainHeader="Carrinho" />
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
              R${subtotal}<br />
              R$5<br />
              R${subtotal + 5}
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
            />
            <button
              className="w-full mt-4 bg-red-500 text-white py-2 rounded hover:bg-red-600 disabled:opacity-50"
              disabled={disabled} type="submit">Fechar pedido R${subtotal+5}</button>
          </form>
        </div>
      </div>
    </section>
  );
}