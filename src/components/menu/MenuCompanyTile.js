import moment from "moment/moment";
import Link from "next/link";

export default function MenuCompanyTile({onAddToCart, ...item}) {
  const {image, name, timeopen, timeclose
  } = item;
  const isRestaurantOpen = () => {
    const now = moment();
    const openTime = moment(item?.timeopen, 'HH:mm');
    let closeTime = moment(item?.timeclose === '00:00' ? '23:59' : item?.timeclose, 'HH:mm');
  
    // Se o horário de fechamento é antes do horário de abertura, 
    // ajusta o closeTime para o dia seguinte
    if (closeTime.isBefore(openTime)) {
      closeTime.add(1, 'day');
    }
    return now.isBetween(openTime, closeTime);
  };

  const restaurantStatus = isRestaurantOpen() ? 'Aberto' : 'Fechado';
  const statusClass = isRestaurantOpen() ? 'text-green-500' : 'text-red-500';
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