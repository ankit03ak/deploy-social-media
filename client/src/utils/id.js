export const normalizeId = (id) => (id == null ? "" : String(id));

export const sameId = (a, b) => normalizeId(a) === normalizeId(b);

export const includesId = (list, id) =>
  Array.isArray(list) && list.some((item) => sameId(item, id));
