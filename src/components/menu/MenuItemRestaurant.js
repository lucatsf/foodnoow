import Link from "next/link";
import moment from 'moment';

export default function MenuItemRestaurant(restaurants) {
  const {
    image, name, timeopen, timeclose, slug
  } = restaurants;

  const isRestaurantOpen = () => {
    const now = moment();
    const openTime = moment(timeopen, 'HH:mm');
    const closeTime = moment(timeclose, 'HH:mm');
  
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
    <>
      <div className="bg-gray-200 p-4 rounded-lg text-center
        group hover:bg-white hover:shadow-md hover:shadow-black/25 transition-all">
        <div className="text-center">
          <img src={image || '/not-image.png'} className="max-h-auto max-h-24 block mx-auto" alt={name} />
        </div>
        <h4 className="font-semibold text-xl my-3">{name}</h4>
        <p className="text-gray-500 text-sm">
          Abre às {timeopen} - Fecha às {timeclose}
        </p>
        <p className={`font-semibold ${statusClass}`}>
          {restaurantStatus}
        </p>
        <Link href={slug} className="button mt-4 bg-primary text-white rounded-full px-8 py-2">
          <span className="text-white">Entrar</span>
        </Link>
      </div>
    </>
  );
}
