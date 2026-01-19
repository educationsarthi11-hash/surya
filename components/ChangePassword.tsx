import React, { useState } from 'react';
import { User } from '../types';
import { useToast } from '../hooks/useToast';
import { KeyIcon } from './icons/AllIcons';

interface ChangePasswordProps {
    user: User;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ user }) => {
    const toast = useToast();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [otpMode, setOtpMode] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    const handleSendOtp = () => {
        // In a real app, this would trigger a backend API call
        setOtpSent(true);
        toast.info(`An OTP has been sent to your registered email (${user.email || 'not available'}) and mobile number (${user.mobileNumber || 'not available'}).`);
        console.log(`SIMULATED OTP for ${user.username}: 123456`);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (newPassword.length < 6) {
            toast.error("New password must be at least 6 characters long.");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match.");
            return;
        }

        if (otpMode) {
            if (otp !== '123456') { // Simulating OTP check
                toast.error("Invalid OTP. Please try again.");
                return;
            }
        } else {
            if (!currentPassword) {
                toast.error("Please enter your current password.");
                return;
            }
            // In a real app, you would verify the currentPassword against the backend
            // For simulation, we'll assume it's correct if it's not empty.
            if (currentPassword === newPassword) {
                toast.error("New password cannot be the same as the old password.");
                return;
            }
        }

        // If all checks pass
        toast.success("Password updated successfully!");
        
        // Reset form
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setOtp('');
        setOtpSent(false);
        setOtpMode(false);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft max-w-lg mx-auto">
            <div className="flex items-center mb-6">
                <KeyIcon aria-hidden="true" className="h-8 w-8 text-primary" />
                <div className="ml-3">
                    <h2 className="text-2xl font-bold text-neutral-900">Change Password</h2>
                    <p className="text-sm text-neutral-500 font-hindi">अपना पासवर्ड बदलें</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {!otpMode ? (
                    <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-neutral-700">Current Password (मौजूदा पासवर्ड)</label>
                        <input
                            type="password"
                            id="currentPassword"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2"
                            required
                        />
                         <button type="button" onClick={() => { setOtpMode(true); setOtpSent(false); }} className="text-xs text-primary hover:underline mt-1">Forgot current password? Use OTP.</button>
                    </div>
                ) : (
                    <div>
                        <label htmlFor="otp" className="block text-sm font-medium text-neutral-700">Enter OTP (OTP दर्ज करें)</label>
                        <div className="flex items-center gap-2">
                             <input
                                type="text"
                                id="otp"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2"
                                required
                                disabled={!otpSent}
                            />
                            <button type="button" onClick={handleSendOtp} disabled={otpSent} className="mt-1 px-4 py-2 text-sm font-semibold bg-primary/10 text-primary rounded-md whitespace-nowrap disabled:opacity-50">
                                {otpSent ? 'Resend OTP' : 'Send OTP'}
                            </button>
                        </div>
                         <button type="button" onClick={() => setOtpMode(false)} className="text-xs text-primary hover:underline mt-1">Use Current Password instead.</button>
                    </div>
                )}
                
                <hr />
                
                <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-neutral-700">New Password (नया पासवर्ड)</label>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700">Confirm New Password (नए पासवर्ड की पुष्टि करें)</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
                >
                    Update Password (पासवर्ड अपडेट करें)
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;
