import React, { useState } from 'react';
import { User, Mail, Phone, ShieldCheck, Ticket, Bell, LogOut, Check, ChevronRight, Info } from 'lucide-react';
import { USER_PROFILE } from '../data/demoData';

interface ProfileProps {
  onNavigate: (route: string) => void;
}

export const Profile: React.FC<ProfileProps> = ({ onNavigate }) => {
  const [preferences, setPreferences] = useState(USER_PROFILE.preferences);
  const [signedOutNotice, setSignedOutNotice] = useState(false);

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12 max-w-2xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#167C61] uppercase tracking-wider">
          <span>Student Account</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211D] tracking-tight mt-1">
          Profile & Settings
        </h1>
        <p className="text-sm text-[#78827D] mt-0.5">
          Manage your Mavericks Fest credential pass and FindIt notification alerts.
        </p>
      </div>

      {signedOutNotice && (
        <div className="p-4 rounded-2xl bg-[#DDEDE6] border border-[#167C61]/30 text-xs text-[#167C61] flex items-center justify-between">
          <span>Authentication state will be managed with Firebase Auth in Stage 3.</span>
          <button
            type="button"
            onClick={() => setSignedOutNotice(false)}
            className="font-bold underline text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8ECE9] shadow-xs space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#167C61] to-[#0E5643] text-white flex items-center justify-center font-bold text-2xl shadow-sm">
            {USER_PROFILE.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-[#17211D]">
                {USER_PROFILE.name}
              </h2>
              <span className="text-[10px] font-bold text-[#167C61] bg-[#DDEDE6] px-2.5 py-0.5 rounded-full">
                {USER_PROFILE.role}
              </span>
            </div>
            <p className="text-xs text-[#78827D] mt-0.5">{USER_PROFILE.college}</p>
            <span className="text-[11px] font-mono text-[#78827D] block mt-1">
              Student ID: {USER_PROFILE.studentId}
            </span>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-[#E8ECE9] text-xs">
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#F7F8F6]">
            <Mail className="w-4 h-4 text-[#167C61]" />
            <span className="font-medium text-[#17211D]">{USER_PROFILE.email}</span>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#F7F8F6]">
            <Phone className="w-4 h-4 text-[#167C61]" />
            <span className="font-medium text-[#17211D]">{USER_PROFILE.phone}</span>
          </div>
        </div>
      </div>

      {/* Festival Delegate Statistics */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-3xl border border-[#E8ECE9] text-center shadow-xs">
          <span className="text-[11px] font-semibold text-[#78827D] block">Events</span>
          <span className="text-xl font-bold text-[#17211D] mt-1 block tabular-nums">3 Registered</span>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-[#E8ECE9] text-center shadow-xs">
          <span className="text-[11px] font-semibold text-[#78827D] block">FindIt Logs</span>
          <span className="text-xl font-bold text-[#167C61] mt-1 block tabular-nums">1 Reported</span>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-[#E8ECE9] text-center shadow-xs">
          <span className="text-[11px] font-semibold text-[#78827D] block">Claims</span>
          <span className="text-xl font-bold text-[#17211D] mt-1 block tabular-nums">0 Active</span>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8ECE9] shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#167C61]" />
          <h3 className="text-base font-bold text-[#17211D]">
            Notification Alerts
          </h3>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F7F8F6] border border-[#E8ECE9]">
            <div>
              <span className="text-xs font-bold text-[#17211D] block">FindIt Matching Alerts</span>
              <span className="text-[11px] text-[#78827D]">Immediate ping when items matching your tags are turned in</span>
            </div>
            <button
              type="button"
              onClick={() => togglePreference('lostItemAlerts')}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                preferences.lostItemAlerts ? 'bg-[#167C61]' : 'bg-[#E8ECE9]'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  preferences.lostItemAlerts ? 'left-5.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F7F8F6] border border-[#E8ECE9]">
            <div>
              <span className="text-xs font-bold text-[#17211D] block">Schedule & Venue Relocation</span>
              <span className="text-[11px] text-[#78827D]">Critical organizer broadcasts during festival tracks</span>
            </div>
            <button
              type="button"
              onClick={() => togglePreference('scheduleChanges')}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                preferences.scheduleChanges ? 'bg-[#167C61]' : 'bg-[#E8ECE9]'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  preferences.scheduleChanges ? 'left-5.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Stage 1 Note & Sign Out */}
      <div className="p-6 rounded-3xl bg-white border border-[#E8ECE9] shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs text-[#78827D]">
          <Info className="w-4 h-4 text-[#167C61]" />
          <span>Stage 1 UI Preview: Authentication will be configured in Stage 3.</span>
        </div>

        <button
          type="button"
          onClick={() => setSignedOutNotice(true)}
          className="w-full min-h-[44px] py-2.5 px-4 rounded-2xl bg-[#F7F8F6] hover:bg-[#D9534F]/10 text-[#D9534F] font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of CampusHub</span>
        </button>
      </div>
    </div>
  );
};
