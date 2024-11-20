export type Paginated<T> = {
  items: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
  links: {
    first: string;
    previous: string;
    next: string;
    last: string;
  };
};

export function wrapIntoPaginationInfo<T>(
  collection: T[],
  linksBaseUri: string,
  limit: number,
  totalItems = collection.length,
  currentPage = 1,
  totalPages = collection.length === 0 ? 0 : 1,
): Paginated<T> {
  const previous =
    currentPage === 1
      ? ''
      : `${linksBaseUri}?limit=${limit}&page=${currentPage - 1}`;

  const next =
    currentPage >= totalPages
      ? ''
      : `${linksBaseUri}?limit=${limit}&page=${currentPage + 1}`;

  return {
    items: collection,
    meta: {
      totalItems: totalItems,
      itemCount: collection.length,
      itemsPerPage: limit,
      totalPages: totalPages,
      currentPage: currentPage,
    },
    links: {
      first: `${linksBaseUri}?limit=${limit}`,
      previous: previous,
      next: next,
      last: `${linksBaseUri}?page=${totalPages}&limit=${limit}`,
    },
  };
}
