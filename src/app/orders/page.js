'use client';
import UserTabs from "@/components/layout/UserTabs";
import {useProfile} from "@/components/UseProfile";
import {dbTimeForHuman} from "@/libs/datetime";
import Link from "next/link";
import {useEffect, useState} from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const {data:profile} = useProfile();

  useEffect(() => {
    fetchOrders();
  }, []);

  function fetchOrders() {
    setLoadingOrders(true);
    fetch('/api/orders').then(res => {
      res.json().then(orders => {
        setOrders(orders?.sort((a, b) => {
          return new Date(b?.createdAt) - new Date(a?.createdAt);
        }));
        setLoadingOrders(false);
      })
    })
  }

  const renderStatus = (status) => {
    // Objeto de mapeamento de status para classes de cor do Tailwind
    const statusColorClasses = {
      Preparando: 'bg-yellow-500',
      'A caminho': 'bg-green-500',
      Entregue: 'bg-teal-500',
      Cancelado: 'bg-red-500'
    };
  
    // Obter a classe de cor com base no status, ou padrão para cinza se não conhecido
    const statusClass = statusColorClasses[status] || 'bg-gray-500';
  
    return (
      <div className={`p-2 rounded-md text-white w-24 text-center ${statusClass}`}>
        {status}
      </div>
    );
  }
  

  return (
    <section className="mt-8 max-w-2xl mx-auto">
      <UserTabs isAdmin={profile.admin} />
      <div className="mt-8">
        {loadingOrders && (
          <div>Carregando pedidos...</div>
        )}
        {orders?.length > 0 && orders.map(order => (
          <div
            key={order?.id}
            className="bg-gray-100 mb-2 p-4 rounded-lg flex flex-col md:flex-row items-center gap-6">
            <div className="grow flex flex-col md:flex-row items-center gap-6">
              <div>
                {renderStatus(order?.status)}
              </div>
              <div className="grow">
                <div className="flex gap-2 items-center mb-1">
                  <div className="grow">{order?.company_name}</div>
                  <div className="text-gray-500 text-sm">{dbTimeForHuman(order?.createdAt)}</div>
                  <div className="md:hidden text-gray-500 text-xs">
                    {order?.menuItems?.length > 1 ? order?.menuItems?.length + ' itens' : order?.menuItems?.length + ' item'}
                  </div>
                </div>
                <div className="hidden md:block text-gray-500 text-xs">
                  {order?.menuItems?.length > 1 ? order?.menuItems?.length + ' itens' : order?.menuItems?.length + ' item'}
                </div>
              </div>
            </div>
            <div className="justify-end flex gap-2 items-center whitespace-nowrap">
              <Link href={"/orders/"+order?.id} className="button">
                Ver pedido
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}