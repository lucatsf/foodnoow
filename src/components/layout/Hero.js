'use client'
import Right from "@/components/icons/Right";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react';

export default function Hero() {
  const router = useRouter();
  const [currentImage, setCurrentImage] = useState('/pizza.png');
  const images = [
    '/pizza.png',
    '/sushi.png',
    '/burguer.png',
    '/milkshake.png',
  ];

  function goToPage() {
    router.push('/menu');
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage(current => {
        const index = images.indexOf(current);
        return images[(index + 1) % images.length];
      });
    }, 3000);
  
    return () => clearInterval(interval);
  }, []);
  
  return (
    <section className="hero md:mt-4">
      <div className="py-8 md:py-12">
        <h1 className="text-4xl font-semibold">
          Em cada prato,<br />
          um novo<br />
          mundo a&nbsp;
          <span className="text-primary">
            explorar.
          </span>
        </h1>
        <p className="my-6 text-gray-500 text-sm">
          Cada prato traz um pedaço do mundo até você, uma celebração simples e deliciosa das alegrias da vida.
        </p>
        <div className="flex gap-4 text-sm">
          <button 
            onClick={goToPage}
            className="flex justify-center bg-primary uppercase flex items-center gap-2 text-white px-4 py-2 rounded-full">
            Peça agora
            <Right />
          </button>
          <button
            onClick={goToPage}
            className="flex items-center border-0 gap-2 py-2 text-gray-600 font-semibold">
            Ver cardápios
            <Right />
          </button>
        </div>
      </div>
        <div className="relative hidden md:block">
          <Image 
            src={currentImage} 
            fill 
            alt="Imagem dinâmica" 
            style={{ objectFit: 'contain', transition: 'opacity 0.5s ease-in-out' }}
          />
        </div>
    </section>
  );
}