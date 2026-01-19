
import { BackupData } from '../types';

interface SyncItem {
    id: string;
    type: 'attendance' | 'homework' | 'fee' | 'voice_memo' | 'qr_attendance';
    data: any;
    timestamp: string;
}

let syncQueue: SyncItem[] = JSON.parse(localStorage.getItem('sarthi_sync_queue') || '[]');

export const syncService = {
    addToQueue: (type: SyncItem['type'], data: any) => {
        const newItem: SyncItem = {
            id: Date.now().toString(),
            type,
            data,
            timestamp: new Date().toISOString()
        };
        syncQueue.push(newItem);
        localStorage.setItem('sarthi_sync_queue', JSON.stringify(syncQueue));
        return newItem;
    },
    getQueue: () => syncQueue,
    clearQueue: () => {
        syncQueue = [];
        localStorage.removeItem('sarthi_sync_queue');
    },
    isPending: () => syncQueue.length > 0,

    // NEW: System Backup Creator
    generateSystemBackup: (): BackupData => {
        return {
            config: JSON.parse(localStorage.getItem('appConfig_v3_ESS') || '{}'),
            students: JSON.parse(localStorage.getItem('edu_sarthi_students_v1') || '[]'),
            fees: JSON.parse(localStorage.getItem('edu_sarthi_fees_v1') || '[]'),
            timestamp: new Date().toISOString(),
            version: '4.0-SAFE-MODE'
        };
    },

    // NEW: System Restore
    restoreSystemFromBackup: (backup: BackupData) => {
        if (backup.config) localStorage.setItem('appConfig_v3_ESS', JSON.stringify(backup.config));
        if (backup.students) localStorage.setItem('edu_sarthi_students_v1', JSON.stringify(backup.students));
        if (backup.fees) localStorage.setItem('edu_sarthi_fees_v1', JSON.stringify(backup.fees));
        
        window.location.reload();
    }
};
