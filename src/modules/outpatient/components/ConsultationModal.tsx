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

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <SolutionOutlined style={{ color: '#136c64', fontSize: 20 }} />
          <span>Doctor Consultation - {visit?.patientName}</span>
        </div>
      }
      open={open}
      onOk={handleSubmit(handleFormSubmit)}
      onCancel={handleCancel}
      confirmLoading={saveMutation.isPending}
      okText="Finalize Consultation"
      width={850}
      destroyOnClose
    >
      {submitError && (
        <Alert
          type="error"
          showIcon
          message="Consultation Error"
          description={submitError}
          style={{ marginBottom: 16 }}
        />
      )}

      {/* Patient Encounter & Vitals Summary Banner */}
      {visit && (
        <Card size="small" style={{ marginBottom: 16, background: '#f8faf9', borderColor: '#e2e8f0' }}>
          <Descriptions size="small" column={{ xs: 2, sm: 4 }}>
            <Descriptions.Item label="MRN">{visit.patientMrn}</Descriptions.Item>
            <Descriptions.Item label="Temp">
              {visit.vitals?.temperature ? `${visit.vitals.temperature} °C` : 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Blood Pressure">
              {visit.vitals?.bloodPressureSystolic && visit.vitals?.bloodPressureDiastolic
                ? `${visit.vitals.bloodPressureSystolic}/${visit.vitals.bloodPressureDiastolic} mmHg`
                : 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Pulse / SpO2">
              {visit.vitals?.heartRate ? `${visit.vitals.heartRate} bpm` : 'N/A'} /{' '}
              {visit.vitals?.spO2 ? `${visit.vitals.spO2}%` : 'N/A'}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'notes',
            label: (
              <span>
                <SolutionOutlined /> Clinical Notes & Diagnosis
              </span>
            ),
            children: (
              <Form layout="vertical">
                <Form.Item
                  label="Chief Complaint"
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

                <Form.Item label="History of Present Illness (HPI)">
                  <Controller
                    name="historyOfPresentIllness"
                    control={control}
                    render={({ field }) => (
                      <Input.TextArea
                        {...field}
                        rows={2}
                        placeholder="Onset, duration, severity, aggravating/relieving factors..."
                      />
                    )}
                  />
                </Form.Item>

                <Form.Item label="Physical Examination Findings">
                  <Controller
                    name="physicalExamination"
                    control={control}
                    render={({ field }) => (
                      <Input.TextArea
                        {...field}
                        rows={2}
                        placeholder="General appearance, chest, abdomen, ENT, neurological findings..."
                      />
                    )}
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Primary Diagnosis"
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
                    <Form.Item label="Secondary Diagnosis / Comorbidities">
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
                  label="Treatment & Management Plan"
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
                        placeholder="Clinical plan, patient advice, rest, hydration, warning signs..."
                      />
                    )}
                  />
                </Form.Item>
              </Form>
            ),
          },
          {
            key: 'prescriptions',
            label: (
              <span>
                <MedicineBoxOutlined /> Prescriptions ({prescriptionFields.length})
              </span>
            ),
            children: (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <Typography.Text type="secondary">
                    Prescribe medications to be fulfilled by the Hospital Pharmacy.
                  </Typography.Text>
                  <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={() =>
                      appendPrescription({
                        medicationName: '',
                        dosage: '',
                        frequency: 'Once daily',
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
                  <Card key={item.id} size="small" style={{ marginBottom: 12 }}>
                    <Row gutter={12}>
                      <Col span={8}>
                        <Form.Item label="Medication" style={{ marginBottom: 8 }} required>
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
                        <Form.Item label="Dosage" style={{ marginBottom: 8 }} required>
                          <Controller
                            name={`prescriptions.${index}.dosage`}
                            control={control}
                            render={({ field }) => <Input {...field} placeholder="e.g. 500mg" />}
                          />
                        </Form.Item>
                      </Col>

                      <Col span={5}>
                        <Form.Item label="Frequency" style={{ marginBottom: 8 }} required>
                          <Controller
                            name={`prescriptions.${index}.frequency`}
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                options={[
                                  { value: 'Once daily', label: 'Once daily' },
                                  { value: 'BID (Twice daily)', label: 'BID (Twice daily)' },
                                  { value: 'TID (Three times daily)', label: 'TID (Three times daily)' },
                                  { value: 'QID (Four times daily)', label: 'QID (Four times daily)' },
                                  { value: 'PRN (As needed)', label: 'PRN (As needed)' },
                                ]}
                              />
                            )}
                          />
                        </Form.Item>
                      </Col>

                      <Col span={4}>
                        <Form.Item label="Duration" style={{ marginBottom: 8 }} required>
                          <Controller
                            name={`prescriptions.${index}.duration`}
                            control={control}
                            render={({ field }) => <Input {...field} placeholder="e.g. 5 days" />}
                          />
                        </Form.Item>
                      </Col>

                      <Col span={3} style={{ display: 'flex', alignItems: 'center', paddingTop: 24 }}>
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
                  <div style={{ textAlign: 'center', padding: 24, color: '#94a3b8' }}>
                    No medications added. Click "Add Medication" if needed.
                  </div>
                )}
              </div>
            ),
          },
          {
            key: 'labOrders',
            label: (
              <span>
                <ExperimentOutlined /> Laboratory Orders ({labOrderFields.length})
              </span>
            ),
            children: (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <Typography.Text type="secondary">
                    Order diagnostic laboratory tests for this patient encounter.
                  </Typography.Text>
                  <Button
                    type="dashed"
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
                    Order Lab Test
                  </Button>
                </div>

                {labOrderFields.map((item, index) => (
                  <Card key={item.id} size="small" style={{ marginBottom: 12 }}>
                    <Row gutter={12}>
                      <Col span={10}>
                        <Form.Item label="Test Name" style={{ marginBottom: 8 }} required>
                          <Controller
                            name={`labOrders.${index}.testName`}
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                showSearch
                                placeholder="Select or type test"
                                options={[
                                  { value: 'Complete Blood Count (CBC)', label: 'Complete Blood Count (CBC)' },
                                  { value: 'Blood Glucose (Fasting/Random)', label: 'Blood Glucose (FBS/RBS)' },
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

                      <Col span={7}>
                        <Form.Item label="Urgency" style={{ marginBottom: 8 }}>
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
                        <Form.Item label="Category" style={{ marginBottom: 8 }}>
                          <Controller
                            name={`labOrders.${index}.category`}
                            control={control}
                            render={({ field }) => <Input {...field} placeholder="Category" />}
                          />
                        </Form.Item>
                      </Col>

                      <Col span={2} style={{ display: 'flex', alignItems: 'center', paddingTop: 24 }}>
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
                  <div style={{ textAlign: 'center', padding: 24, color: '#94a3b8' }}>
                    No lab tests ordered. Click "Order Lab Test" if diagnostics are required.
                  </div>
                )}
              </div>
            ),
          },
          {
            key: 'referral',
            label: (
              <span>
                <ShareAltOutlined /> Patient Referral
              </span>
            ),
            children: (
              <Form layout="vertical">
                <Form.Item label="Referral Facility / Specialized Department">
                  <Controller
                    name="referral.departmentOrFacility"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="e.g. Cardiology Department / Tikur Anbessa Hospital"
                      />
                    )}
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Urgency">
                      <Controller
                        name="referral.urgency"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={[
                              { value: 'routine', label: 'Routine Referral' },
                              { value: 'urgent', label: 'Urgent Referral' },
                            ]}
                          />
                        )}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item label="Reason for Referral & Clinical Summary">
                  <Controller
                    name="referral.reason"
                    control={control}
                    render={({ field }) => (
                      <Input.TextArea
                        {...field}
                        rows={3}
                        placeholder="Reason for referring the patient, specialized investigations needed..."
                      />
                    )}
                  />
                </Form.Item>
              </Form>
            ),
          },
        ]}
      />
    </Modal>
  );
}
