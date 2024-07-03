import { apiSlice } from './apiSlice';

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => '/api/cart',
      providesTags: ['Cart'],
    }),
    addItemToCart: builder.mutation({
      query: (item) => ({
        url: '/api/cart',
        method: 'POST',
        body: item,
      }),
      invalidatesTags: ['Cart'],
    }),
    removeItemFromCart: builder.mutation({
      query: (id) => ({
        url: `/api/cart/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddItemToCartMutation,
  useRemoveItemFromCartMutation,
} = cartApiSlice;
