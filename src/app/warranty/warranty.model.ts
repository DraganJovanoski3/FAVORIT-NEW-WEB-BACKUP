export interface WarrantySubmission {
  id?: string;
  first_name: string;
  last_name: string;
  address: string;
  city: string;
  postal_code: string;
  phone: string;
  email: string;
  device_type: string;
  device_model: string;
  serial_number: string;
  purchase_date: string;
  place_of_purchase: string;
  city_of_purchase: string;
  fiscal_receipt_number: string;
  terms_accepted: boolean;
  receipt_image_url?: string;
  created_at?: string;
  /** Legacy fields (old DB rows) */
  customer_name?: string;
  product_name?: string;
  purchase_place?: string;
}

export interface AdminProfile {
  id: string;
  email: string;
  role: 'admin' | 'user';
}
