'use client';
import Left from "@/components/icons/Left";
import Right from "@/components/icons/Right";
import EditableImage from "@/components/layout/EditableImage";
import MenuItemForm from "@/components/layout/MenuItemForm";
import UserTabs from "@/components/layout/UserTabs";
import {useProfile} from "@/components/UseProfile";
import Link from "next/link";
import {redirect} from "next/navigation";
import {useState} from "react";
import toast from "react-hot-toast";

export default function NewMenuItemPage() {

  const [redirectToItems, setRedirectToItems] = useState(false);
  const {loading, data} = useProfile();

  async function handleFormSubmit(ev, data) {
    ev.preventDefault();
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
      const response = await fetch('/api/menu-items', {
        method: 'POST',
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
      <MenuItemForm menuItem={null} onSubmit={handleFormSubmit} />
    </section>
  );
}