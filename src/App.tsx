import { QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import { RouterProvider } from 'react-router-dom';
import { queryClient } from './app/queryClient';
import { router } from './app/router';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={{ token: { colorPrimary: '#1677ff' } }}>
        <RouterProvider router={router} />
      </ConfigProvider>
    </QueryClientProvider>
  );
}
