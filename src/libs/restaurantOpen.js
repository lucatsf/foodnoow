import moment from "moment/moment";

export const isRestaurantOpen = ({ timeopen, timeclose, dayClosed }) => {
  const now = moment();
  const openTime = moment(timeopen, 'HH:mm');
  let closeTime = moment(timeclose === '00:00' ? '23:59' : timeclose, 'HH:mm');

  // Se o horário de fechamento é antes do horário de abertura, 
  // ajusta o closeTime para o dia seguinte
  if (closeTime.isBefore(openTime)) {
    closeTime.add(1, 'day');
  }

  // pegar o dia da semana
  // o dia da semana começa em 0 (domingo) e vai até 6 (sábado)
  const dayOfWeek = now.day();
  if (dayClosed === dayOfWeek) {
    return false;
  }

  if (dayClosed === 666) {
    return false;
  }
  return now.isBetween(openTime, closeTime);
};