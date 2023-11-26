'use client';
import {signIn} from "next-auth/react";
import Image from "next/image";
import toast from "react-hot-toast";
import {useContext, useState} from "react";
import {useRouter} from "next/navigation";
import { CartContext } from "@/components/AppContext";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginInProgress, setLoginInProgress] = useState(false);
  const {cartProducts} = useContext(CartContext);
  const router = useRouter();

  async function handleFormSubmit(ev) {
    ev.preventDefault();
    setLoginInProgress(true);
    const savingPromise = new Promise(async (resolve, reject) => {
      if (!email || email === '') {
        reject('O email é obrigatório');
      }
      if (!password || password === '') {
        reject('A senha é obrigatória');
      }
      const response = await signIn('credentials', {
        email,
        password,
        callbackUrl: '/',
        redirect: false,
      });
      if (response?.ok) {
        setLoginInProgress(false);
        if (cartProducts?.length > 0) {
          router.push('/cart');
          return resolve();
        }
        router.push('/');
        resolve()
      } else {
        setLoginInProgress(false);
        reject('Email ou senha incorretos');
      }
    })
    await toast.promise(savingPromise, {
      loading: 'Carregando credenciais...',
      success: 'Credenciais carregadas com sucesso!',
      error: (err) => err.toString(),
    });
    setLoginInProgress(false);
  }

  return (
    <section className="mt-8">
      <h1 className="text-center text-primary text-4xl mb-4">
        Login
      </h1>
      <form className="max-w-xs mx-auto" onSubmit={handleFormSubmit}>
        <input type="email" name="email" placeholder="email" value={email}
               disabled={loginInProgress}
               onChange={ev => setEmail(ev.target.value)} />
        <input type="password" name="password" placeholder="password" value={password}
               disabled={loginInProgress}
               onChange={ev => setPassword(ev.target.value)}/>
        <button disabled={loginInProgress} type="submit">Login</button>
        <div className="my-4 text-center text-gray-500">
          ou login com sua conta google
        </div>
        <button type="button" onClick={() => signIn('google', {callbackUrl: '/'})}
                className="flex gap-4 justify-center">
          <Image src={'/google.png'} alt={''} width={24} height={24} />
          Login with google
        </button>
      </form>
    </section>
  );
}