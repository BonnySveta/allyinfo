// Сервис для поиска
export interface SearchParams {
  search?: string;
  section?: string;
  sortBy?: string;
  order?: string;
  page?: string;
  limit?: string;
}

export function buildSearchQuery(params: SearchParams) {
  let query = `
    SELECT * FROM suggestions 
    WHERE status = 'approved'
  `;

  const queryParams: any = {};

  // Добавляем поиск
  if (params.search && typeof params.search === 'string') {
    const searchTerm = decodeURIComponent(params.search);
    query += `
      AND (
        (preview_title LIKE @searchPattern COLLATE NOCASE)
        OR (preview_description LIKE @searchPattern COLLATE NOCASE)
        OR (description LIKE @searchPattern COLLATE NOCASE)
      )
    `;
    queryParams.searchPattern = `%${searchTerm}%`;
  }

  // Добавляем фильтр по разделу
  if (params.section && typeof params.section === 'string') {
    query += ` AND section = @section`;
    queryParams.section = params.section;
  }

  // Добавляем сортировку
  const sortMapping: Record<string, string> = {
    date: 'created_at',
    title: 'preview_title',
    section: 'section'
  };

  const sortField = sortMapping[params.sortBy || 'date'] || 'created_at';
  const sortOrder = params.order === 'asc' ? 'ASC' : 'DESC';
  query += ` ORDER BY ${sortField} ${sortOrder}`;

  return { query, params: queryParams };
} 