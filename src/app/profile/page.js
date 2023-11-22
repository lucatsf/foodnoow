'use client';

import UserForm from "@/components/layout/UserForm";
import UserTabs from "@/components/layout/UserTabs";
import {useSession} from "next-auth/react";
import {redirect} from "next/navigation";
import {useEffect, useState} from "react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const session = useSession();

  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileFetched, setProfileFetched] = useState(false);
  const {status} = session;

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/profile').then(response => {
        response.json().then(data => {
          setUser(data);
          setIsAdmin(data.admin);
          setProfileFetched(true);
        })
      });
    }
  }, [session, status]);

  async function handleProfileInfoUpdate(ev, data) {
    ev.preventDefault();
    const savingPromise = new Promise(async (resolve, reject) => {
      if (!data?.name || data?.name === '') {
        reject('O nome é obrigatório');
      }
      if (!data?.streetAddress || data?.streetAddress === '') {
        reject('O endereço é obrigatório');
      }
      if (!data?.number || data?.number === '') {
        reject('O número é obrigatório');
      }
      if (!data?.neighborhood || data?.neighborhood === '') {
        reject('O bairro é obrigatório');
      }
      if (!data?.city || data?.city === '') {
        reject('A cidade é obrigatória');
      }
      if (!data?.phone || data?.phone === '') {
        reject('O telefone é obrigatório');
      }
      if(!data?.complement || data?.complement === '') {
        reject('O complemento é obrigatório');
      }
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
      });
      if (response.ok)
        resolve()
      else
        reject('Erro ao salvar');
    });

    await toast.promise(savingPromise, {
      loading: 'Salvando...',
      success: 'Perfil salvo!',
      error: (err) => err.toString(),
    });

  }

  if (status === 'loading' || !profileFetched) {
    return 'Carregando...';
  }

  if (status === 'unauthenticated') {
    return redirect('/login');
  }

  return (
    <section className="mt-8">
      <UserTabs isAdmin={isAdmin} />
      <div className="max-w-2xl mx-auto mt-8">
        <UserForm user={user} onSave={handleProfileInfoUpdate} />
      </div>
    </section>
  );
}