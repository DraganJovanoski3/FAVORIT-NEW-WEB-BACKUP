import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { WarrantySubmission } from '../warranty/warranty.model';

const PLACEHOLDER_URL = 'YOUR_SUPABASE_PROJECT_URL';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient | null = null;

  constructor() {
    const url = environment.supabase?.url?.trim() || '';
    if (url && url !== PLACEHOLDER_URL && (url.startsWith('https://') || url.startsWith('http://'))) {
      this.supabase = createClient(url, environment.supabase.anonKey || '', {
        auth: {
          // Avoid "Acquiring an exclusive Navigator LockManager lock immediately failed" when
          // the Web Locks API is unavailable or contended (e.g. multiple tabs, strict privacy).
          lock: (_name, _acquireTimeout, fn) => fn(),
        },
      });
    }
  }

  get client(): SupabaseClient | null {
    return this.supabase;
  }

  get isConfigured(): boolean {
    return this.supabase !== null;
  }

  // ---- Warranty submissions (public insert, admin read) ----
  async submitWarranty(data: WarrantySubmission): Promise<{ success: boolean; error?: string }> {
    if (!this.supabase) {
      return { success: false, error: 'Supabase is not configured. Add your project URL and anon key in src/environments/environment.ts' };
    }
    try {
      const { error } = await this.supabase
        .from('warranty_submissions')
        .insert({
          first_name: data.first_name,
          last_name: data.last_name,
          address: data.address,
          city: data.city,
          postal_code: data.postal_code,
          phone: data.phone,
          email: data.email,
          device_type: data.device_type,
          device_model: data.device_model,
          serial_number: data.serial_number,
          purchase_date: data.purchase_date,
          place_of_purchase: data.place_of_purchase,
          city_of_purchase: data.city_of_purchase,
          fiscal_receipt_number: data.fiscal_receipt_number,
          terms_accepted: data.terms_accepted,
          receipt_image_url: data.receipt_image_url || null
        });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (e: any) {
      const msg = e?.message || String(e);
      if (msg.toLowerCase().includes('fetch') || msg.toLowerCase().includes('network')) {
        return { success: false, error: 'Network error. Check your anon key in Project Settings → API (use the long "anon public" key), and that the Supabase project is not paused.' };
      }
      return { success: false, error: msg };
    }
  }

  /** Returns true if this serial number is already in the database (exact match, trimmed). */
  async isSerialNumberAlreadyRegistered(serialNumber: string): Promise<boolean> {
    if (!this.supabase) return false;
    const trimmed = (serialNumber || '').trim();
    if (!trimmed) return false;
    const { data, error } = await this.supabase
      .from('warranty_submissions')
      .select('id')
      .eq('serial_number', trimmed)
      .limit(1);
    if (error) return false;
    return (data?.length ?? 0) > 0;
  }

  async searchWarrantyBySerial(serialNumber: string): Promise<WarrantySubmission[]> {
    if (!this.supabase) return [];
    const { data, error } = await this.supabase
      .from('warranty_submissions')
      .select('*')
      .ilike('serial_number', `%${serialNumber}%`)
      .order('created_at', { ascending: false });
    if (error) return [];
    return (data || []) as WarrantySubmission[];
  }

  async searchWarrantyByEmail(email: string): Promise<WarrantySubmission[]> {
    if (!this.supabase) return [];
    const { data, error } = await this.supabase
      .from('warranty_submissions')
      .select('*')
      .ilike('email', `%${email}%`)
      .order('created_at', { ascending: false });
    if (error) return [];
    return (data || []) as WarrantySubmission[];
  }

  async searchWarrantyByPhone(phone: string): Promise<WarrantySubmission[]> {
    if (!this.supabase) return [];
    const { data, error } = await this.supabase
      .from('warranty_submissions')
      .select('*')
      .ilike('phone', `%${phone}%`)
      .order('created_at', { ascending: false });
    if (error) return [];
    return (data || []) as WarrantySubmission[];
  }

  async getAllWarrantySubmissions(limit = 100): Promise<WarrantySubmission[]> {
    if (!this.supabase) return [];
    const { data, error } = await this.supabase
      .from('warranty_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) return [];
    return (data || []) as WarrantySubmission[];
  }

  /** Fetch all warranty submissions in pages for exports/reports. */
  async getAllWarrantySubmissionsPaged(pageSize = 1000): Promise<WarrantySubmission[]> {
    if (!this.supabase) return [];
    const safePageSize = Math.max(1, Math.min(pageSize, 1000));
    const allRows: WarrantySubmission[] = [];
    let from = 0;

    while (true) {
      const to = from + safePageSize - 1;
      const { data, error } = await this.supabase
        .from('warranty_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) break;
      const rows = (data || []) as WarrantySubmission[];
      allRows.push(...rows);
      if (rows.length < safePageSize) break;
      from += safePageSize;
    }

    return allRows;
  }

  /**
   * Update an existing warranty submission by id.
   * Requires Supabase RLS to allow UPDATE for the authenticated admin (e.g. policy on profiles.role = 'admin').
   */
  async updateWarrantySubmission(id: string, data: Partial<WarrantySubmission>): Promise<{ success: boolean; error?: string }> {
    if (!this.supabase) return { success: false, error: 'Supabase is not configured.' };
    if (!id?.trim()) return { success: false, error: 'Submission id is required.' };
    const payload: Record<string, unknown> = {};
    const allowed = [
      'first_name', 'last_name', 'address', 'city', 'postal_code', 'phone', 'email',
      'device_type', 'device_model', 'serial_number', 'purchase_date', 'place_of_purchase',
      'city_of_purchase', 'fiscal_receipt_number', 'receipt_image_url'
    ] as const;
    for (const key of allowed) {
      if (key in data) payload[key] = (data as any)[key];
    }
    if (Object.keys(payload).length === 0) return { success: true };
    try {
      const { error } = await this.supabase
        .from('warranty_submissions')
        .update(payload)
        .eq('id', id);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || String(e) };
    }
  }

  /** Distinct device_model values from warranty submissions (for admin filter list) */
  async getDistinctWarrantyDeviceModels(limit = 2000): Promise<string[]> {
    if (!this.supabase) return [];
    const { data, error } = await this.supabase
      .from('warranty_submissions')
      .select('device_model')
      .limit(limit);
    if (error) return [];
    const set = new Set<string>();
    (data || []).forEach((row: any) => {
      const v = (row?.device_model || '').trim();
      if (v) set.add(v);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  }

  /** Filters for admin warranty search */
  async searchWarrantyWithFilters(filters: {
    serial?: string;
    email?: string;
    phone?: string;
    name?: string;
    device_model?: string;
    city?: string;
    city_of_purchase?: string;
    purchase_date_from?: string;
    purchase_date_to?: string;
    registered_from?: string;
    registered_to?: string;
  }, limit = 500): Promise<WarrantySubmission[]> {
    if (!this.supabase) return [];
    let query = this.supabase
      .from('warranty_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    const f = filters;
    if (f.serial?.trim()) query = query.ilike('serial_number', `%${f.serial.trim()}%`);
    if (f.email?.trim()) query = query.ilike('email', `%${f.email.trim()}%`);
    if (f.phone?.trim()) query = query.ilike('phone', `%${f.phone.trim()}%`);
    if (f.device_model?.trim()) query = query.ilike('device_model', `%${f.device_model.trim()}%`);
    if (f.city?.trim()) query = query.ilike('city', `%${f.city.trim()}%`);
    if (f.city_of_purchase?.trim()) query = query.ilike('city_of_purchase', `%${f.city_of_purchase.trim()}%`);
    if (f.purchase_date_from) query = query.gte('purchase_date', f.purchase_date_from);
    if (f.purchase_date_to) query = query.lte('purchase_date', f.purchase_date_to);
    if (f.registered_from) query = query.gte('created_at', f.registered_from);
    if (f.registered_to) query = query.lte('created_at', f.registered_to);
    const { data, error } = await query;
    if (error) return [];
    let list = (data || []) as WarrantySubmission[];
    if (f.name?.trim()) {
      const term = f.name.trim().toLowerCase();
      list = list.filter(row => {
        const first = (row.first_name || '').toLowerCase();
        const last = (row.last_name || '').toLowerCase();
        const full = (row.customer_name || `${first} ${last}`).toLowerCase();
        return first.includes(term) || last.includes(term) || full.includes(term);
      });
    }
    return list;
  }

  // ---- Auth ----
  async signIn(email: string, password: string): Promise<{ error?: string }> {
    if (!this.supabase) return { error: 'Supabase is not configured.' };
    const { error } = await this.supabase.auth.signInWithPassword({ email, password });
    return error ? { error: error.message } : {};
  }

  async signOut(): Promise<void> {
    if (this.supabase) await this.supabase.auth.signOut();
  }

  getCurrentUser(): User | null {
    return null;
  }

  authState() {
    return this.supabase?.auth?.onAuthStateChange ?? (() => ({ unsubscribe: () => {} }));
  }

  getSession() {
    if (!this.supabase) return Promise.resolve({ data: { session: null }, error: null });
    return this.supabase.auth.getSession();
  }

  /** Current user email (from session). Used to show Edit only to super admin. */
  async getCurrentUserEmail(): Promise<string | null> {
    const { data } = await this.getSession();
    return data?.session?.user?.email ?? null;
  }

  // Check if current user is admin (via profiles table)
  async isAdmin(): Promise<boolean> {
    if (!this.supabase) return false;
    const { data: { session } } = await this.supabase.auth.getSession();
    if (!session?.user) return false;
    const { data } = await this.supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();
    return data?.role === 'admin';
  }
}
