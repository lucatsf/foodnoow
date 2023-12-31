'use client';
import {SessionProvider} from "next-auth/react";
import {createContext, useEffect, useState} from "react";
import toast from "react-hot-toast";

export const CartContext = createContext({});

export function cartProductPrice(cartProduct) {
  let price = cartProduct?.basePrice;
  if (cartProduct?.size) {
    price += cartProduct.size.price;
  }
  if (cartProduct?.extras?.length > 0) {
    for (const extra of cartProduct.extras) {
      price += extra.price;
    }
  }
  if (cartProduct?.flavorsPrices?.length > 0) {
    for (const flavor of cartProduct.flavorsPrices) {
      if (flavor?.discount) {
        price += flavor.discount;
      } else if (flavor?.price) {
        price += flavor?.price;
      }
    }
  }
  return price;
}

export function AppProvider({children, session}) {
  const [cartProducts,setCartProducts] = useState([]);

  const ls = typeof window !== 'undefined' ? window.localStorage : null;

  useEffect(() => {
    if (ls && ls.getItem('cart')) {
      setCartProducts( JSON.parse( ls.getItem('cart') ) );
    }
  }, []);

  function clearCart() {
    setCartProducts([]);
    saveCartProductsToLocalStorage([]);
  }

  function removeCartProduct(indexToRemove) {
    setCartProducts(prevCartProducts => {
      const newCartProducts = prevCartProducts
        .filter((v,index) => index !== indexToRemove);
      saveCartProductsToLocalStorage(newCartProducts);
      return newCartProducts;
    });
    toast.success('Produto removido do carrinho');
  }

  function saveCartProductsToLocalStorage(cartProducts) {
    if (ls) {
      ls.setItem('cart', JSON.stringify(cartProducts));
    }
  }

  function addToCart(product, size=null, extras=[], flavorsPrices=[]) {
    if (cartProducts.length > 0) {
      if (cartProducts[0]?.company_id !== product?.company_id) {
        toast.error('Você só pode adicionar produtos de uma empresa por vez, limpando o carrinho atual para adicionar este produto');
        return;
      }
    }

    const productAdd = {
      id: product.id,
      name: product.name,
      description: product.description,
      image: product.image,
      basePrice: product.basePrice,
      company_id: product.company_id,
      category_id: product.category_id,
      categoryName: product.categoryName,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      delivery: product.delivery,
      size,
      extras,
      flavorsPrices
    };

    setCartProducts(prevProducts => {
      const cartProduct = {...productAdd}
      const newProducts = [...prevProducts, cartProduct];
      saveCartProductsToLocalStorage(newProducts);
      return newProducts;
    });
  }

  return (
    <SessionProvider session={session}>
      <CartContext.Provider value={{
        cartProducts, setCartProducts,
        addToCart, removeCartProduct, clearCart,
      }}>
        {children}
      </CartContext.Provider>
    </SessionProvider>
  );
}