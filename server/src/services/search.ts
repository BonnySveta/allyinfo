// Сервис для поиска
export interface SearchParams {
  search?: string;
  section?: string;
  sortBy?: string;
  order?: string;
  page?: string;
  limit?: string;
  status?: string;
}

export function buildSearchQuery(params: SearchParams) {
  let query = `
    SELECT * FROM suggestions 
    WHERE 1=1
  `;

  const queryParams: Record<string, any> = {};

  // Добавляем фильтр по статусу (по умолчанию 'approved')
  query += ` AND status = @status`;
  queryParams.status = params.status || 'approved';

  if (params.section) {
    query += ` AND section = @section`;
    queryParams.section = params.section;
  }

  if (params.search) {
    query += ` AND (
      preview_title LIKE @search 
      OR preview_description LIKE @search 
      OR description LIKE @search
    )`;
    queryParams.search = `%${params.search}%`;
  }

  // Сортировка
  const sortBy = params.sortBy || 'created_at';
  const order = params.order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  query += ` ORDER BY ${sortBy} ${order}`;

  return {
    query,
    params: queryParams
  };
} 