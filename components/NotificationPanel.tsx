import React from 'react';
import { Notification, ServiceName } from '../types';
import { XIcon } from './icons/AllIcons';

interface NotificationPanelProps {
    notifications: Notification[];
    onClose: () => void;
    onMarkAllRead: () => void;
    onNotificationClick: (service?: ServiceName) => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications, onClose, onMarkAllRead, onNotificationClick }) => {
    return (
        <div
            className="fixed inset-0 z-40"
            onClick={onClose}
            aria-hidden="true"
        >
            <div className="fixed top-16 right-4 z-50 w-full max-w-sm bg-white rounded-lg shadow-lifted border border-neutral-200 animate-pop-in"
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="notification-panel-title"
            >
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 id="notification-panel-title" className="text-lg font-bold text-neutral-800">Notifications</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-neutral-100" aria-label="Close notifications">
                        <XIcon className="h-5 w-5 text-neutral-600" />
                    </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <p className="p-6 text-center text-sm text-neutral-500">You have no new notifications.</p>
                    ) : (
                        notifications.map(notification => (
                            <button
                                key={notification.id}
                                onClick={() => onNotificationClick(notification.link?.service)}
                                className={`w-full text-left p-4 border-b last:border-b-0 hover:bg-neutral-50 ${!notification.isRead ? 'bg-primary/5' : ''}`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`mt-1 flex-shrink-0 text-primary ${!notification.isRead ? 'font-bold' : ''}`}>
                                        {React.cloneElement(notification.icon as React.ReactElement<{ className?: string }>, { className: "h-5 w-5" })}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-sm font-semibold ${!notification.isRead ? 'text-neutral-800' : 'text-neutral-600'}`}>
                                            {notification.title}
                                        </p>
                                        <p className="text-sm text-neutral-500">{notification.message}</p>
                                        <p className="text-xs text-neutral-400 mt-1">{notification.timestamp}</p>
                                    </div>
                                    {!notification.isRead && (
                                        <div className="mt-1 w-2 h-2 rounded-full bg-primary flex-shrink-0" aria-label="Unread"></div>
                                    )}
                                </div>
                            </button>
                        ))
                    )}
                </div>
                {notifications.some(n => !n.isRead) && (
                    <div className="p-2 border-t">
                        <button onClick={onMarkAllRead} className="w-full text-center text-sm font-semibold text-primary py-1 hover:bg-primary/10 rounded-md">
                            Mark all as read
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationPanel;