import {CartContext} from "@/components/AppContext";
import MenuItemTile from "@/components/menu/MenuItemTile";
import { formatFromMoney } from "@/libs/formatInput";
import Image from "next/image";
import {useContext, useState} from "react";

export default function MenuItem(menuItem) {
  const {
    image,name,description,basePrice,
    sizes, extraIngredientPrices, flavorsPrices
  } = menuItem;
  const [
    selectedSize, setSelectedSize
  ] = useState(sizes?.[0] || null);
  const [selectedFlavors, setSelectedFlavors] = useState([flavorsPrices?.[0] || null]);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const {addToCart} = useContext(CartContext);
  const maxSelections = {
    pequena: 2,
    media: 2,
    grande: 3,
  };
  let numberOfFlavors = 0; 
  function getMaxSelectionSizeFlavor(ev = null) {
    const sizeFlavor = menuItem?.categoryName.toLowerCase();
    const flavorSizeMin = sizeFlavor.includes('pequena') || sizeFlavor.includes('pequeno')
    if (flavorSizeMin) {
      numberOfFlavors = 2;
      if (selectedFlavors.length >= maxSelections.pequena) {
        if (ev) {
          ev.target.checked = false;
        }
        return;
      }
    }
    const flavorSizeMed = sizeFlavor.includes('media') ||
    sizeFlavor.includes('médio') ||
    sizeFlavor.includes('média') ||
    sizeFlavor.includes('medio');

    if (flavorSizeMed) {
      numberOfFlavors = 2;
      if (selectedFlavors.length >= maxSelections.media) {
        if (ev) {
          ev.target.checked = false;
        }
      }
    }
    const flavorSizeBig = sizeFlavor.includes('grande') ||
    sizeFlavor.includes('grandes') ||
    sizeFlavor.includes('grande');
    if (flavorSizeBig) {
      numberOfFlavors = 3;
      if (selectedFlavors.length >= maxSelections.grande) {
        if (ev) {
          ev.target.checked = false;
        }
      }
    }
    return true;
  }
  async function handleAddToCartButtonClick() {
    const hasOptions = sizes.length > 0 || extraIngredientPrices.length > 0 || flavorsPrices.length > 0;
    if (hasOptions && !showPopup) {
      setShowPopup(true);
      return;
    }
    addToCart(menuItem, selectedSize, selectedExtras, selectedFlavors);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setShowPopup(false);
  }
  function handleExtraThingClick(ev, extraThing) {
    const checked = ev.target.checked;
    if (checked) {
      setSelectedExtras(prev => [...prev, extraThing]);
    } else {
      setSelectedExtras(prev => {
        return prev.filter(e => e.name !== extraThing.name);
      });
    }
  }
  function handleFlavorClick(ev, flavor) {
    if (ev?.target?.checked === false) {
      setSelectedFlavors(prev => {
        return prev.filter(e => e.name !== flavor.name);
      });
      return;
    }
    const pass = getMaxSelectionSizeFlavor(ev);
    if (pass === false) {
      return;
    }

    let checked = ev?.target?.checked;

    if (checked) {
      setSelectedFlavors(prev => [...prev, flavor]);
    } else {
      setSelectedFlavors(prev => {
        return prev.filter(e => e.name !== flavor.name);
      });
    }
  }
  function handleShowPopupClick() {
    setShowPopup(true);
  }

  let selectedPrice = basePrice;
  if (selectedSize) {
    selectedPrice += selectedSize.price;
  }
  if (selectedExtras?.length > 0) {
    for (const extra of selectedExtras) {
      selectedPrice += extra.price;
    }
  }
  getMaxSelectionSizeFlavor();

  if (selectedFlavors?.length > 0) {
    if (selectedFlavors.length > 1) {
      for (const flavor of selectedFlavors) {
        flavor.discount = flavor.price / numberOfFlavors;
        selectedPrice += (flavor.price / numberOfFlavors)
      }
    }
    if (selectedFlavors.length <= 1) {
      for (const flavor of selectedFlavors) {
        selectedPrice += flavor.price;
      }
    }
  }

  return (
    <>
      {showPopup && (
        <div
          onClick={() => setShowPopup(false)}
          className="fixed inset-0 bg-black/80 flex items-center justify-center">
          <div
            onClick={ev => ev.stopPropagation()}
            className="my-8 bg-white p-2 rounded-lg max-w-md">
            <div
              className="overflow-y-scroll p-2"
              style={{maxHeight:'calc(100vh - 100px)'}}>
              <Image
                src={image || '/not-image.png'}
                alt={name}
                width={300} height={200}
                className="mx-auto" />
              <h2 className="text-lg font-bold text-center mb-2">{name}</h2>
              <p className="text-center text-gray-500 text-sm mb-2">
                {description}
              </p>
              {sizes?.length > 0 && (
                <div className="py-2">
                  <h3 className="text-center text-gray-700">Escolha o tamanho</h3>
                  {sizes.map(size => (
                    <label
                      key={size.id}
                      className="flex items-center gap-2 p-4 border rounded-md mb-1">
                      <input
                        type="radio"
                        onChange={() => setSelectedSize(size)}
                        checked={selectedSize?.name === size.name}
                        name="size"/>
                      {size.name} {formatFromMoney(basePrice + size.price)}
                    </label>
                  ))}
                </div>
              )}
              {extraIngredientPrices?.length > 0 && (
                <div className="py-2">
                  <h3 className="text-center text-gray-700">Extras?</h3>
                  {extraIngredientPrices.map(extraThing => (
                    <label
                      key={extraThing.id}
                      className="flex items-center gap-2 p-4 border rounded-md mb-1">
                      <input
                        type="checkbox"
                        onChange={ev => handleExtraThingClick(ev, extraThing)}
                        checked={selectedExtras.map(e => e.id).includes(extraThing.id)}
                        name={extraThing.name} />
                      {extraThing.name} +{formatFromMoney(extraThing.price)}
                    </label>
                  ))}
                </div>
              )}
              {flavorsPrices?.length > 0 && (
                <div className="py-2">
                  <h3 className="text-center text-gray-700">Sabores</h3>
                  {flavorsPrices.map(flavor => (
                    <div
                      key={flavor.id}
                      className="flex flex-col p-4 border-b last:border-b-0">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            onChange={ev => handleFlavorClick(ev, flavor)}
                            checked={selectedFlavors.map(e => e.id).includes(flavor.id)}
                            name="flavor"/>
                          <span className="text-md">{flavor.name}</span>
                        </label>
                        <span className="text-lg">{formatFromMoney(basePrice + flavor?.price)}</span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {flavor.description}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/* <FlyingButton
                targetTop={'5%'}
                targetLeft={'95%'}
                src={image}>
                <div className="primary sticky bottom-2"
                     onClick={handleAddToCartButtonClick}>
                  Add to cart ${selectedPrice}
                </div>
              </FlyingButton> */}
              <button
                className="mt-2 primary sticky bottom-2"
                onClick={handleAddToCartButtonClick}>
                Adicionar ao carrinho {formatFromMoney(selectedPrice)}
              </button>
              <button
                className="mt-2"
                onClick={() => setShowPopup(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <MenuItemTile
        onAddToCart={handleShowPopupClick}
        {...menuItem} />
    </>
  );
}