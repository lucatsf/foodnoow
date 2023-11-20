'use client';
import SectionHeaders from "@/components/layout/SectionHeaders";
import MenuItem from "@/components/menu/MenuItem";
import {usePathname} from "next/navigation";
import { useEffect, useState } from "react";

const PageOfCompany = () => {
  const pathname = usePathname();
  const slug = pathname.replace('/', '');

  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [company, setCompany] = useState({});

  useEffect(() => {
    fetch('/api/menu-company?slug=' + slug).then(res => {
      res.json().then(({categories, menuItems, company}) => {
        setCategories(categories);
        setMenuItems(menuItems);
        setCompany(company);
      })
    });
  }, []);

  return (
    <section className="mt-8">
      <div className="text-center mb-6">
        <SectionHeaders mainHeader={company.name} />
      </div>
      {categories?.length > 0 && categories.map(c => (
        <div key={c.id}>
          <div className="text-center">
            <SectionHeaders mainHeader={c.name} />
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mt-6 mb-12">
            {menuItems.filter(item => item.category_id === c.id).map(item => (
              <MenuItem key={item.id} {...item} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default PageOfCompany;
