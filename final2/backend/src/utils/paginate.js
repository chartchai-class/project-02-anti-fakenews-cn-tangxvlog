export async function paginateQuery(model, query, { page = 1, pageSize = 10, sort = { createdAt: -1 }, projection = null, populate = [] }) {
  const skip = (Number(page) - 1) * Number(pageSize);
  const [items, total] = await Promise.all([
    model.find(query, projection).populate(populate).sort(sort).skip(skip).limit(Number(pageSize)),
    model.countDocuments(query),
  ]);
  return { items, total, page: Number(page), pageSize: Number(pageSize), pages: Math.ceil(total / Number(pageSize)) };
}
