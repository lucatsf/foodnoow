'use client';
import SectionHeaders from "@/components/layout/SectionHeaders";
import MenuItem from "@/components/menu/MenuItem";
import { isRestaurantOpen } from "@/libs/restaurantOpen";
import Image from "next/image";
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
        setCompany(company);
        menuItems = menuItems.map(item => {
          return {
            ...item,
            delivery: company?.delivery || 0
          }
        });
        setMenuItems(menuItems);
      })
    });
  }, []);

  const restaurantStatus = isRestaurantOpen({
    timeopen: company?.timeopen,
    timeclose: company?.timeclose,
    dayClosed: company?.dayClosed
  }) ? 'Aberto' : 'Fechado';
  const statusClass = isRestaurantOpen({
    timeopen: company?.timeopen,
    timeclose: company?.timeclose,
    dayClosed: company?.dayClosed
  }) ? 'text-green-500' : 'text-red-500';

  return (
    <section className="mt-8">
      <div className="text-center mb-6">
        <SectionHeaders mainHeader={company.name} />
        <div className="mt-4 mb-4 flex justify-center">
          <Image
            className="rounded-lg"
            src={company?.image}
            alt={company?.name}
            width={150}
            height={150}
          />
        </div>
        {company?.timeopen && (
          <div>
            <h4 className="font-semibold text-xl my-3">{company?.name}</h4>
            <p className="text-gray-500 text-sm">
              {(company?.address && company?.number && company?.neighborhood && company?.city) &&(
                `${company?.address}, ${company?.number} - ${company?.neighborhood} ${company?.city}`
              )}
            </p>

            <p className="text-gray-500 text-sm">
              Abre às {company?.timeopen} - Fecha às {company?.timeclose}
            </p>
            <p className={`font-semibold ${statusClass}`}>
              {restaurantStatus}
            </p>
          </div>
        )}
      </div>
      {categories?.length > 0 && categories.map(c => (
        <div key={c.id}>
          <div className="text-center">
            <SectionHeaders mainHeader={c.name} />
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mt-6 mb-12">
            {menuItems.filter(item => item.category_id === c.id).map(item => {
              item.categoryName = c.name;
              return (
                <MenuItem key={item.id} {...item } />
              )
            })}
          </div>
        </div>
      ))}
    </section>
  );
};

export default PageOfCompany;
