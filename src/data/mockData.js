export const patientData = [{
        id: 1,
        name: 'Patient 001',
        age: 34,
        gender: 'M',
        seizureHistory: 12,
        lastSeizure: '2 days ago',
        status: 'active'
    },
    {
        id: 2,
        name: 'Patient 002',
        age: 28,
        gender: 'F',
        seizureHistory: 8,
        lastSeizure: '5 days ago',
        status: 'stable'
    },
    {
        id: 3,
        name: 'Patient 003',
        age: 45,
        gender: 'M',
        seizureHistory: 15,
        lastSeizure: '1 day ago',
        status: 'critical'
    },
    {
        id: 4,
        name: 'Patient 004',
        age: 31,
        gender: 'F',
        seizureHistory: 6,
        lastSeizure: '10 days ago',
        status: 'stable'
    },
    {
        id: 5,
        name: 'Patient 005',
        age: 52,
        gender: 'M',
        seizureHistory: 20,
        lastSeizure: '3 hours ago',
        status: 'critical'
    },
];

export const eegChannels = [
    'FP1', 'FP2', 'F7', 'F3', 'FZ', 'F4', 'F8',
    'T3', 'C3', 'CZ', 'C4', 'T4',
    'T5', 'P3', 'PZ', 'P4', 'T6',
    'O1', 'O2', 'FPZ', 'F9', 'F10', 'T9'
];

export const selectedChannels = ['F3', 'F4', 'C3', 'C4', 'P3', 'P4', 'O1', 'O2'];

export const channelImportance = [{
        channel: 'F3',
        importance: 35.2,
        position: {
            x: -0.3,
            y: 0.5,
            z: 0.7
        }
    },
    {
        channel: 'C3',
        importance: 28.4,
        position: {
            x: -0.5,
            y: 0.2,
            z: 0.3
        }
    },
    {
        channel: 'F4',
        importance: 24.8,
        position: {
            x: 0.3,
            y: 0.5,
            z: 0.7
        }
    },
    {
        channel: 'P3',
        importance: 22.1,
        position: {
            x: -0.4,
            y: -0.3,
            z: 0.2
        }
    },
    {
        channel: 'C4',
        importance: 19.5,
        position: {
            x: 0.5,
            y: 0.2,
            z: 0.3
        }
    },
    {
        channel: 'O1',
        importance: 16.3,
        position: {
            x: -0.2,
            y: -0.6,
            z: -0.3
        }
    },
    {
        channel: 'P4',
        importance: 15.7,
        position: {
            x: 0.4,
            y: -0.3,
            z: 0.2
        }
    },
    {
        channel: 'O2',
        importance: 14.2,
        position: {
            x: 0.2,
            y: -0.6,
            z: -0.3
        }
    },
];

export const dashboardStats = {
    totalPatients: 127,
    eegAnalyses: 3542,
    seizuresDetected: 89,
    detectionAccuracy: 94.7,
    activeMonitoring: 12
};

export const predictionData = [{
        time: '00:00',
        normal: 85,
        preictal: 12,
        seizure: 3
    },
    {
        time: '04:00',
        normal: 78,
        preictal: 18,
        seizure: 4
    },
    {
        time: '08:00',
        normal: 65,
        preictal: 25,
        seizure: 10
    },
    {
        time: '12:00',
        normal: 45,
        preictal: 35,
        seizure: 20
    },
    {
        time: '16:00',
        normal: 32,
        preictal: 38,
        seizure: 30
    },
    {
        time: '20:00',
        normal: 15,
        preictal: 28,
        seizure: 57
    },
    {
        time: '23:59',
        normal: 8,
        preictal: 20,
        seizure: 72
    },
];

export const performanceMetrics = {
    accuracy: 94.7,
    sensitivity: 96.2,
    specificity: 93.8,
    f1Score: 95.1,
    falseAlarmRate: 6.2,
    inferenceTime: 23,
    memoryUsage: 512
};

export const losoValidation = [{
        patient: 'P001',
        accuracy: 95.2,
        sensitivity: 96.8,
        specificity: 94.1
    },
    {
        patient: 'P002',
        accuracy: 93.7,
        sensitivity: 94.5,
        specificity: 92.9
    },
    {
        patient: 'P003',
        accuracy: 96.1,
        sensitivity: 97.2,
        specificity: 95.3
    },
    {
        patient: 'P004',
        accuracy: 92.8,
        sensitivity: 93.1,
        specificity: 92.5
    },
    {
        patient: 'P005',
        accuracy: 94.5,
        sensitivity: 95.7,
        specificity: 93.6
    },
];

export const fusionWeights = {
    eeg: 72,
    ppg: 28
};

export const currentPrediction = {
    normal: 5,
    preictal: 18,
    seizure: 77,
    confidence: 94.8,
    processingTime: 23,
    riskLevel: 'critical',
    dominantChannels: ['F3', 'C3', 'F4']
};

export const datasetInfo = {
    name: 'CHB-MIT Scalp EEG Database',
    patients: 23,
    recordings: 664,
    totalHours: 982,
    seizureEvents: 198,
    classDistribution: {
        normal: 78.2,
        preictal: 14.3,
        seizure: 7.5
    }
};

export const shapExplanation = [{
        feature: 'F3 Channel',
        importance: 35.2,
        type: 'eeg'
    },
    {
        feature: 'C3 Channel',
        importance: 28.4,
        type: 'eeg'
    },
    {
        feature: 'F4 Channel',
        importance: 24.8,
        type: 'eeg'
    },
    {
        feature: 'PPG Signal',
        importance: 15.7,
        type: 'ppg'
    },
    {
        feature: 'P3 Channel',
        importance: 12.3,
        type: 'eeg'
    },
    {
        feature: 'C4 Channel',
        importance: 9.8,
        type: 'eeg'
    },
];

export const aiExplanation = "The model identified abnormal spike-wave patterns in F3 and C3 channels (frontal-central region) with high-amplitude discharges occurring at 3Hz frequency. Concurrent PPG analysis shows elevated heart rate variability (HRV) and increased sympathetic activity, indicating autonomic nervous system involvement. The attention mechanism focused on the 5-second window preceding seizure onset, detecting characteristic preictal patterns. SHAP analysis confirms frontal lobe hyperactivity as the primary contributor to the 77% seizure prediction confidence.";

export const systemHealth = {
    springBoot: {
        status: 'online',
        latency: 12,
        uptime: '99.8%'
    },
    fastAPI: {
        status: 'online',
        latency: 8,
        uptime: '99.9%'
    },
    aiModel: {
        status: 'online',
        latency: 23,
        uptime: '99.7%'
    },
    database: {
        status: 'online',
        latency: 5,
        uptime: '100%'
    }
};