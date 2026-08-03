export type Category = 'Makanan' | 'Minuman' | 'Dessert' | 'Snack' | 'Special';

export type Size = 'Small' | 'Medium' | 'Large';

export type Spiciness = 'Mild' | 'Medium' | 'Spicy' | 'Extra Spicy';

export type OrderStatus =
  | 'Menunggu Konfirmasi'
  | 'Diproses'
  | 'Sedang Dimasak'
  | 'Siap Diantar'
  | 'Sudah Diantar';

export type PaymentMethod =
  | 'QRIS'
  | 'E-Wallet'
  | 'Kartu Kredit'
  | 'Tunai'
  | 'Postpaid'
  | 'Split Bill';

export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: Category;
  rating: number;
  reviewsCount: number;
  isBestSeller: boolean;
  isPromo: boolean;
  isVegetarian: boolean;
  estimatedTime: number;
  stock: number;
  storeId: string;
  sizes?: Size[];
  spicinessLevels?: Spiciness[];
  addOns?: AddOn[];
  ingredients: string[];
}

export interface CartItemCustomization {
  size?: Size;
  spiciness?: Spiciness;
  addOns?: AddOn[];
  notes?: string;
}

export interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: Category;
  quantity: number;
  customization?: CartItemCustomization;
  totalPrice: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  customization?: CartItemCustomization;
  totalPrice: number;
  image: string;
}

export interface Order {
  id: string;
  tableNumber: string;
  storeId?: string;
  customerName?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  serviceCharge: number;
  total: number;
  paymentMethod: PaymentMethod;
  splitCount?: number;
  status: OrderStatus;
  createdAt: string;
  statusHistory: { status: OrderStatus; timestamp: string }[];
}

export interface WaiterRequest {
  id: string;
  type: 'Sendok' | 'Tisu' | 'Refill' | 'Bill' | 'Panggil Pelayan';
  orderId?: string;
  createdAt: string;
  status: 'Pending' | 'Received';
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface OrderHistoryItem {
  order: Order;
  reorderAvailable: boolean;
}

export interface AppSettings {
  tableNumber: string;
  storeId: string;
}