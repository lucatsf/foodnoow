import { useEffect } from "react";

export default function AddressInputs({addressProps,setAddressProp,disabled=false, setChangeValues}) {
  const {phone, streetAddress, city, number, neighborhood, complement} = addressProps;
  function changeValues () {
    if (typeof setChangeValues === 'undefined' || setChangeValues === null) {
      return
    }
  }

  useEffect(() => {
    if (typeof setChangeValues === 'undefined' || setChangeValues === null) {
      return
    }
  }, [phone, streetAddress, city, number, neighborhood, complement])

  return (
    <>
      <label>Telefone</label>
      <input
        disabled={disabled}
        type="tel" placeholder="Telefone"
        value={phone || ''} onChange={ev => {
          setAddressProp('phone', ev.target.value);
          changeValues();
        }}
        onBlur={changeValues}
      />
      <label>Cidade</label>
      <input
        disabled={disabled}
        type="text" placeholder="Cidade"
        value={city || ''} onChange={ev => {
          setAddressProp('city', ev.target.value);
          changeValues();
        }}
        onBlur={changeValues}
      />
      <label>Endereço</label>
      <input
        disabled={disabled}
        type="text" placeholder="Endereço"
        value={streetAddress || ''} onChange={ev => {
          setAddressProp('streetAddress', ev.target.value);
          changeValues();
        }}
        onBlur={changeValues}
      />
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label>Numero</label>
          <input
            disabled={disabled}
            type="text" placeholder="Numero"
            value={number || ''} onChange={ev => {
              setAddressProp('number', ev.target.value);
              changeValues();
            }}
            onBlur={changeValues}
          />
        </div>
        <div>
          <label>Bairro</label>
          <input
            disabled={disabled}
            type="text" placeholder="Bairro"
            value={neighborhood || ''} onChange={ev => {
              setAddressProp('neighborhood', ev.target.value);
              changeValues();
            }}
            onBlur={changeValues}
          />
        </div>
      </div>
      <label>Complemento</label>
      <input
        disabled={disabled}
        type="text" placeholder="Complemento"
        value={complement || ''} onChange={ev => {
          setAddressProp('complement', ev.target.value);
          changeValues();
        }}
        onBlur={changeValues}
      />
    </>
  );
}