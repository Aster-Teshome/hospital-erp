import {
  BankOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { Card, Col, Progress, Row, Statistic, Typography } from 'antd';
import type { InpatientStats, Ward } from '../types';

interface WardOverviewCardsProps {
  wards: Ward[];
  stats?: InpatientStats;
  selectedWardId?: string;
  onSelectWard: (wardId?: string) => void;
}

export function WardOverviewCards({
  wards,
  stats,
  selectedWardId,
  onSelectWard,
}: WardOverviewCardsProps) {
  const occupancyRate = stats?.occupancyRate ?? 0;
  const occupancyColor =
    occupancyRate > 85 ? '#ef4444' : occupancyRate > 70 ? '#f59e0b' : '#10b981';

  return (
    <div style={{ marginBottom: 24 }}>
      {/* Top Level KPIs */}
      <Row gutter={[16, 16]} style={{ marginBottom: 18 }}>
        <Col xs={12} sm={6} lg={4}>
          <Card
            className="hover-lift"
            styles={{ body: { padding: '16px' } }}
            style={{ borderRadius: 14, border: '1px solid #e2e8f0', background: '#ffffff' }}
          >
            <Statistic
              title={<span style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>Total Ward Beds</span>}
              value={stats?.totalBeds ?? 0}
              prefix={<BankOutlined style={{ color: '#2563eb', marginRight: 6 }} />}
              styles={{ content: { fontWeight: 800, color: '#0f172a', fontSize: 24 } }}
            />
          </Card>
        </Col>

        <Col xs={12} sm={6} lg={5}>
          <Card
            className="hover-lift"
            styles={{ body: { padding: '16px' } }}
            style={{ borderRadius: 14, border: '1px solid #e2e8f0', background: '#ffffff' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Typography.Text style={{ fontSize: 12, fontWeight: 600, color: '#64748b', display: 'block' }}>
                  Ward Occupancy
                </Typography.Text>
                <Typography.Text style={{ fontSize: 24, fontWeight: 800, color: occupancyColor }}>
                  {occupancyRate}%
                </Typography.Text>
              </div>
              <Progress
                type="circle"
                percent={occupancyRate}
                size={44}
                strokeColor={occupancyColor}
                format={() => null}
              />
            </div>
          </Card>
        </Col>

        <Col xs={12} sm={6} lg={5}>
          <Card
            className="hover-lift"
            styles={{ body: { padding: '16px' } }}
            style={{ borderRadius: 14, border: '1px solid #e2e8f0', background: '#ffffff' }}
          >
            <Statistic
              title={<span style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>Available Beds</span>}
              value={stats?.availableBeds ?? 0}
              prefix={<CheckCircleOutlined style={{ color: '#10b981', marginRight: 6 }} />}
              styles={{ content: { fontWeight: 800, color: '#059669', fontSize: 24 } }}
            />
          </Card>
        </Col>

        <Col xs={12} sm={6} lg={5}>
          <Card
            className="hover-lift"
            styles={{ body: { padding: '16px' } }}
            style={{ borderRadius: 14, border: '1px solid #fecaca', background: '#fef2f2' }}
          >
            <Statistic
              title={<span style={{ fontSize: 12, fontWeight: 700, color: '#991b1b' }}>Critical / ICU Cases</span>}
              value={stats?.criticalCases ?? 0}
              prefix={<ExclamationCircleOutlined style={{ color: '#ef4444', marginRight: 6 }} />}
              styles={{ content: { fontWeight: 800, color: '#dc2626', fontSize: 24 } }}
            />
          </Card>
        </Col>

        <Col xs={12} sm={6} lg={5}>
          <Card
            className="hover-lift"
            styles={{ body: { padding: '16px' } }}
            style={{ borderRadius: 14, border: '1px solid #e2e8f0', background: '#ffffff' }}
          >
            <Statistic
              title={<span style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>Today's Admissions</span>}
              value={stats?.todayAdmissions ?? 0}
              prefix={<UserAddOutlined style={{ color: '#8b5cf6', marginRight: 6 }} />}
              styles={{ content: { fontWeight: 800, color: '#6d28d9', fontSize: 24 } }}
            />
          </Card>
        </Col>
      </Row>

      {/* Ward Cards Carousel / Grid */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <Typography.Title level={5} style={{ margin: 0, color: '#1e293b' }}>
          Hospital Wards & Units
        </Typography.Title>
        {selectedWardId && (
          <Typography.Link onClick={() => onSelectWard(undefined)} style={{ fontSize: 13 }}>
            Show All Wards
          </Typography.Link>
        )}
      </div>

      <Row gutter={[14, 14]}>
        {wards.map((ward) => {
          const isSelected = selectedWardId === ward.id;
          const wardPercent =
            ward.totalBeds > 0 ? Math.round((ward.occupiedBeds / ward.totalBeds) * 100) : 0;
          const progressColor =
            wardPercent > 85 ? '#ef4444' : wardPercent > 70 ? '#f59e0b' : '#10b981';

          return (
            <Col xs={24} sm={12} md={8} lg={4} key={ward.id}>
              <Card
                hoverable
                className="hover-lift"
                onClick={() => onSelectWard(isSelected ? undefined : ward.id)}
                styles={{ body: { padding: '14px' } }}
                style={{
                  borderRadius: 12,
                  border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  background: isSelected ? '#eff6ff' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 4px 14px rgba(37, 99, 235, 0.15)' : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography.Text strong style={{ fontSize: 13, color: '#0f172a' }}>
                    {ward.name.split('(')[0].trim()}
                  </Typography.Text>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '2px 6px',
                      background: '#f1f5f9',
                      borderRadius: 4,
                      color: '#475569',
                    }}
                  >
                    {ward.code}
                  </span>
                </div>

                <Typography.Text
                  type="secondary"
                  style={{ fontSize: 11, display: 'block', margin: '4px 0 8px 0' }}
                >
                  {ward.floor}
                </Typography.Text>

                <div style={{ marginTop: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: '#64748b' }}>Occupancy</span>
                    <strong style={{ color: '#1e293b' }}>
                      {ward.occupiedBeds} / {ward.totalBeds} beds
                    </strong>
                  </div>
                  <Progress percent={wardPercent} strokeColor={progressColor} size="small" showInfo={false} />
                </div>

                {ward.nurseInCharge && (
                  <div style={{ marginTop: 8, fontSize: 10, color: '#64748b' }}>
                    In-charge: <span style={{ color: '#334155', fontWeight: 500 }}>{ward.nurseInCharge}</span>
                  </div>
                )}
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}
