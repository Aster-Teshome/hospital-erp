import { QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import { RouterProvider } from 'react-router-dom';
import { queryClient } from './app/queryClient';
import { router } from './app/router';
import { aderaTheme } from './theme/themeConfig';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={aderaTheme}>
        <RouterProvider router={router} />
      </ConfigProvider>
    </QueryClientProvider>
  );
}
