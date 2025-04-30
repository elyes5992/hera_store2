// src/store/apis/ordersApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define types for order-related data
interface TotalRevenueResponse {
  totalRevenue: number;
}

interface TotalOrdersCountResponse {
  totalOrders: number;
}


interface OrderItem {
  _id: string;
  name: string;
  qty: number;
  image: string;
  price: number;
  product: string;
}

interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

interface OrdersResponse {
  orders: Order[];
  page: number;
  pages: number;
  total: number;
}

interface OrderStatsResponse {
  totalRevenue: number;
  weeklyRevenue: Array<{
    _id: string;
    revenue: number;
    count: number;
  }>;
  ordersByStatus: Array<{
    _id: string;
    count: number;
  }>;
  recentOrders: Order[];
}

interface OrderFilters {
  pageNumber?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  customer?: string;
  orderId?: string;
}

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/api`,
    prepareHeaders: (headers) => {
      // Add authorization header with admin token
      const token = localStorage.getItem('adminToken');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Order', 'OrderStats', 'TotalRevenue','TotalOrdersCount'],
  endpoints: (builder) => ({
    // Get all orders with optional filters
    getOrders: builder.query<OrdersResponse, OrderFilters | void>({
      query: (filters) => {
        // Handle case when filters is undefined
        const actualFilters: OrderFilters = filters || {};
        const queryParams = new URLSearchParams();
        
        if (actualFilters.pageNumber) {
          queryParams.append('pageNumber', actualFilters.pageNumber.toString());
        }
        if (actualFilters.status) {
          queryParams.append('status', actualFilters.status);
        }
        if (actualFilters.startDate) {
          queryParams.append('startDate', actualFilters.startDate);
        }
        if (actualFilters.endDate) {
          queryParams.append('endDate', actualFilters.endDate);
        }
        if (actualFilters.customer) {
          queryParams.append('customer', actualFilters.customer);
        }
        if (actualFilters.orderId) {
          queryParams.append('orderId', actualFilters.orderId);
        }
        
        return {
          url: `/orders?${queryParams.toString()}`,
        };
      },
      providesTags: ['Order'],
    }),
    
    // Get single order by ID
    getOrderById: builder.query<Order, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Order', id }],
    }),
    
    // Update order status
    updateOrderStatus: builder.mutation<Order, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Order', id },
        'Order',
        'OrderStats',
        'TotalOrdersCount', 
        
      ],
    }),
    
    // Update order to delivered
    updateOrderToDelivered: builder.mutation<Order, string>({
      query: (id) => ({
        url: `/orders/${id}/deliver`,
        method: 'PUT',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Order', id },
        'Order',
        'OrderStats',
        'TotalOrdersCount', 
      ],
    }),
    
    // Delete order
    deleteOrder: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/orders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Order', 'OrderStats', 'TotalOrdersCount'], // Invalidate all orders and stats
    }),
    

     // --- ADD NEW MUTATION for toggling paid status ---
    toggleOrderPaidStatus: builder.mutation<Order, string>({ // Takes order ID (string), returns updated Order
      query: (id) => ({
        url: `/orders/${id}/togglepaid`, // Matches the new backend route
        method: 'PUT',
        // No body needed for simple toggle
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Order', id }, // Invalidate the specific order tag
        { type: 'Order', id: 'LIST' }, // Invalidate the list tag to refresh tables
        'OrderStats', 
        'TotalOrdersCount', // Invalidate stats because totalRevenue changes
      ],
    }),
    
    // Get order statistics for dashboard
    getOrderStats: builder.query<OrderStatsResponse, void>({
      query: () => '/orders/stats',
      providesTags: ['OrderStats'],



    }),

    getTotalRevenue: builder.query<TotalRevenueResponse, void>({
      query: () => '/orders/stats/total-revenue', // Target the new backend route
      providesTags: ['TotalRevenue', 'OrderStats'], // Provide tags
    }),

    getTotalOrdersCount: builder.query<TotalOrdersCountResponse, void>({
      query: () => ({
        url: '/orders/count/total', // Path relative to baseUrl, matching backend route
      }),
      // Provide a tag. If any mutation invalidates 'Order', this query might refetch.
      // Or use a specific tag 'TotalOrdersCount' if needed.
      providesTags: ['Order', 'TotalOrdersCount'],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useUpdateOrderToDeliveredMutation,
  useDeleteOrderMutation,
  useToggleOrderPaidStatusMutation,
  useGetOrderStatsQuery,
  useGetTotalRevenueQuery,
  useGetTotalOrdersCountQuery,
} = ordersApi;