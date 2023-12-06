import { isRestaurantOpen } from "@/libs/restaurantOpen";
import Link from "next/link";

export default function MenuCompanyTile({onAddToCart, ...item}) {
  const {image, name, timeopen, timeclose, dayClosed
  } = item;

  const restaurantStatus = isRestaurantOpen({
    timeopen: timeopen,
    timeclose: timeclose,
    dayClosed: dayClosed
  }) ? 'Aberto' : 'Fechado';
  const statusClass = isRestaurantOpen({
    timeopen: timeopen,
    timeclose: timeclose,
    dayClosed: dayClosed
  }) ? 'text-green-500' : 'text-red-500';
  return (
    <div className="bg-gray-200 p-4 rounded-lg text-center cursor-pointer
      group hover:bg-white hover:shadow-md hover:shadow-black/25 transition-all">
        <Link href={`/${item?.slug}`}>
          <div className="text-center">
            <img src={image || '/not-image.png'} className="max-h-auto max-h-24 block mx-auto"/>
          </div>
          <h4 className="font-semibold text-xl my-3">{name}</h4>
          <p className="text-gray-500 text-sm">
            Abre às {timeopen} - Fecha às {timeclose}
          </p>
          <p className={`font-semibold ${statusClass}`}>
            {restaurantStatus}
          </p>
        </Link>
    </div>
  );
}