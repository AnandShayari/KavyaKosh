export const paginate = (query, page = 1, limit = 12) => {
  const p = Math.max(1, parseInt(page));
  const l = Math.min(50, Math.max(1, parseInt(limit)));
  const skip = (p - 1) * l;
  return { query: query.skip(skip).limit(l), page: p, limit: l, skip };
};

export const paginateResponse = (data, total, page, limit) => ({
  data,
  pagination: {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1,
  },
});

export const buildSort = (sortBy = 'createdAt', order = 'desc') => {
  const sort = {};
  sort[sortBy] = order === 'asc' ? 1 : -1;
  return sort;
};

export const buildFilter = (filters = {}) => {
  const query = {};
  if (filters.type) query.type = filters.type;
  if (filters.language) query.language = filters.language;
  if (filters.mood) query.mood = filters.mood;
  if (filters.genre) query.genre = filters.genre;
  if (filters.category) query.category = filters.category;
  if (filters.status) query.status = filters.status;
  if (filters.author) query.author = filters.author;
  if (filters.visibility) query.visibility = filters.visibility;
  if (filters.search) {
    query.$text = { $search: filters.search };
  }
  return query;
};
