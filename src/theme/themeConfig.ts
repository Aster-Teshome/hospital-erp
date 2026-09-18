import type { ThemeConfig } from 'antd';

export const aderaTheme: ThemeConfig = {
  token: {
    // Primary Clinical Sapphire / Surgical Cyan
    colorPrimary: '#0284c7', // Sapphire Blue
    colorPrimaryHover: '#0369a1',
    colorPrimaryActive: '#075985',
    colorInfo: '#0284c7',
    colorSuccess: '#10b981', // Crisp Emerald
    colorWarning: '#f59e0b', // Amber Triage
    colorError: '#ef4444', // Rose Red
    borderRadius: 10,
    fontFamily: `'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
    colorBgLayout: '#f8fafc', // Clean clinical canvas
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
      primaryShadow: '0 2px 8px 0 rgba(2, 132, 199, 0.25)',
    },
    Input: {
      controlHeight: 40,
      borderRadius: 8,
      colorBgContainer: '#ffffff',
      colorBorder: '#cbd5e1',
      activeBorderColor: '#0284c7',
      hoverBorderColor: '#0284c7',
      activeShadow: '0 0 0 3px rgba(2, 132, 199, 0.15)',
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
      colorBorderSecondary: '#e2e8f0',
      boxShadowTertiary: '0 4px 16px -2px rgba(15, 23, 42, 0.04), 0 1px 3px 0 rgba(15, 23, 42, 0.03)',
    },
    Table: {
      borderRadius: 12,
      headerBg: '#f8fafc',
      headerColor: '#334155',
      headerSplitColor: 'transparent',
      rowHoverBg: '#f0f9ff',
      borderColor: '#f1f5f9',
      cellPaddingBlock: 12,
      cellPaddingInline: 14,
      fontSize: 13,
    },
    Modal: {
      borderRadiusLG: 16,
      headerBg: '#ffffff',
      boxShadow: '0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.05)',
    },
    Drawer: {
      borderRadiusLG: 16,
      boxShadow: '-4px 0 24px -2px rgba(15, 23, 42, 0.08)',
    },
    Tabs: {
      itemSelectedColor: '#0284c7',
      inkBarColor: '#0284c7',
      itemHoverColor: '#0369a1',
      titleFontSize: 13,
      horizontalItemPadding: '10px 16px',
    },
    Tag: {
      borderRadiusSM: 6,
      fontSize: 12,
    },
    Badge: {
      fontSize: 11,
      indicatorHeight: 18,
    },
    Menu: {
      itemBorderRadius: 8,
      itemMarginInline: 8,
      itemSelectedColor: '#38bdf8',
      itemSelectedBg: 'rgba(56, 189, 248, 0.12)',
      itemHoverBg: 'rgba(255, 255, 255, 0.06)',
      itemColor: '#94a3b8',
    },
  },
};

