// src/store/apis/authApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface UserResponse {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  token: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/api/users`,
    credentials: 'include',
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    login: builder.mutation<UserResponse, LoginCredentials>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    register: builder.mutation<UserResponse, RegisterData>({
      query: (userData) => ({
        url: '/',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    getUserProfile: builder.query<UserResponse, void>({
      query: () => ({
        url: '/profile',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      }),
      providesTags: ['User'],
    }),
    updateUserProfile: builder.mutation<UserResponse, Partial<UserResponse>>({
      query: (userData) => ({
        url: '/profile',
        method: 'PUT',
        body: userData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} = authApi;