import { createClient } from '@supabase/supabase-js';

// Актуальные значения для подключения
const SUPABASE_URL = "https://vcqyrubozjcocexvlvcy.supabase.co";
// Ключ берём из переменной окружения REACT_APP_SUPABASE_KEY
const supabase = createClient(SUPABASE_URL, process.env.REACT_APP_SUPABASE_KEY!);
console.log('SUPABASE_KEY:', process.env.REACT_APP_SUPABASE_KEY);

export { supabase };

// --- Работа с изображениями (пример) ---
// Загрузка изображения в bucket images
export async function uploadImage(path: string, file: File) {
  return await supabase.storage.from('images').upload(path, file);
}

// Получение публичной ссылки на изображение
export function getImageUrl(path: string) {
  const { data } = supabase.storage.from('images').getPublicUrl(path);
  return data.publicUrl;
}

// --- Работа с таблицей suggestions (материалы) ---

// Получить все материалы (например, только approved)
export async function fetchSuggestions(status: string = 'approved') {
  const { data, error } = await supabase
    .from('suggestions')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// Добавить новый материал
export async function addSuggestion(suggestion: Omit<any, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('suggestions')
    .insert([suggestion])
    .select();
  if (error) throw error;
  return data?.[0];
}

// Обновить материал по id
export async function updateSuggestion(id: string, updates: Partial<any>) {
  const { data, error } = await supabase
    .from('suggestions')
    .update(updates)
    .eq('id', id)
    .select();
  if (error) throw error;
  return data?.[0];
}

// Удалить материал по id
export async function deleteSuggestion(id: string) {
  const { error } = await supabase
    .from('suggestions')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
}

// --- Работа с таблицей categories ---
export async function fetchCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('label', { ascending: true });
  if (error) throw error;
  return data;
}

export async function addCategory(category: Omit<any, 'id'>) {
  const { data, error } = await supabase
    .from('categories')
    .insert([category])
    .select();
  if (error) throw error;
  return data?.[0];
}

export async function updateCategory(id: string, updates: Partial<any>) {
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select();
  if (error) throw error;
  return data?.[0];
}

export async function deleteCategory(id: string) {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
}

// --- Работа с таблицей resource_categories ---
export async function fetchResourceCategories(resource_id?: string) {
  let query = supabase.from('resource_categories').select('*');
  if (resource_id) query = query.eq('resource_id', resource_id);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function addResourceCategory(resource_id: string, category_id: string) {
  const { data, error } = await supabase
    .from('resource_categories')
    .insert([{ resource_id, category_id }])
    .select();
  if (error) throw error;
  return data?.[0];
}

export async function deleteResourceCategory(resource_id: string, category_id: string) {
  const { error } = await supabase
    .from('resource_categories')
    .delete()
    .eq('resource_id', resource_id)
    .eq('category_id', category_id);
  if (error) throw error;
  return true;
}

// --- Работа с таблицей feedback ---
export async function fetchFeedback() {
  const { data, error } = await supabase
    .from('feedback')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function addFeedback(message: string) {
  const { data, error } = await supabase
    .from('feedback')
    .insert([{ message }])
    .select();
  if (error) throw error;
  return data?.[0];
}

export async function updateFeedback(id: string, updates: Partial<any>) {
  const { data, error } = await supabase
    .from('feedback')
    .update(updates)
    .eq('id', id)
    .select();
  if (error) throw error;
  return data?.[0];
}

export async function deleteFeedback(id: string) {
  const { error } = await supabase
    .from('feedback')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
}

// --- Работа с таблицей admins ---
export async function fetchAdmins() {
  const { data, error } = await supabase
    .from('admins')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function addAdmin(admin: Omit<any, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('admins')
    .insert([admin])
    .select();
  if (error) throw error;
  return data?.[0];
}

export async function updateAdmin(id: string, updates: Partial<any>) {
  const { data, error } = await supabase
    .from('admins')
    .update(updates)
    .eq('id', id)
    .select();
  if (error) throw error;
  return data?.[0];
}

export async function deleteAdmin(id: string) {
  const { error } = await supabase
    .from('admins')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
}

// --- Здесь можно добавлять функции для работы с другими таблицами Supabase --- 