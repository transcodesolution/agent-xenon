type FilterValue = string | string[] | undefined;

export interface FilterParams {
  [key: string]: FilterValue;
}

export const updateUrlParams = (filters: FilterParams): string => {
  const currentUrl = new URL(window.location.href);
  const searchParams = new URLSearchParams(currentUrl.search);

  Object.entries(filters).forEach(([key, value]) => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      searchParams.delete(key);
      return;
    }

    if (Array.isArray(value)) {
      searchParams.delete(key);
      value.forEach(val => searchParams.append(key, val));
    } else {
      searchParams.set(key, value);
    }
  });

  return `?${searchParams.toString()}`;
};