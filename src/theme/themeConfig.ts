import type { ThemeConfig } from 'antd';

export const aderaTheme: ThemeConfig = {
  token: {
    colorPrimary: '#136c64', // Deep medical teal from Adera Health design
    colorPrimaryHover: '#0f5851',
    colorPrimaryActive: '#0b423d',
    colorInfo: '#136c64',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    borderRadius: 12,
    fontFamily: `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
    colorBgLayout: '#f8faf9', // Soft subtle sage/mint background
    colorTextHeading: '#0f172a',
    colorText: '#334155',
    colorTextSecondary: '#64748b',
    colorBorder: '#e2e8f0',
  },
  components: {
    Button: {
      controlHeight: 48,
      borderRadius: 12,
      fontWeight: 600,
      fontSize: 15,
      primaryColor: '#ffffff',
    },
    Input: {
      controlHeight: 48,
      borderRadius: 12,
      colorBgContainer: '#ffffff',
      colorBorder: '#e2e8f0',
      activeBorderColor: '#136c64',
      hoverBorderColor: '#136c64',
      fontSize: 15,
    },
    Select: {
      controlHeight: 48,
      borderRadius: 12,
      fontSize: 14,
    },
    DatePicker: {
      controlHeight: 48,
      borderRadius: 12,
    },
    Card: {
      borderRadiusLG: 16,
      colorBgContainer: '#ffffff',
    },
    Table: {
      borderRadius: 12,
      headerBg: '#f1f5f4',
      headerColor: '#1e293b',
      rowHoverBg: '#f8faf9',
    },
    Modal: {
      borderRadiusLG: 16,
    },
  },
};
