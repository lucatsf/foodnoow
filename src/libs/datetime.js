export function dbTimeForHuman(str) {
  if (!str) {
    return '';
  }
  const date = new Date(str);
  return date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });
}