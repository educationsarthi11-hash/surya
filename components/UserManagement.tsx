
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { UsersIcon, PlusIcon, KeyIcon, WhatsAppIcon, CheckCircleIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';

const initialUsers: User[] = [
  { id: 'ESS-ADM-001', name: 'Dr. Evelyn Reed', role: UserRole.Admin, username: 'evelyn.reed', email: 'e.reed@example.com', mobileNumber: '9876543211' },
  { id: 'ESS-TCH-001', name: 'Mr. David Chen', role: UserRole.Teacher, username: 'david.chen', email: 'd.chen@example.com', mobileNumber: '9876543212' },
  { id: 'ESS-STU-001', name: 'Aarav Sharma', role: UserRole.Student, username: 'student', email: 'a.sharma@example.com', mobileNumber: '9876543213' },
];

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<UserRole>(UserRole.Student);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newMobileNumber, setNewMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const toast = useToast();

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newUsername.trim() || !password.trim() || !newEmail.trim() || !newMobileNumber.trim()) {
      toast.error('All fields including Name, Username, Email, Mobile, and Password are required.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    if (users.some(user => user.username === newUsername)) {
      toast.error('This username is already taken.');
      return;
    }

    /* --- FIXED: Added missing UserRole mapping for Director --- */
    const rolePrefix: { [key in UserRole]: string } = {
      [UserRole.Admin]: 'ADM',
      [UserRole.Teacher]: 'TCH',
      [UserRole.Student]: 'STU',
      [UserRole.Parent]: 'PAR',
      [UserRole.Company]: 'CMP',
      [UserRole.Director]: 'DIR',
      [UserRole.College]: 'COL',
      [UserRole.CoachingCenter]: 'COA',
      [UserRole.ComputerCenter]: 'CC',
      [UserRole.Medical]: 'MED',
      [UserRole.ITI]: 'ITI',
      [UserRole.NGO]: 'NGO',
      [UserRole.School]: 'SCH',
      [UserRole.JobSeeker]: 'JOB',
      [UserRole.Security]: 'SEC',
      [UserRole.Staff]: 'STF',
      [UserRole.Nurse]: 'NUR',
      [UserRole.University]: 'UNI',
      [UserRole.TechnicalInstitute]: 'TEC',
      [UserRole.Farmer]: 'FRM',
    };

    const newId = `ESS-${rolePrefix[newRole]}-${String(Math.floor(100 + Math.random() * 900))}`;
    
    const newUser: User = {
      id: newId,
      name: newName,
      role: newRole,
      username: newUsername,
      email: newEmail,
      mobileNumber: newMobileNumber,
    };

    setUsers(prev => [newUser, ...prev]);
    
    // Magic Link Generation
    const magicLink = `https://www.educationsarthi.com/dashboard?access_token=${newId}`;
    
    toast.success(`User "${newName}" created! Welcome link and credentials sent to ${newMobileNumber}.`);

    // Simulate AI Communication
    console.log(`--- SIMULATING MAGIC LINK DISPATCH ---`);
    console.log(`To: ${newMobileNumber}`);
    console.log(`WhatsApp: Hello ${newName}, Your account is ready. Click here to login directly: ${magicLink}`);
    console.log(`SMS: Login at educationsarthi.com with ID: ${newUsername} and Pass: ${password}`);
    console.log(`------------------------`);

    // Reset form
    setNewName('');
    setNewRole(UserRole.Student);
    setNewUsername('');
    setNewEmail('');
    setNewMobileNumber('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
      <div className="flex items-center mb-6">
        <UsersIcon className="h-8 w-8 text-primary" />
        <h2 className="ml-3 text-2xl font-bold text-neutral-900">Access Control Center</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-3 border-b pb-2 flex justify-between items-end">
            <div>
                <h3 className="text-lg font-semibold text-neutral-800">Create New User / Franchise</h3>
                <p className="text-sm text-neutral-500 font-hindi">नया अकाउंट बनाते ही छात्र को व्हाट्सएप लिंक मिल जाएगा।</p>
            </div>
            <div className="text-right hidden sm:block">
                 <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-1 rounded-full uppercase flex items-center gap-1"><WhatsAppIcon className="h-3 w-3"/> Auto-Link Enabled</span>
            </div>
        </div>
        <form onSubmit={handleAddUser} className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
            <div>
              <label htmlFor="newName" className="block text-sm font-medium text-neutral-700">Full Name</label>
              <input type="text" id="newName" value={newName} onChange={e => setNewName(e.target.value)} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2" />
            </div>
            <div>
              <label htmlFor="newUsername" className="block text-sm font-medium text-neutral-700">Username</label>
              <input type="text" id="newUsername" value={newUsername} onChange={e => setNewUsername(e.target.value)} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2" />
            </div>
            <div>
              <label htmlFor="newEmail" className="block text-sm font-medium text-neutral-700">Email</label>
              <input type="email" id="newEmail" value={newEmail} onChange={e => setNewEmail(e.target.value)} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2" />
            </div>
             <div>
              <label htmlFor="newMobileNumber" className="block text-sm font-medium text-neutral-700">Mobile Number (WhatsApp)</label>
              <input type="tel" id="newMobileNumber" value={newMobileNumber} onChange={e => setNewMobileNumber(e.target.value)} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2" />
            </div>
            <div className="lg:col-span-2">
              <label htmlFor="newRole" className="block text-sm font-medium text-neutral-700">Role</label>
              <select id="newRole" value={newRole} onChange={e => setNewRole(e.target.value as UserRole)} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2">
                {Object.values(UserRole).map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="password_create" className="block text-sm font-medium text-neutral-700">Password</label>
              <input type="password" id="password_create" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2" />
            </div>
            <div>
              <label htmlFor="confirmPassword_create" className="block text-sm font-medium text-neutral-700">Confirm Password</label>
              <input type="password" id="confirmPassword_create" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2" />
            </div>
            <div className="lg:col-span-4 mt-2">
                <button type="submit" className="w-full sm:w-auto flex justify-center items-center py-2.5 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                    <PlusIcon className="h-5 w-5 mr-2"/>
                    Create & Send Magic Link
                </button>
            </div>
        </form>
      </div>

      <h3 className="text-lg font-semibold text-neutral-800 border-b pb-2 mb-4">Account Status</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">User ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Role</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Communication</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-neutral-500">{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 text-slate-800`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-green-600 font-bold flex items-center gap-1">
                   <CheckCircleIcon className="h-4 w-4"/> Link Sent
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
