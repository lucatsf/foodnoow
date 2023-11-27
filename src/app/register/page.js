"use client";
import {signIn} from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {useState} from "react";

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [creatingUser, setCreatingUser] = useState(false);
  const [userCreated, setUserCreated] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

  async function handleFormSubmit(ev) {
    ev.preventDefault();
    setCreatingUser(true);
    setError(false);
    setUserCreated(false);
    const response = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({email, password, name}),
      headers: {'Content-Type': 'application/json'},
    });
    if (response.ok) {
      setUserCreated(true);
      router.replace('/login');
    }
    else {
      setError(true);
    }
    setCreatingUser(false);
  }
  return (
    <section className="mt-8">
      <h1 className="text-center text-primary text-4xl mb-4">
        Cadastre-se
      </h1>
      {userCreated && (
        <div className="my-4 text-center">
          Usuário criado com sucesso!<br />
          Agora você pode fazer login.{' '}
          <Link className="underline" href={'/login'}>Login &raquo;</Link>
        </div>
      )}
      {error && (
        <div className="my-4 text-center">
          um erro ocorreu.<br />
          Por favor, tente novamente.
        </div>
      )}
      <form className="block max-w-xs mx-auto" onSubmit={handleFormSubmit}>
        <input type="name" placeholder="Seu nome" value={name}
                disabled={creatingUser}
                onChange={ev => setName(ev.target.value)} />
        <input type="email" placeholder="Email" value={email}
               disabled={creatingUser}
               onChange={ev => setEmail(ev.target.value)} />
        <input type="password" placeholder="Sua senha" value={password}
               disabled={creatingUser}
                onChange={ev => setPassword(ev.target.value)}/>
        <button type="submit" disabled={creatingUser}>
          Confirmar
        </button>
        {/* <div className="my-4 text-center text-gray-500">
          ou entre com o Google
        </div> */}
        {/* <button
          onClick={() => signIn('google', {callbackUrl:'/'})}
          className="flex gap-4 justify-center">
          <Image src={'/google.png'} alt={''} width={24} height={24} />
          Login com Google
        </button> */}
        <div className="text-center my-4 text-gray-500 border-t pt-4">
          Já tem uma conta?{' '}
          <Link className="underline" href={'/login'}>Login aqui &raquo;</Link>
        </div>
      </form>
    </section>
  );
}