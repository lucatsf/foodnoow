'use client';
import Right from "@/components/icons/Right";
import UserTabs from "@/components/layout/UserTabs";
import {useProfile} from "@/components/UseProfile";
import Image from "next/image";
import Link from "next/link";
import {useEffect, useState} from "react";

export default function MenuItemsPage() {

  const [menuItems, setMenuItems] = useState([]);
  const {loading, data} = useProfile();

  useEffect(() => {
    fetch('/api/menu-items').then(res => {
      res.json().then(menuItems => {
        setMenuItems(menuItems);
      });
    })
  }, []);

  if (loading) {
    return 'Carregando informações do usuário...';
  }

  if (!data.admin) {
    return 'Você não tem permissão para acessar esta página.';
  }

  return (
    <section className="mt-8 max-w-2xl mx-auto">
      <UserTabs isAdmin={true} />
      <div className="mt-8">
        <Link
          className="button flex"
          href={'/menu-items/new'}>
          <span>Criar novo produto para o menu</span>
          <Right />
        </Link>
      </div>
      <div>
        <h2 className="text-sm text-gray-500 mt-8">Editar item:</h2>
        <div className="grid grid-cols-3 gap-2">
          {menuItems?.length > 0 && menuItems.map(item => (
            <Link
              key={item.id}
              href={'/menu-items/edit/'+item.id}
              className="bg-gray-200 rounded-lg p-4"
            >
              <div className="relative">
                <Image
                  className="rounded-md"
                  src={item.image || '/not-image.png'} alt={''} width={200} height={200} />
              </div>
              <div className="text-center">
                {item.name}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}