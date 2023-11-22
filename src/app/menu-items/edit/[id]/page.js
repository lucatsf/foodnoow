'use client';
import DeleteButton from "@/components/DeleteButton";
import Left from "@/components/icons/Left";
import MenuItemForm from "@/components/layout/MenuItemForm";
import UserTabs from "@/components/layout/UserTabs";
import {useProfile} from "@/components/UseProfile";
import { getValueMoney } from "@/libs/formatInput";
import Link from "next/link";
import {redirect, useParams} from "next/navigation";
import {useEffect, useState} from "react";
import toast from "react-hot-toast";

export default function EditMenuItemPage() {

  const {id} = useParams();

  const [menuItem, setMenuItem] = useState(null);
  const [redirectToItems, setRedirectToItems] = useState(false);
  const {loading, data} = useProfile();

  useEffect(() => {
    fetch('/api/menu-items').then(res => {
      res.json().then(items => {
        const item = items.find(i => i.id === id);
        setMenuItem(item);
      });
    })
  }, []);

  async function handleFormSubmit(ev, data) {
    ev.preventDefault();
    data = {...data, id:id};
    const savingPromise = new Promise(async (resolve, reject) => {
      if (
        (!data?.name || data?.name == '')||
        (!data.description || data.description == '') ||
        (!data.basePrice || data.basePrice == '') ||
        (!data.category_id || data.category_id == '')
      ) {
        reject('Por favor, preencha todos os campos');
        return;
      }
      if (data?.sizes?.length > 0) {
        for (const size of data.sizes) {
          if (!size?.name || size.name == '' || !size?.price || size.price == '') {
            reject('Por favor, preencha todos os campos de tamanho');
            return;
          }
        }
      }
      if (data?.extraIngredientPrices?.length > 0) {
        for (const extraIngredientPrice of data.extraIngredientPrices) {
          if (
            !extraIngredientPrice?.name ||
            extraIngredientPrice.name == '' ||
            !extraIngredientPrice?.price ||
            extraIngredientPrice.price == ''
          ) {
            reject('Por favor, preencha todos os campos de acompanhamento');
            return;
          }
        }
      }
      for (const size of data.sizes) {
        size.price = getValueMoney(size.price);
      }
      for (const extraIngredientPrice of data.extraIngredientPrices) {
        extraIngredientPrice.price = getValueMoney(extraIngredientPrice.price);
      }
      data.basePrice = getValueMoney(data.basePrice);
      const response = await fetch('/api/menu-items', {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok)
        resolve();
      else
        reject('Erro ao processar a requisição');
    });

    await toast.promise(savingPromise, {
      loading: 'Salvando alterações...',
      success: 'Salvo',
      error: (err) => err.toString(),
    });

    setRedirectToItems(true);
  }

  async function handleDeleteClick() {
    const promise = new Promise(async (resolve, reject) => {
      const res = await fetch('/api/menu-items?id='+id, {
        method: 'DELETE',
      });
      if (res.ok)
        resolve();
      else
        reject();
    });

    await toast.promise(promise, {
      loading: 'Deletando...',
      success: 'Deletado',
      error: 'Error',
    });

    setRedirectToItems(true);
  }

  if (redirectToItems) {
    return redirect('/menu-items');
  }

  if (loading) {
    return 'Carregando informações do usuário...';
  }

  if (!data.admin) {
    return 'Você não tem permissão para acessar esta página.';
  }

  return (
    <section className="mt-8">
      <UserTabs isAdmin={true} />
      <div className="max-w-2xl mx-auto mt-8">
        <Link href={'/menu-items'} className="button">
          <Left />
          <span>Voltar e ver todos produtos</span>
        </Link>
      </div>
      {menuItem && <MenuItemForm menuItem={menuItem} onSubmit={handleFormSubmit} /> }
      <div className="max-w-md mx-auto mt-2">
        <div className="max-w-xs ml-auto pl-4">
          <DeleteButton
            label="Deletar item"
            onDelete={handleDeleteClick}
          />
        </div>
      </div>
    </section>
  );
}