import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  DeleteOutlined,
  ExperimentOutlined,
  MedicineBoxOutlined,
  PlusOutlined,
  ShareAltOutlined,
  SolutionOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Tabs,
  Typography,
  message,
} from 'antd';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import type { OpdVisit } from '../types';
import { consultationSchema, type ConsultationInput } from '../outpatient.validation';
import { useSaveConsultation } from '../hooks/outpatient.hooks';
import { extractErrorMessage } from '../../../utils/extractErrorMessage';

interface ConsultationModalProps {
  open: boolean;
  visit: OpdVisit | null;
  onClose: () => void;
}

export function ConsultationModal({ open, visit, onClose }: ConsultationModalProps) {
  const [activeTab, setActiveTab] = useState('notes');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const saveMutation = useSaveConsultation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ConsultationInput>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      chiefComplaint: '',
      historyOfPresentIllness: '',
      physicalExamination: '',
      primaryDiagnosis: '',
      secondaryDiagnosis: '',
      treatmentPlan: '',
      prescriptions: [
        {
          medicationName: 'Amoxicillin 500mg',
          dosage: '500mg',
          frequency: 'TID (Three times daily)',
          duration: '5 days',
          route: 'Oral',
          instructions: 'Take after meals',
        },
      ],
      labOrders: [],
    },
  });

  const {
    fields: prescriptionFields,
    append: appendPrescription,
    remove: removePrescription,
  } = useFieldArray({
    control,
    name: 'prescriptions',
  });

  const {
    fields: labOrderFields,
    append: appendLabOrder,
    remove: removeLabOrder,
  } = useFieldArray({
    control,
    name: 'labOrders',
  });

  function handleFormSubmit(values: ConsultationInput) {
    if (!visit) return;
    setSubmitError(null);
    saveMutation.mutate(
      { visitId: visit.id, consultation: values },
      {
        onSuccess: () => {
          message.success('Clinical consultation completed & records saved!');
          reset();
          onClose();
        },
        onError: (err) => {
          setSubmitError(extractErrorMessage(err) ?? 'Failed to save consultation');
        },
      },
    );
  }

  function handleCancel() {
    reset();
    setSubmitError(null);
    onClose();
  }

  const tabViewportStyle = {
    height: 440,
    overflowY: 'auto' as const,
    padding: '12px 8px 8px 2px',
  };

  return (
    <Modal
      centered
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: '#e0f2fe',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SolutionOutlined style={{ fontSize: 18 }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#0f172a' }}>
              Doctor Consultation Encounter
            </div>
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 400 }}>
              Patient: <span style={{ fontWeight: 600, color: '#0f172a' }}>{visit?.patientName}</span> ({visit?.patientMrn})
            </div>
          </div>
        </div>
      }
      open={open}
      onOk={handleSubmit(handleFormSubmit)}
      onCancel={handleCancel}
      confirmLoading={saveMutation.isPending}
      okText="Finalize Encounter"
      width={900}
      destroyOnHidden
    >
      {submitError && (
        <Alert
          type="error"
          showIcon
          message="Consultation Error"
          description={submitError}
          style={{ marginBottom: 14 }}
        />
      )}

      {/* Patient Encounter & Vitals Summary Banner */}
      {visit && (
        <Card
          size="small"
          style={{
            marginBottom: 16,
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 10,
          }}
        >
          <Descriptions size="small" column={{ xs: 2, sm: 4 }}>
            <Descriptions.Item label={<span style={{ fontWeight: 600 }}>MRN</span>}>
              {visit.patientMrn}
            </Descriptions.Item>
            <Descriptions.Item label={<span style={{ fontWeight: 600 }}>Temp</span>}>
              {visit.vitals?.temperature ? `${visit.vitals.temperature} °C` : 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label={<span style={{ fontWeight: 600 }}>BP</span>}>
              {visit.vitals?.bloodPressureSystolic && visit.vitals?.bloodPressureDiastolic
                ? `${visit.vitals.bloodPressureSystolic}/${visit.vitals.bloodPressureDiastolic} mmHg`
                : 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label={<span style={{ fontWeight: 600 }}>Pulse / SpO2</span>}>
              {visit.vitals?.heartRate ? `${visit.vitals.heartRate} bpm` : 'N/A'} /{' '}
              {visit.vitals?.spO2 ? `${visit.vitals.spO2}%` : 'N/A'}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      {/* Single Unified Form Wrapping All Tabs */}
      <Form layout="vertical">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          type="line"
          tabBarStyle={{ marginBottom: 12, borderBottom: '1px solid #e2e8f0' }}
          items={[
            {
              key: 'notes',
              label: (
                <span style={{ fontWeight: 500 }}>
                  <SolutionOutlined style={{ marginRight: 6 }} /> Clinical Notes & Diagnosis
                </span>
              ),
              children: (
                <div style={tabViewportStyle}>
                  <Form.Item
                    label={<span style={{ fontWeight: 600, color: '#1e293b' }}>Chief Complaint</span>}
                    validateStatus={errors.chiefComplaint ? 'error' : ''}
                    help={errors.chiefComplaint?.message}
                    required
                  >
                    <Controller
                      name="chiefComplaint"
                      control={control}
                      render={({ field }) => (
                        <Input {...field} placeholder="e.g. Severe headache, fever for 3 days" />
                      )}
                    />
                  </Form.Item>

                  <Form.Item label={<span style={{ fontWeight: 600, color: '#1e293b' }}>History of Present Illness (HPI)</span>}>
                    <Controller
                      name="historyOfPresentIllness"
                      control={control}
                      render={({ field }) => (
                        <Input.TextArea
                          {...field}
                          rows={2}
                          placeholder="Onset, duration, progression, aggravating/relieving factors..."
                        />
                      )}
                    />
                  </Form.Item>

                  <Form.Item label={<span style={{ fontWeight: 600, color: '#1e293b' }}>Physical Examination Findings</span>}>
                    <Controller
                      name="physicalExamination"
                      control={control}
                      render={({ field }) => (
                        <Input.TextArea
                          {...field}
                          rows={2}
                          placeholder="General appearance, chest auscultation, abdomen, neurological..."
                        />
                      )}
                    />
                  </Form.Item>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label={<span style={{ fontWeight: 600, color: '#1e293b' }}>Primary Diagnosis</span>}
                        validateStatus={errors.primaryDiagnosis ? 'error' : ''}
                        help={errors.primaryDiagnosis?.message}
                        required
                      >
                        <Controller
                          name="primaryDiagnosis"
                          control={control}
                          render={({ field }) => (
                            <Input {...field} placeholder="e.g. Acute Bronchitis (J20.9)" />
                          )}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item label={<span style={{ fontWeight: 600, color: '#1e293b' }}>Secondary Diagnosis / Comorbidities</span>}>
                        <Controller
                          name="secondaryDiagnosis"
                          control={control}
                          render={({ field }) => (
                            <Input {...field} placeholder="e.g. Essential Hypertension (I10)" />
                          )}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    label={<span style={{ fontWeight: 600, color: '#1e293b' }}>Treatment & Management Plan</span>}
                    validateStatus={errors.treatmentPlan ? 'error' : ''}
                    help={errors.treatmentPlan?.message}
                    required
                  >
                    <Controller
                      name="treatmentPlan"
                      control={control}
                      render={({ field }) => (
                        <Input.TextArea
                          {...field}
                          rows={2}
                          placeholder="Patient counseling, lifestyle advice, rest, warning signs..."
                        />
                      )}
                    />
                  </Form.Item>
                </div>
              ),
            },
            {
              key: 'prescriptions',
              label: (
                <Space size={6}>
                  <MedicineBoxOutlined />
                  <span style={{ fontWeight: 500 }}>Prescriptions</span>
                  <Badge
                    count={prescriptionFields.length}
                    style={{ backgroundColor: '#0284c7', fontSize: 11 }}
                  />
                </Space>
              ),
              children: (
                <div style={tabViewportStyle}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 16,
                    }}
                  >
                    <div>
                      <Typography.Text strong style={{ display: 'block', color: '#0f172a' }}>
                        Pharmacy Medication Orders
                      </Typography.Text>
                      <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                        Directly forwarded to the hospital dispensary queue upon encounter completion.
                      </Typography.Text>
                    </div>

                    <Button
                      type="primary"
                      ghost
                      icon={<PlusOutlined />}
                      onClick={() =>
                        appendPrescription({
                          medicationName: '',
                          dosage: '',
                          frequency: 'TID (Three times daily)',
                          duration: '7 days',
                          route: 'Oral',
                          instructions: '',
                        })
                      }
                    >
                      Add Medication
                    </Button>
                  </div>

                  {prescriptionFields.map((item, index) => (
                    <Card
                      key={item.id}
                      size="small"
                      style={{
                        marginBottom: 12,
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: 10,
                      }}
                    >
                      <Row gutter={12} align="middle">
                        <Col span={8}>
                          <Form.Item label="Medication" style={{ marginBottom: 4 }} required>
                            <Controller
                              name={`prescriptions.${index}.medicationName`}
                              control={control}
                              render={({ field }) => (
                                <Input {...field} placeholder="e.g. Paracetamol 500mg" />
                              )}
                            />
                          </Form.Item>
                        </Col>

                        <Col span={4}>
                          <Form.Item label="Dosage" style={{ marginBottom: 4 }} required>
                            <Controller
                              name={`prescriptions.${index}.dosage`}
                              control={control}
                              render={({ field }) => <Input {...field} placeholder="e.g. 500mg" />}
                            />
                          </Form.Item>
                        </Col>

                        <Col span={5}>
                          <Form.Item label="Frequency" style={{ marginBottom: 4 }} required>
                            <Controller
                              name={`prescriptions.${index}.frequency`}
                              control={control}
                              render={({ field }) => (
                                <Select
                                  {...field}
                                  options={[
                                    { value: 'Once daily', label: 'Once daily (OD)' },
                                    { value: 'BID (Twice daily)', label: 'Twice daily (BID)' },
                                    { value: 'TID (Three times daily)', label: '3x daily (TID)' },
                                    { value: 'QID (Four times daily)', label: '4x daily (QID)' },
                                    { value: 'PRN (As needed)', label: 'As needed (PRN)' },
                                  ]}
                                />
                              )}
                            />
                          </Form.Item>
                        </Col>

                        <Col span={5}>
                          <Form.Item label="Duration" style={{ marginBottom: 4 }} required>
                            <Controller
                              name={`prescriptions.${index}.duration`}
                              control={control}
                              render={({ field }) => <Input {...field} placeholder="e.g. 5 days" />}
                            />
                          </Form.Item>
                        </Col>

                        <Col span={2} style={{ textAlign: 'center', paddingTop: 20 }}>
                          <Button
                            danger
                            type="text"
                            icon={<DeleteOutlined />}
                            onClick={() => removePrescription(index)}
                          />
                        </Col>
                      </Row>
                    </Card>
                  ))}

                  {prescriptionFields.length === 0 && (
                    <div
                      style={{
                        textAlign: 'center',
                        padding: 40,
                        border: '1px dashed #cbd5e1',
                        borderRadius: 10,
                        color: '#64748b',
                      }}
                    >
                      <MedicineBoxOutlined style={{ fontSize: 32, color: '#cbd5e1', marginBottom: 8 }} />
                      <div>No medications prescribed. Click "+ Add Medication" to prescribe.</div>
                    </div>
                  )}
                </div>
              ),
            },
            {
              key: 'labOrders',
              label: (
                <Space size={6}>
                  <ExperimentOutlined />
                  <span style={{ fontWeight: 500 }}>Lab Orders</span>
                  <Badge
                    count={labOrderFields.length}
                    style={{ backgroundColor: '#0284c7', fontSize: 11 }}
                  />
                </Space>
              ),
              children: (
                <div style={tabViewportStyle}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 16,
                    }}
                  >
                    <div>
                      <Typography.Text strong style={{ display: 'block', color: '#0f172a' }}>
                        Diagnostic Laboratory Investigations
                      </Typography.Text>
                      <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                        Directly dispatched to the Laboratory department queue.
                      </Typography.Text>
                    </div>

                    <Button
                      type="primary"
                      ghost
                      icon={<PlusOutlined />}
                      onClick={() =>
                        appendLabOrder({
                          testName: '',
                          category: 'Hematology',
                          urgency: 'routine',
                          clinicalNotes: '',
                        })
                      }
                    >
                      Add Lab Test
                    </Button>
                  </div>

                  {labOrderFields.map((item, index) => (
                    <Card
                      key={item.id}
                      size="small"
                      style={{
                        marginBottom: 12,
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: 10,
                      }}
                    >
                      <Row gutter={12} align="middle">
                        <Col span={11}>
                          <Form.Item label="Investigation / Test" style={{ marginBottom: 4 }} required>
                            <Controller
                              name={`labOrders.${index}.testName`}
                              control={control}
                              render={({ field }) => (
                                <Select
                                  {...field}
                                  showSearch
                                  placeholder="Select test"
                                  options={[
                                    { value: 'Complete Blood Count (CBC)', label: 'Complete Blood Count (CBC)' },
                                    { value: 'Blood Glucose (FBS/RBS)', label: 'Blood Glucose (FBS/RBS)' },
                                    { value: 'Lipid Profile', label: 'Lipid Profile' },
                                    { value: 'Renal Function Test (RFT)', label: 'Renal Function Test (RFT)' },
                                    { value: 'Liver Function Test (LFT)', label: 'Liver Function Test (LFT)' },
                                    { value: 'Urinalysis (U/A)', label: 'Urinalysis (U/A)' },
                                    { value: 'Malaria Rapid Test', label: 'Malaria Rapid Test' },
                                    { value: 'Chest X-Ray', label: 'Chest X-Ray' },
                                  ]}
                                />
                              )}
                            />
                          </Form.Item>
                        </Col>

                        <Col span={6}>
                          <Form.Item label="Priority / Urgency" style={{ marginBottom: 4 }}>
                            <Controller
                              name={`labOrders.${index}.urgency`}
                              control={control}
                              render={({ field }) => (
                                <Select
                                  {...field}
                                  options={[
                                    { value: 'routine', label: 'Routine' },
                                    { value: 'urgent', label: 'Urgent' },
                                    { value: 'stat', label: 'STAT (Emergency)' },
                                  ]}
                                />
                              )}
                            />
                          </Form.Item>
                        </Col>

                        <Col span={5}>
                          <Form.Item label="Category" style={{ marginBottom: 4 }}>
                            <Controller
                              name={`labOrders.${index}.category`}
                              control={control}
                              render={({ field }) => <Input {...field} placeholder="Category" />}
                            />
                          </Form.Item>
                        </Col>

                        <Col span={2} style={{ textAlign: 'center', paddingTop: 20 }}>
                          <Button
                            danger
                            type="text"
                            icon={<DeleteOutlined />}
                            onClick={() => removeLabOrder(index)}
                          />
                        </Col>
                      </Row>
                    </Card>
                  ))}

                  {labOrderFields.length === 0 && (
                    <div
                      style={{
                        textAlign: 'center',
                        padding: 40,
                        border: '1px dashed #cbd5e1',
                        borderRadius: 10,
                        color: '#64748b',
                      }}
                    >
                      <ExperimentOutlined style={{ fontSize: 32, color: '#cbd5e1', marginBottom: 8 }} />
                      <div>No diagnostic tests ordered. Click "+ Add Lab Test" if required.</div>
                    </div>
                  )}
                </div>
              ),
            },
            {
              key: 'referral',
              label: (
                <span style={{ fontWeight: 500 }}>
                  <ShareAltOutlined style={{ marginRight: 6 }} /> Referral
                </span>
              ),
              children: (
                <div style={tabViewportStyle}>
                  <Form.Item label={<span style={{ fontWeight: 600, color: '#1e293b' }}>Destination Facility / Specialized Department</span>}>
                    <Controller
                      name="referral.departmentOrFacility"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="e.g. Cardiology Unit / Tikur Anbessa Specialized Hospital"
                        />
                      )}
                    />
                  </Form.Item>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label={<span style={{ fontWeight: 600, color: '#1e293b' }}>Referral Priority</span>}>
                        <Controller
                          name="referral.urgency"
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={[
                                { value: 'routine', label: 'Routine Transfer' },
                                { value: 'urgent', label: 'Urgent Referral' },
                              ]}
                            />
                          )}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item label={<span style={{ fontWeight: 600, color: '#1e293b' }}>Reason for Referral & Clinical Summary</span>}>
                    <Controller
                      name="referral.reason"
                      control={control}
                      render={({ field }) => (
                        <Input.TextArea
                          {...field}
                          rows={3}
                          placeholder="Provide clinical rationale for referral and specialized interventions needed..."
                        />
                      )}
                    />
                  </Form.Item>
                </div>
              ),
            },
          ]}
        />
      </Form>
    </Modal>
  );
}
