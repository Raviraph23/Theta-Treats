export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "cod";

export type PaymentMethod = "mock_upi" | "mock_card" | "cod";

export type ProductCategory = "brownie" | "cookie";

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          category: ProductCategory;
          name: string;
          description: string;
          image: string;
          tags: string[];
          pricing: Record<string, number>;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          category: ProductCategory;
          name: string;
          description: string;
          image: string;
          tags?: string[];
          pricing: Record<string, number>;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category?: ProductCategory;
          name?: string;
          description?: string;
          image?: string;
          tags?: string[];
          pricing?: Record<string, number>;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      customers: {
        Row: {
          id: string;
          phone: string;
          name: string;
          last_address: string | null;
          order_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          phone: string;
          name: string;
          last_address?: string | null;
          order_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          phone?: string;
          name?: string;
          last_address?: string | null;
          order_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_name: string;
          customer_phone: string;
          delivery_address: string;
          notes: string | null;
          whatsapp_consent: boolean;
          status: OrderStatus;
          payment_status: PaymentStatus;
          payment_method: PaymentMethod | null;
          payment_reference: string | null;
          paid_at: string | null;
          total: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          customer_name: string;
          customer_phone: string;
          delivery_address: string;
          notes?: string | null;
          whatsapp_consent?: boolean;
          status?: OrderStatus;
          payment_status?: PaymentStatus;
          payment_method?: PaymentMethod | null;
          payment_reference?: string | null;
          paid_at?: string | null;
          total: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          customer_name?: string;
          customer_phone?: string;
          delivery_address?: string;
          notes?: string | null;
          whatsapp_consent?: boolean;
          status?: OrderStatus;
          payment_status?: PaymentStatus;
          payment_method?: PaymentMethod | null;
          payment_reference?: string | null;
          paid_at?: string | null;
          total?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          product_name: string;
          variant: string;
          variant_label: string;
          quantity: number;
          unit_price: number;
          line_total: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          product_name: string;
          variant: string;
          variant_label: string;
          quantity: number;
          unit_price: number;
          line_total: number;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          product_name?: string;
          variant?: string;
          variant_label?: string;
          quantity?: number;
          unit_price?: number;
          line_total?: number;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      order_status: OrderStatus;
      payment_status: PaymentStatus;
      product_category: ProductCategory;
    };
  };
};

export type ProductRow = Database["public"]["Tables"]["products"]["Row"];
export type Customer = Database["public"]["Tables"]["customers"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];

export type OrderWithItems = Order & { order_items: OrderItem[] };
