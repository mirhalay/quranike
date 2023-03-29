import { useEffect, useState } from "react";

export default function usePagination(pageLen, collection) {
  const [PAGE_LEN] = useState(pageLen);

  const [page, setPage] = useState(1);

  useEffect(() => {
    collection && setPage(1);
  }, [collection]);

  const _pageCount = () => Math.ceil(collection?.length / PAGE_LEN);

  return {
    page,
    setPage,
    get pageCount() {
      return _pageCount();
    },
    get pagesArray() {
      return [...Array(_pageCount()).keys()].map((_, index) => index + 1);
    },
    back: () => setPage((i) => (i > 1 ? i - 1 : _pageCount())),
    next: () => setPage((i) => (i < _pageCount() ? i + 1 : 1)),
    get collection() {
      return (
        collection?.slice(
          (page - 1) * PAGE_LEN,
          (page - 1) * PAGE_LEN + PAGE_LEN
        ) ?? []
      );
    },
  };
}
