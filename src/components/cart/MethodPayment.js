import { formatFromMoney, getValueMoney } from "@/libs/formatInput";
import { useEffect, useState } from "react";

export default function MethodPayment(props) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [changeFor, setChangeFor] = useState('');
  const [counterOrDelivery, setCounterOrDelivery] = useState('delivery');

  const handleChoiseDelivery = (event) => {
    setCounterOrDelivery(event.target.value)
    if (event.target.value === 'delivery') {
      setPaymentMethod('card')
      setChangeFor('')
      props.deliveryPrice(props.deliveryDefault)
      props.deliveryDetails({
        delivery: 'delivery',
        paymentMethod: 'card',
        changeFor: '',
      })
    }
    if (event.target.value === 'counter') {
      setPaymentMethod('')
      setChangeFor('')
      props.deliveryPrice(0)
      props.deliveryDetails({
        delivery: 'counter',
        paymentMethod: '',
        changeFor: '',
      })
    }
  };

  const handlePaymentChange = (event) => {
    setPaymentMethod(event.target.value);
    if (event.target.value === 'card') {
      setChangeFor('')
      props.deliveryDetails({
        delivery: counterOrDelivery,
        paymentMethod: 'card',
        changeFor: '',
      })
    }
    if (event.target.value === 'cash') {
      setChangeFor('')
      props.deliveryDetails({
        delivery: counterOrDelivery,
        paymentMethod: 'cash',
        changeFor: changeFor
      })
    }
  };
  
  const handleCashChangeInput = (event) => {
    setChangeFor(getValueMoney(event.target.value));
    props.deliveryDetails({
      delivery: counterOrDelivery,
      paymentMethod: paymentMethod,
      changeFor: getValueMoney(event.target.value),
    })
  };

  return (
    <>
      <div className="mt-4">
        <span className="text-gray-700">Como deseja pegar seu pedido?</span>
        <div className="mt-2">
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              name="pickUpCounter"
              value="counter"
              checked={counterOrDelivery === 'counter'}
              onChange={handleChoiseDelivery}
            />
            <span className="ml-2">Balcão</span>
          </label>
          <label className="inline-flex items-center ml-6">
            <input
              type="radio"
              className="form-radio"
              name="pickUpCounter"
              value="delivery"
              checked={counterOrDelivery === 'delivery'}
              onChange={handleChoiseDelivery}
            />
            <span className="ml-2">Entrega</span>
          </label>
        </div>
      </div>
      {counterOrDelivery === 'delivery' && (
        <div className="mt-4">
          <span className="text-gray-700">Forma de pagamento:</span>
          <div className="mt-2">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={handlePaymentChange}
              />
              <span className="ml-2">Cartão</span>
            </label>
            <label className="inline-flex items-center ml-6">
              <input
                type="radio"
                className="form-radio"
                name="paymentMethod"
                value="cash"
                onChange={handlePaymentChange}
              />
              <span className="ml-2">Dinheiro</span>
            </label>
          </div>
          {paymentMethod === 'cash' && (
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
                value={formatFromMoney(changeFor)}
                onChange={handleCashChangeInput}
              />
            </div>
          )}
        </div>
      )}
    </>
  )
}
