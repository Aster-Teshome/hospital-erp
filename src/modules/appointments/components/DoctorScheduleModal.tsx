import { useState } from 'react';
import { Button, Form, Modal, Select, Switch, Table, TimePicker, message } from 'antd';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import type { DoctorSchedule } from '../types';
import { useDoctorSchedules, useSaveDoctorSchedule } from '../hooks/appointments.hooks';

interface DoctorScheduleModalProps {
  open: boolean;
  onClose: () => void;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function DoctorScheduleModal({ open, onClose }: DoctorScheduleModalProps) {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('doc-1');
  const { data: schedules = [], isLoading } = useDoctorSchedules(selectedDoctorId);
  const saveMutation = useSaveDoctorSchedule();

  const [form] = Form.useForm();

  const columns: ColumnsType<DoctorSchedule> = [
    {
      title: 'Day',
      dataIndex: 'dayOfWeek',
      key: 'dayOfWeek',
      render: (day: number) => DAYS[day] ?? day,
    },
    {
      title: 'Hours',
      key: 'hours',
      render: (_, record) => `${record.startTime} - ${record.endTime}`,
    },
    {
      title: 'Slot (Mins)',
      dataIndex: 'slotDurationMinutes',
      key: 'slotDurationMinutes',
      render: (mins: number) => `${mins} min`,
    },
    {
      title: 'Status',
      dataIndex: 'isAvailable',
      key: 'isAvailable',
      render: (available: boolean) => (available ? 'Active' : 'Off'),
    },
  ];

  function handleSaveSlot(values: {
    dayOfWeek: number;
    timeRange: [dayjs.Dayjs, dayjs.Dayjs];
    slotDurationMinutes: number;
    isAvailable: boolean;
  }) {
    const [start, end] = values.timeRange;
    saveMutation.mutate(
      {
        doctorId: selectedDoctorId,
        dayOfWeek: values.dayOfWeek,
        startTime: start.format('HH:mm'),
        endTime: end.format('HH:mm'),
        slotDurationMinutes: values.slotDurationMinutes,
        isAvailable: values.isAvailable ?? true,
      },
      {
        onSuccess: () => {
          message.success('Doctor schedule saved successfully');
          form.resetFields();
        },
        onError: () => {
          message.error('Failed to save schedule');
        },
      },
    );
  }

  return (
    <Modal
      centered
      title="Doctor Working Schedules & Slots"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
      width={700}
    >
      <div style={{ marginBottom: 16 }}>
        <span style={{ marginRight: 8, fontWeight: 500 }}>Select Doctor:</span>
        <Select
          value={selectedDoctorId}
          onChange={setSelectedDoctorId}
          style={{ width: 280 }}
          options={[
            { value: 'doc-1', label: 'Dr. Abebe Kebede (Internal Med)' },
            { value: 'doc-2', label: 'Dr. Sara Tesfaye (Pediatrics)' },
            { value: 'doc-3', label: 'Dr. Daniel Haile (General Surgery)' },
            { value: 'doc-4', label: 'Dr. Tigist Mengistu (Gynecology)' },
          ]}
        />
      </div>

      <Table<DoctorSchedule>
        rowKey="id"
        columns={columns}
        dataSource={schedules}
        loading={isLoading}
        pagination={false}
        size="small"
        style={{ marginBottom: 24 }}
        locale={{ emptyText: 'No working slots configured for this doctor yet.' }}
      />

      <h4>Add / Configure Working Slot</h4>
      <Form
        form={form}
        layout="inline"
        onFinish={handleSaveSlot}
        initialValues={{
          dayOfWeek: 1,
          slotDurationMinutes: 30,
          isAvailable: true,
        }}
      >
        <Form.Item name="dayOfWeek" label="Day" rules={[{ required: true }]}>
          <Select
            style={{ width: 120 }}
            options={DAYS.map((name, index) => ({ value: index, label: name }))}
          />
        </Form.Item>

        <Form.Item
          name="timeRange"
          label="Shift Hours"
          rules={[{ required: true, message: 'Please select shift hours' }]}
        >
          <TimePicker.RangePicker format="HH:mm" minuteStep={15} />
        </Form.Item>

        <Form.Item name="slotDurationMinutes" label="Slot">
          <Select
            style={{ width: 90 }}
            options={[
              { value: 15, label: '15m' },
              { value: 20, label: '20m' },
              { value: 30, label: '30m' },
              { value: 45, label: '45m' },
              { value: 60, label: '60m' },
            ]}
          />
        </Form.Item>

        <Form.Item name="isAvailable" valuePropName="checked">
          <Switch checkedChildren="On" unCheckedChildren="Off" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={saveMutation.isPending}>
            Add Slot
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
