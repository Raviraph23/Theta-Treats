export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "cod";

export type PaymentMethod = "mock_upi" | "mock_card" | "cod";

export type DeliverySlot = "morning" | "afternoon" | "evening";

export type ProductCategory = "brownie" | "cookie";

export type PromoDiscountType = "percent" | "fixed";

export type Database = {
  public: {
    Tables: {
      promo_codes: {
        Row: {
          id: string;
          code: string;
          discount_type: PromoDiscountType;
          discount_value: number;
          min_order: number;
          max_uses: number | null;
          use_count: number;
          is_active: boolean;
          expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          discount_type: PromoDiscountType;
          discount_value: number;
          min_order?: number;
          max_uses?: number | null;
          use_count?: number;
          is_active?: boolean;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          discount_type?: PromoDiscountType;
          discount_value?: number;
          min_order?: number;
          max_uses?: number | null;
          use_count?: number;
          is_active?: boolean;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      store_settings: {
        Row: {
          id: string;
          min_order_amount: number;
          free_delivery_threshold: number;
          default_delivery_fee: number;
          delivery_zones: unknown;
          updated_at: string;
        };
        Insert: {
          id?: string;
          min_order_amount?: number;
          free_delivery_threshold?: number;
          default_delivery_fee?: number;
          delivery_zones?: unknown;
          updated_at?: string;
        };
        Update: {
          id?: string;
          min_order_amount?: number;
          free_delivery_threshold?: number;
          default_delivery_fee?: number;
          delivery_zones?: unknown;
          updated_at?: string;
        };
        Relationships: [];
      };
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
          is_sold_out: boolean;
          daily_limit: number | null;
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
          is_sold_out?: boolean;
          daily_limit?: number | null;
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
          is_sold_out?: boolean;
          daily_limit?: number | null;
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
          delivery_date: string | null;
          delivery_slot: DeliverySlot | null;
          gift_message: string | null;
          occasion: string | null;
          whatsapp_consent: boolean;
          status: OrderStatus;
          payment_status: PaymentStatus;
          payment_method: PaymentMethod | null;
          payment_reference: string | null;
          paid_at: string | null;
          subtotal: number | null;
          discount_amount: number;
          delivery_fee: number;
          promo_code: string | null;
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
          delivery_date?: string | null;
          delivery_slot?: DeliverySlot | null;
          gift_message?: string | null;
          occasion?: string | null;
          whatsapp_consent?: boolean;
          status?: OrderStatus;
          payment_status?: PaymentStatus;
          payment_method?: PaymentMethod | null;
          payment_reference?: string | null;
          paid_at?: string | null;
          subtotal?: number | null;
          discount_amount?: number;
          delivery_fee?: number;
          promo_code?: string | null;
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
          delivery_date?: string | null;
          delivery_slot?: DeliverySlot | null;
          gift_message?: string | null;
          occasion?: string | null;
          whatsapp_consent?: boolean;
          status?: OrderStatus;
          payment_status?: PaymentStatus;
          payment_method?: PaymentMethod | null;
          payment_reference?: string | null;
          paid_at?: string | null;
          subtotal?: number | null;
          discount_amount?: number;
          delivery_fee?: number;
          promo_code?: string | null;
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
      promo_discount_type: PromoDiscountType;
    };
  };
};

export type ProductRow = Database["public"]["Tables"]["products"]["Row"];
export type PromoCodeRow = Database["public"]["Tables"]["promo_codes"]["Row"];
export type StoreSettingsRow = Database["public"]["Tables"]["store_settings"]["Row"];
export type Customer = Database["public"]["Tables"]["customers"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];

export type OrderWithItems = Order & { order_items: OrderItem[] };
