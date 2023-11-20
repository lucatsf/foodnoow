'use client';
import SectionHeaders from "@/components/layout/SectionHeaders";
import MenuItem from "@/components/menu/MenuItem";
import Image from "next/image";
import {useEffect, useState} from "react";
import MenuCompanyTile from "../menu/MenuCompanyTile";

export default function HomeMenu() {
  const [bestSellers, setBestSellers] = useState([]);
  useEffect(() => {
    fetch('/api/companies').then(res => {
      res.json().then(companies => {
        setBestSellers(companies.slice(-3));
      });
    });
  }, []);
  return (
    <section className="">
      <div className="absolute left-0 right-0 w-full justify-start">
        <div className="absolute left-0 -top-[70px] text-left -z-10">
          <Image src={'/sallad1.png'} width={109} height={189}  alt={'sallad'} />
        </div>
        <div className="absolute -top-[100px] right-0 -z-10">
          <Image src={'/sallad2.png'} width={107} height={195} alt={'sallad'} />
        </div>
      </div>
      {bestSellers?.length > 0 && (
        <>
          <div className="text-center mb-4">
            <SectionHeaders
              subHeader={'Confira aqui'}
              mainHeader={'Os mais pedidos'} />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {bestSellers?.length > 0 && bestSellers.map(item => (
              <MenuCompanyTile key={item.id} {...item} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}