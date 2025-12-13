export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  sellingPrice: number;
  brand: string;
  imageUrl: string;
  images: string[];
}

export interface OrderItem {
  id: number;
  product: Product;
  size: string;
  quantity: number;
  mrpPrice: number;
  sellingPrice: number;
}

export interface Address {
  id: number;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export interface PaymentDetails {
  paymentStatus: string;
  paymentId: string;
  paymentDate: string;
}

export interface Order {
  id: number;
  orderId: string;
  sellerId: number;
  orderItems: OrderItem[];
  shippingAddress: Address;
  paymentDetails: PaymentDetails;
  totalMrpPrice: number;
  totalSellingPrice: number;
  discount: number;
  orderStatus: string;
  totalItem: number;
  paymentStatus: string;
  orderDate: string;
  deliverDate: string;
}
