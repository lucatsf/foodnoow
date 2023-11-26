import ChevronDown from "@/components/icons/ChevronDown";
import ChevronUp from "@/components/icons/ChevronUp";
import Plus from "@/components/icons/Plus";
import Trash from "@/components/icons/Trash";
import { formatFromMoney } from "@/libs/formatInput";
import {useState} from "react";

export default function MenuItemFlavorsPriceProps({name,addLabel,props,setProps}) {

  const [isOpen, setIsOpen] = useState(false);

  function addProp() {
    setProps(oldProps => {
      return [...oldProps, {name:'', price:0}];
    });
  }

  function editProp(ev, index, prop) {
    const newValue = ev.target.value;
    setProps(prevSizes => {
      const newSizes = [...prevSizes];
      newSizes[index][prop] = newValue;
      return newSizes;
    });
  }

  function removeProp(indexToRemove) {
    setProps(prev => prev.filter((v,index) => index !== indexToRemove));
  }

  return (
    <div className="bg-gray-200 p-2 rounded-md mb-2">
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="inline-flex p-1 border-0 justify-start"
        type="button">
        {isOpen && (
          <ChevronUp />
        )}
        {!isOpen && (
          <ChevronDown />
        )}
        <span>{name}</span>
        <span>({props?.length})</span>
      </button>
      <div className={isOpen ? 'block' : 'hidden'}>
        {props?.length > 0 && props.map((data,index) => (
          <>
            <div key={index} className="flex items-end gap-2">
              <div>
                <label>Nome</label>
                <input type="text"
                      placeholder="Tamanho"
                      value={data.name}
                      onChange={ev => editProp(ev, index, 'name')}
                />
              </div>
              <div>
                <label>Preço</label>
                <input type="text" placeholder="Preço"
                      value={formatFromMoney(data.price)}
                      onChange={ev => editProp(ev, index, 'price')}
                />
              </div>
              <div>
                <button type="button"
                        onClick={() => removeProp(index)}
                        className="bg-white mb-2 px-2">
                  <Trash />
                </button>
              </div>
            </div>
            <div>
              <label>Descrição</label>
              <input type="text" placeholder="Descrição"
                value={data?.description}
                onChange={ev => editProp(ev, index, 'description')}
              />
            </div>
          </>
        ))}
        <button
          type="button"
          onClick={addProp}
          className="bg-white items-center">
          <Plus className="w-4 h-4" />
          <span>{addLabel}</span>
        </button>
      </div>
    </div>
  );
}