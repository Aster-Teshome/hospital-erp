import type { ThemeConfig } from 'antd';

export const aderaTheme: ThemeConfig = {
  token: {
    // Primary Clinical Sapphire / Royal Slate - modern, trustworthy, high-end
    colorPrimary: '#0284c7', // Sky-Blue/Sapphire
    colorPrimaryHover: '#0369a1',
    colorPrimaryActive: '#075985',
    colorInfo: '#0284c7',
    colorSuccess: '#10b981', // Crisp Emerald
    colorWarning: '#f59e0b', // Amber Triage
    colorError: '#ef4444', // Rose Red
    borderRadius: 10,
    fontFamily: `'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
    colorBgLayout: '#f8fafc', // Clean clinical slate canvas
    colorTextHeading: '#0f172a',
    colorText: '#1e293b',
    colorTextSecondary: '#64748b',
    colorBorder: '#e2e8f0',
    colorBorderSecondary: '#f1f5f9',
  },
  components: {
    Button: {
      controlHeight: 38,
      borderRadius: 8,
      fontWeight: 600,
      fontSize: 13,
      boxShadow: 'none',
      primaryShadow: '0 2px 4px 0 rgba(2, 132, 199, 0.16)',
    },
    Input: {
      controlHeight: 40,
      borderRadius: 8,
      colorBgContainer: '#ffffff',
      colorBorder: '#cbd5e1',
      activeBorderColor: '#0284c7',
      hoverBorderColor: '#0284c7',
      fontSize: 13,
    },
    Select: {
      controlHeight: 40,
      borderRadius: 8,
      fontSize: 13,
    },
    DatePicker: {
      controlHeight: 40,
      borderRadius: 8,
    },
    Card: {
      borderRadiusLG: 14,
      colorBgContainer: '#ffffff',
      boxShadowTertiary: '0 1px 3px 0 rgba(0, 0, 0, 0.03), 0 1px 2px -1px rgba(0, 0, 0, 0.03)',
    },
    Table: {
      borderRadius: 12,
      headerBg: '#f8fafc',
      headerColor: '#475569',
      headerSplitColor: 'transparent',
      rowHoverBg: '#f8fafc',
      borderColor: '#f1f5f9',
      cellPaddingBlock: 12,
      cellPaddingInline: 12,
      fontSize: 13,
    },
    Modal: {
      borderRadiusLG: 16,
      headerBg: '#ffffff',
    },
    Drawer: {
      borderRadiusLG: 16,
    },
    Tabs: {
      itemSelectedColor: '#0284c7',
      inkBarColor: '#0284c7',
      itemHoverColor: '#0369a1',
      titleFontSize: 13,
    },
    Tag: {
      borderRadiusSM: 6,
      fontSize: 12,
    },
    Badge: {
      fontSize: 11,
      indicatorHeight: 18,
    },
  },
};

