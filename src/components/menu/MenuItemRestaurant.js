import {CartContext} from "@/components/AppContext";
import MenuItemTile from "@/components/menu/MenuItemTile";
import Image from "next/image";
import Link from "next/link";
import {useContext, useState} from "react";

export default function MenuItemRestaurant(restaurants) {
  const {
    image,name,description,slug
  } = restaurants;

  return (
    <>
      <div className="bg-gray-200 p-4 rounded-lg text-center
        group hover:bg-white hover:shadow-md hover:shadow-black/25 transition-all">
        <div className="text-center">
          <img src={image || '/not-image.png'} className="max-h-auto max-h-24 block mx-auto" alt={name}/>
        </div>
        <h4 className="font-semibold text-xl my-3">{name}</h4>
        <p className="text-gray-500 text-sm line-clamp-3">
          {description}
        </p>
        <Link href={slug} className="button mt-4 bg-primary text-white rounded-full px-8 py-2">
          <span>Entrar</span>
        </Link>
      </div>
    </>
  );
}