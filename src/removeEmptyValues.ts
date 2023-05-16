export const removeEmptyValues = (list: string[]) => {
  for (const item of list) {
    if (!item) {
      list.splice(list.indexOf(item), 1);
    }
  }

  return list;
};
