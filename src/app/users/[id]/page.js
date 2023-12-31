'use client';
import UserForm from "@/components/layout/UserForm";
import UserTabs from "@/components/layout/UserTabs";
import {useProfile} from "@/components/UseProfile";
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import toast from "react-hot-toast";

export default function EditUserPage() {
  const {loading, data} = useProfile();
  const [user, setUser] = useState(null);
  const {id} = useParams();

  useEffect(() => {
    if (!id) return;
    fetch('/api/profile?id='+id).then(res => {
      res.json().then(user => {
        setUser(user);
      });
    })
  }, []);

  async function handleSaveButtonClick(ev, data) {
    ev.preventDefault();
    const promise = new Promise(async (resolve, reject) => {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...data,id:id}),
      });
      if (res.ok)
        resolve();
      else
        reject();
    });

    await toast.promise(promise, {
      loading: 'Salvando usuário...',
      success: 'User salvo',
      error: 'Um erro ocorreu ao salvar o usuário',
    });
  }

  if (loading) {
    return 'Carregando perfil de usuário...';
  }

  if (!data.admin) {
    return 'Não é permitido editar usuários quando não se é um administrador';
  }

  return (
    <section className="mt-8 mx-auto max-w-2xl">
      <UserTabs isAdmin={true} />
      <div className="mt-8">
        {user && <UserForm user={user} onSave={handleSaveButtonClick} />}
      </div>
    </section>
  );
}