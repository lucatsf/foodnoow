'use client';
import {CartContext, cartProductPrice} from "@/components/AppContext";
import AddressInputs from "@/components/layout/AddressInputs";
import SectionHeaders from "@/components/layout/SectionHeaders";
import CartProduct from "@/components/menu/CartProduct";
import { formatFromMoney } from "@/libs/formatInput";
import {useParams} from "next/navigation";
import {useContext, useEffect, useState} from "react";

export default function OrderPage() {
  const {clearCart} = useContext(CartContext);
  const [order, setOrder] = useState();
  const [loadingOrder, setLoadingOrder] = useState(true);
  const {id} = useParams();
  useEffect(() => {
    if (typeof window.console !== "undefined") {
      if (window.location.href.includes('clear-cart=1')) {
        clearCart();
      }
    }
    if (id) {
      setLoadingOrder(true);
      fetch('/api/orders?id='+id).then(res => {
        res.json().then(orderData => {
          setOrder(orderData);
          setLoadingOrder(false);
        });
      })
    }
  }, []);

  let subtotal = 0;
  if (order?.cartProducts) {
    for (const product of order?.cartProducts) {
      subtotal += cartProductPrice(product);
    }
  }

  const renderMessage = (status) => {
    const messages = {
      Preparando: 'Seu pedido está sendo preparado',
      'A caminho': 'Seu pedido está a caminho',
      Entregue: 'Seu pedido foi entregue',
      Cancelado: 'Seu pedido foi cancelado'
    };
    return messages[status];
  }

  return (
    <section className="max-w-2xl mx-auto mt-8">
      <div className="text-center">
        <SectionHeaders mainHeader="Seus Pedidos" />
        <div className="mt-4 mb-8">
          <p>Obrigado pelo seu pedido.</p>
          { order && (<p>{renderMessage(order?.status)}</p>)}
        </div>
      </div>
      {loadingOrder && (
        <div>Carregando pedido...</div>
      )}
      {order && (
        <div className="mt-8 grid gap-8 sm:grid-cols-1 md:grid-cols-2">
          <div>
            {order?.menuItems.map(product => (
              <CartProduct key={product?.id} product={product} />
            ))}
            <div className="py-2 pr-16 flex justify-end items-center">
              <div className="text-gray-500">
                Subtotal:<br />
                Delivery:<br />
                Total:
              </div>
              <div className="font-semibold pl-2 text-right">
                {formatFromMoney(order?.subtotal)}<br />
                {formatFromMoney(order?.delivery)}<br />
                {formatFromMoney(order?.total)}
              </div>
            </div>
          </div>
          <div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <AddressInputs
                disabled={true}
                addressProps={order}
              />
            <div className="mt-4">
                <span className="text-gray-700">Como deseja pegar seu pedido?</span>
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio"
                      name="pickUpCounter"
                      value="counter"
                      disabled={true}
                      checked={order?.deliveryDetails?.delivery === 'counter'}
                    />
                    <span className="ml-2">Balcão</span>
                  </label>
                  <label className="inline-flex items-center ml-6">
                    <input
                      type="radio"
                      className="form-radio"
                      name="pickUpCounter"
                      value="delivery"
                      disabled={true}
                      checked={order?.deliveryDetails?.delivery === 'delivery'}
                    />
                    <span className="ml-2">Entrega</span>
                  </label>
                </div>
              </div>
              {order?.deliveryDetails?.delivery === 'delivery' && (
                <div className="mt-4">
                  <span className="text-gray-700">Forma de pagamento:</span>
                  <div className="mt-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio"
                        name="paymentMethod"
                        value="card"
                        disabled={true}
                        checked={order?.deliveryDetails?.paymentMethod === 'card'}
                      />
                      <span className="ml-2">Cartão</span>
                    </label>
                    <label className="inline-flex items-center ml-6">
                      <input
                        type="radio"
                        className="form-radio"
                        name="paymentMethod"
                        value="cash"
                        disabled={true}
                        checked={order?.deliveryDetails?.paymentMethod === 'cash'}
                      />
                      <span className="ml-2">Dinheiro</span>
                    </label>
                  </div>
                  {order?.deliveryDetails?.paymentMethod === 'cash' && (
                    <div className="mt-2">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Troco para?
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="changeFor"
                        placeholder="Informe se precisará de troco para quanto"
                        type="text"
                        name="changeFor"
                        disabled={true}
                        value={formatFromMoney(order?.deliveryDetails?.changeFor)}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}