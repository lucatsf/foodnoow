'use client';
import SectionHeaders from "@/components/layout/SectionHeaders";
import MenuItem from "@/components/menu/MenuItem";
import MenuItemRestaurant from "@/components/menu/MenuItemRestaurant";
import {useEffect, useState} from "react";

export default function MenuPage() {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  useEffect(() => {
    fetch('/api/companies').then(res => {
      res.json().then(categories => setCategories(categories))
    });
  }, []);
  return (
    <section className="mt-8">
      <div className="text-center">
        <SectionHeaders mainHeader='Restaurantes' />
      </div>
      <div className="grid sm:grid-cols-3 gap-2 mt-6 mb-12">
        {categories?.length > 0 && categories.map(c => (
          <MenuItemRestaurant key={c._id} {...c} />
        ))}
      </div>
    </section>
  );
}