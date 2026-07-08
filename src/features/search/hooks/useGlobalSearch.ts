import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@/shared/hooks';
import { globalSearchService } from '../services/globalSearchService';
import type { SearchableEntity } from '../types/search.types';

const SEARCH_DEBOUNCE_MS = 300;
const MIN_SEARCH_LENGTH = 2;
// Shorter than the 5-minute global default - a search dialog is opened,
// used, and closed within seconds, so there's little value in holding onto
// a stale result set for minutes; re-typing the same term after a short
// pause should still hit cache, just not indefinitely.
const SEARCH_STALE_TIME = 30 * 1000;

export const searchKeys = {
  all: ['globalSearch'] as const,
  search: (term: string, entities?: SearchableEntity[]) => [...searchKeys.all, term, entities] as const,
};

export const useGlobalSearch = (term: string, entities?: SearchableEntity[]) => {
  const debouncedTerm = useDebounce(term, SEARCH_DEBOUNCE_MS);
  const isSearchable = debouncedTerm.trim().length >= MIN_SEARCH_LENGTH;

  const query = useQuery({
    queryKey: searchKeys.search(debouncedTerm, entities),
    queryFn: () => globalSearchService.search(debouncedTerm, entities),
    enabled: isSearchable,
    staleTime: SEARCH_STALE_TIME,
  });

  return {
    ...query,
    // Lets the UI show "type to search" instead of "no results found" while
    // the term is below the minimum length (the query is disabled, so
    // `data` stays undefined rather than an empty array in that case).
    isSearchable,
  };
};
