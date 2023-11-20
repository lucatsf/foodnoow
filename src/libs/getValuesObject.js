export const getValuesObject = (obj) => {
  const filteredObject = {};
  for (const key in obj) {
      if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
          filteredObject[key] = obj[key];
      }
  }
  return filteredObject;
}