import React, { useState } from 'react';
import { ArrowLeft, MapPin, Clock, ShieldCheck, Tag, UserCheck, AlertCircle, CheckCircle2, Phone, Mail, HelpCircle, X, ShieldAlert, Sparkles, Key, Check, Ban } from 'lucide-react';
import { useFindIt } from '../context/FindItContext';
import { VisualFallback } from '../components/common/VisualFallback';
import { USER_PROFILE } from '../data/demoData';

interface ItemDetailsProps {
  itemId?: string;
  onBack: () => void;
  onNavigate: (route: string, id?: string) => void;
}

export const ItemDetails: React.FC<ItemDetailsProps> = ({ itemId, onBack, onNavigate }) => {
  const { getItemById, submitClaim, reviewStaffClaim } = useFindIt();
  const item = itemId ? getItemById(itemId) : undefined;

  // Claim modal state
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [claimantName, setClaimantName] = useState(USER_PROFILE.name || '');
  const [contactInfo, setContactInfo] = useState(USER_PROFILE.email || '');
  const [privateDescription, setPrivateDescription] = useState('');
  const [claimErrors, setClaimErrors] = useState<Record<string, string>>({});
  const [isSubmittingClaim, setIsSubmittingClaim] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);

  // Staff Review Panel state
  const [isStaffPanelOpen, setIsStaffPanelOpen] = useState(false);
  const [staffPin, setStaffPin] = useState('');
  const [staffAuthorized, setStaffAuthorized] = useState(false);
  const [staffClaims, setStaffClaims] = useState<any[]>([]);
  const [staffError, setStaffError] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);

  if (!item) {
    return (
      <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12 max-w-2xl mx-auto text-center py-12">
        <div className="p-8 bg-white rounded-3xl border border-[#E8ECE9] shadow-xs space-y-4">
          <AlertCircle className="w-10 h-10 text-[#E9A34A] mx-auto" />
          <h2 className="text-xl font-bold text-[#17211D]">Belonging Report Not Found</h2>
          <p className="text-xs text-[#78827D]">
            The item you are searching for might have been updated or removed.
          </p>
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 rounded-2xl bg-[#167C61] text-white text-xs font-bold"
          >
            Back to Findings
          </button>
        </div>
      </div>
    );
  }

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingClaim) return;

    const newErrors: Record<string, string> = {};
    if (!claimantName.trim()) {
      newErrors.claimantName = 'Full name is required.';
    }
    if (!contactInfo.trim()) {
      newErrors.contactInfo = 'Contact email or phone is required.';
    }
    if (!privateDescription.trim()) {
      newErrors.privateDescription =
        'Please describe unique private features (serial numbers, wallpaper, receipts, passcode hints, or specific contents) to prove ownership.';
    } else if (privateDescription.trim().length < 10) {
      newErrors.privateDescription = 'Please provide at least 10 characters describing identifying features.';
    }

    if (Object.keys(newErrors).length > 0) {
      setClaimErrors(newErrors);
      return;
    }

    setClaimErrors({});
    setIsSubmittingClaim(true);

    try {
      await submitClaim({
        itemId: item.id,
        itemRefCode: item.refCode,
        claimantName: claimantName.trim(),
        contactInfo: contactInfo.trim(),
        privateDescription: privateDescription.trim(),
      });

      setClaimSuccess(true);
      setIsClaimModalOpen(false);
    } catch (err: any) {
      console.error('Claim submission failed:', err);
      setClaimErrors({ form: err.message || 'Failed to record your claim. Please try again.' });
    } finally {
      setIsSubmittingClaim(false);
    }
  };

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStaffError('');
    try {
      const res = await fetch('/api/staff/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: staffPin }),
      });
      const json = await res.json();
      if (json.success && json.authorized) {
        setStaffAuthorized(true);
        // Fetch private claims for this item
        const claimsRes = await fetch('/api/claims', {
          headers: { 'x-staff-pin': staffPin },
        });
        const claimsJson = await claimsRes.json();
        if (claimsJson.success) {
          const itemSpecific = claimsJson.data.filter((c: any) => c.itemId === item.id);
          setStaffClaims(itemSpecific);
        }
      } else {
        setStaffError('Incorrect Staff PIN. Please check with festival secretariat.');
      }
    } catch {
      setStaffError('Network error connecting to backend.');
    }
  };

  const handleActionClaim = async (claimId: string, action: 'APPROVE' | 'REJECT') => {
    if (!reviewStaffClaim) return;
    setIsReviewing(true);
    try {
      const ok = await reviewStaffClaim(claimId, action, staffPin);
      if (ok) {
        setStaffClaims((prev) =>
          prev.map((c) =>
            c.id === claimId
              ? { ...c, status: action === 'APPROVE' ? 'VERIFIED_RETURNED' : 'REJECTED' }
              : c
          )
        );
      }
    } finally {
      setIsReviewing(false);
    }
  };

  const getStatusBadge = () => {
    switch (item.status) {
      case 'IN_CUSTODY':
        return (
          <span className="font-bold text-[#167C61] bg-[#DDEDE6] px-3 py-1 rounded-full uppercase tracking-wider text-[11px] border border-[#167C61]/20">
            IN CUSTODY
          </span>
        );
      case 'CLAIM_PENDING':
        return (
          <span className="font-bold text-[#E9A34A] bg-[#E9A34A]/15 px-3 py-1 rounded-full uppercase tracking-wider text-[11px] border border-[#E9A34A]/30">
            CLAIM PENDING REVIEW
          </span>
        );
      case 'RETURNED':
        return (
          <span className="font-bold text-[#78827D] bg-[#F7F8F6] px-3 py-1 rounded-full uppercase tracking-wider text-[11px] border border-[#E8ECE9]">
            RETURNED TO OWNER
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12 max-w-3xl mx-auto">
      {/* Top back bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[44px] px-3.5 py-2 rounded-2xl bg-white border border-[#E8ECE9] text-xs font-semibold text-[#17211D] hover:bg-[#F7F8F6] flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#167C61]" />
          <span>Back to Findings</span>
        </button>

        <span className="font-mono text-xs font-bold text-[#167C61] bg-[#DDEDE6] px-3 py-1 rounded-full">
          {item.refCode}
        </span>
      </div>

      {/* Main Item Card */}
      <div className="bg-white rounded-3xl border border-[#E8ECE9] overflow-hidden shadow-xs">
        {/* Full Photograph View */}
        <VisualFallback
          type="item"
          category={item.category}
          imageUrl={item.imageUrl}
          title={item.title}
          aspect="16:9"
          className="max-h-[380px]"
        />

        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#78827D] mb-2.5">
              <span className="font-bold text-[#167C61] bg-[#DDEDE6]/60 px-3 py-1 rounded-full uppercase tracking-wider text-[11px]">
                {item.category}
              </span>
              <span>·</span>
              {getStatusBadge()}
              <span>·</span>
              <span className="font-mono text-xs text-[#78827D]">Ref: {item.refCode}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211D] tracking-tight">
              {item.title}
            </h1>

            {item.isSampleDemo && (
              <span className="inline-block mt-1 text-[11px] text-[#78827D] bg-[#F7F8F6] px-2.5 py-0.5 rounded-md border border-[#E8ECE9]">
                Sample Demonstration Record
              </span>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#78827D]">
              Physical Description & Identifying Marks
            </h2>
            <p className="text-sm sm:text-base text-[#17211D] leading-relaxed bg-[#F7F8F6] p-4 rounded-2xl border border-[#E8ECE9]">
              {item.description}
            </p>
          </div>

          {/* Discovery Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-2xl bg-[#F7F8F6] border border-[#E8ECE9] space-y-1">
              <span className="text-[11px] font-semibold text-[#78827D] uppercase tracking-wider block">
                Found Location
              </span>
              <div className="flex items-center gap-2 text-sm font-bold text-[#17211D]">
                <MapPin className="w-4 h-4 text-[#167C61] shrink-0" />
                <span>{item.foundLocation}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7F8F6] border border-[#E8ECE9] space-y-1">
              <span className="text-[11px] font-semibold text-[#78827D] uppercase tracking-wider block">
                Discovery Timestamp
              </span>
              <div className="flex items-center gap-2 text-sm font-bold text-[#17211D]">
                <Clock className="w-4 h-4 text-[#167C61] shrink-0" />
                <span>
                  {item.foundDate} at {item.foundTime}
                </span>
              </div>
            </div>
          </div>

          {/* Custody Information Card */}
          <div className="p-5 rounded-2xl bg-[#DDEDE6]/40 border border-[#167C61]/25 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#167C61]" />
              <h3 className="text-sm font-bold text-[#17211D]">
                Physical Custody Station
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#17211D]">
              <div>
                <span className="text-[#78827D] block">Safe Storage Vault:</span>
                <span className="font-semibold">{item.custodyLocation}</span>
              </div>
              <div>
                <span className="text-[#78827D] block">Logged Custodian:</span>
                <span className="font-semibold">{item.custodianName}</span>
              </div>
            </div>
          </div>

          {/* CLAIM STATUS CONFIRMATION NOTICE */}
          {claimSuccess && (
            <div className="p-5 rounded-2xl bg-[#DDEDE6] border border-[#167C61]/40 space-y-2 animate-fadeIn">
              <div className="flex items-center gap-2 text-sm font-bold text-[#167C61]">
                <CheckCircle2 className="w-5 h-5" />
                <span>Claim Request Successfully Registered (Pending Verification)</span>
              </div>
              <p className="text-xs text-[#17211D] leading-relaxed">
                Your claim has been recorded under reference{' '}
                <span className="font-mono font-bold">{item.refCode}</span>. Please visit Central Helpdesk Booth #4 in the North Quad with your student ID to verify matching characteristics and receive the belonging.
              </p>
            </div>
          )}

          {/* ACTION AREA: "THIS MIGHT BE MINE" */}
          <div className="pt-2 border-t border-[#E8ECE9] space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setIsClaimModalOpen(true)}
                disabled={item.status === 'RETURNED'}
                className="flex-1 min-h-[48px] px-6 py-3 rounded-2xl bg-[#167C61] hover:bg-[#0E5643] disabled:bg-[#78827D] text-white active:scale-[0.98] font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                <UserCheck className="w-4 h-4" />
                <span>THIS MIGHT BE MINE</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('find-item')}
                className="min-h-[48px] px-5 py-3 rounded-2xl bg-[#F7F8F6] text-[#17211D] hover:bg-[#E8ECE9] font-semibold text-xs border border-[#E8ECE9] transition-colors cursor-pointer"
              >
                Browse Other Items
              </button>
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px] text-[#78827D]">
              <p className="leading-relaxed">
                * The item remains in event staff custody until staff physically validate your proof of ownership.
              </p>
              <button
                type="button"
                onClick={() => setIsStaffPanelOpen(!isStaffPanelOpen)}
                className="font-semibold text-[#167C61] hover:underline flex items-center gap-1 shrink-0 ml-2"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Staff Review</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PROTECTED DEMONSTRATION STAFF REVIEW INTERFACE (SECTION 12) */}
      {isStaffPanelOpen && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#167C61]/30 shadow-md space-y-4 animate-scaleUp">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#167C61] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Staff Custody & Claim Review (PIN Protected)</span>
            </div>
            <button
              type="button"
              onClick={() => setIsStaffPanelOpen(false)}
              className="text-[#78827D] hover:text-[#17211D]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {!staffAuthorized ? (
            <form onSubmit={handleStaffLogin} className="space-y-3">
              <p className="text-xs text-[#78827D]">
                Enter the secret staff review PIN (default: <span className="font-mono font-bold text-[#17211D]">2026</span>) to verify claimant identifying details.
              </p>
              {staffError && <p className="text-xs text-[#D9534F] font-medium">{staffError}</p>}
              <div className="flex gap-2">
                <input
                  type="password"
                  value={staffPin}
                  onChange={(e) => setStaffPin(e.target.value)}
                  placeholder="Enter 4-digit PIN"
                  className="flex-1 min-h-[44px] px-3.5 rounded-2xl bg-[#F7F8F6] border border-[#E8ECE9] text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#167C61]/20"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-2xl bg-[#167C61] text-white text-xs font-bold hover:bg-[#0E5643]"
                >
                  Verify Access
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#78827D]">
                <span className="font-bold text-[#167C61]">Authorized as Event Custodian</span>
                <span>{staffClaims.length} Claim(s) on File</span>
              </div>

              {staffClaims.length === 0 ? (
                <div className="p-4 bg-[#F7F8F6] rounded-2xl text-xs text-[#78827D] text-center">
                  No claims currently pending for this item.
                </div>
              ) : (
                <div className="space-y-3">
                  {staffClaims.map((claim) => (
                    <div
                      key={claim.id}
                      className="p-4 rounded-2xl bg-[#F7F8F6] border border-[#E8ECE9] space-y-2 text-xs"
                    >
                      <div className="flex justify-between font-bold text-[#17211D]">
                        <span>Claimant: {claim.claimantName}</span>
                        <span className="font-mono text-[#167C61]">{claim.status}</span>
                      </div>
                      <div className="text-[#78827D]">Contact: {claim.contact}</div>
                      <div className="p-2.5 rounded-xl bg-white border border-[#E8ECE9]">
                        <span className="font-bold text-[#17211D] block mb-1">
                          Private Identifying Characteristics:
                        </span>
                        <p className="text-[#17211D] font-mono text-[11px]">
                          {claim.privateDetails}
                        </p>
                      </div>

                      {claim.status === 'PENDING' && (
                        <div className="flex gap-2 pt-1">
                          <button
                            type="button"
                            disabled={isReviewing}
                            onClick={() => handleActionClaim(claim.id, 'APPROVE')}
                            className="flex-1 py-2 rounded-xl bg-[#167C61] text-white font-bold text-xs flex items-center justify-center gap-1 hover:bg-[#0E5643] transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve Return (Mark RETURNED)</span>
                          </button>
                          <button
                            type="button"
                            disabled={isReviewing}
                            onClick={() => handleActionClaim(claim.id, 'REJECT')}
                            className="flex-1 py-2 rounded-xl bg-[#D9534F]/10 text-[#D9534F] font-bold text-xs flex items-center justify-center gap-1 hover:bg-[#D9534F]/20 transition-colors"
                          >
                            <Ban className="w-3.5 h-3.5" />
                            <span>Reject Claim</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* CLAIM REQUEST MODAL / SHEET */}
      {isClaimModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#E8ECE9] shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#167C61] uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Claim Verification Request</span>
              </div>
              <button
                type="button"
                onClick={() => setIsClaimModalOpen(false)}
                className="p-1 rounded-full text-[#78827D] hover:text-[#17211D] hover:bg-[#F7F8F6]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-bold text-[#17211D] tracking-tight">
                Claim Belonging: {item.title}
              </h3>
              <p className="text-xs text-[#78827D] mt-1">
                Reference Code: <span className="font-mono font-bold text-[#167C61]">{item.refCode}</span>
              </p>
            </div>

            {claimErrors.form && (
              <div className="p-3.5 rounded-xl bg-[#D9534F]/10 text-xs text-[#D9534F] font-medium">
                {claimErrors.form}
              </div>
            )}

            <form onSubmit={handleClaimSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#17211D] block">
                  Your Full Name <span className="text-[#D9534F]">*</span>
                </label>
                <input
                  type="text"
                  value={claimantName}
                  onChange={(e) => setClaimantName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className={`w-full min-h-[44px] px-3.5 py-2 rounded-2xl bg-[#F7F8F6] border text-xs font-medium text-[#17211D] focus:outline-none focus:ring-2 focus:ring-[#167C61]/20 focus:border-[#167C61] ${
                    claimErrors.claimantName ? 'border-[#D9534F]' : 'border-[#E8ECE9]'
                  }`}
                />
                {claimErrors.claimantName && (
                  <p className="text-[11px] text-[#D9534F]">{claimErrors.claimantName}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#17211D] block">
                  Contact Phone or Email <span className="text-[#D9534F]">*</span>
                </label>
                <input
                  type="text"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="e.g. alex.rivera@campushub.edu or +1 555-0192"
                  className={`w-full min-h-[44px] px-3.5 py-2 rounded-2xl bg-[#F7F8F6] border text-xs font-medium text-[#17211D] focus:outline-none focus:ring-2 focus:ring-[#167C61]/20 focus:border-[#167C61] ${
                    claimErrors.contactInfo ? 'border-[#D9534F]' : 'border-[#E8ECE9]'
                  }`}
                />
                {claimErrors.contactInfo && (
                  <p className="text-[11px] text-[#D9534F]">{claimErrors.contactInfo}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#17211D] block">
                    Private Identifying Details <span className="text-[#D9534F]">*</span>
                  </label>
                  <span className="text-[10px] text-[#167C61] font-semibold bg-[#DDEDE6] px-2 py-0.5 rounded-md">
                    Kept Private
                  </span>
                </div>
                <textarea
                  value={privateDescription}
                  onChange={(e) => setPrivateDescription(e.target.value)}
                  rows={3}
                  placeholder="Describe unique characteristics that only the true owner would know (e.g. lock-screen photo, serial code, stickers, hidden pocket contents, scratch marks)..."
                  className={`w-full p-3.5 rounded-2xl bg-[#F7F8F6] border text-xs font-medium text-[#17211D] placeholder-[#78827D] focus:outline-none focus:ring-2 focus:ring-[#167C61]/20 focus:border-[#167C61] resize-none ${
                    claimErrors.privateDescription ? 'border-[#D9534F]' : 'border-[#E8ECE9]'
                  }`}
                />
                {claimErrors.privateDescription && (
                  <p className="text-[11px] text-[#D9534F]">{claimErrors.privateDescription}</p>
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-[#DDEDE6]/40 border border-[#167C61]/20 text-[11px] text-[#78827D] space-y-1">
                <span className="font-bold text-[#167C61] block">Verification Policy</span>
                <p>
                  Submitting this claim marks the status as <span className="font-bold text-[#17211D]">CLAIM_PENDING</span>. The item remains safely locked in the custody vault until staff at Booth #4 verify your match in person.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsClaimModalOpen(false)}
                  className="flex-1 min-h-[44px] py-2.5 px-4 rounded-2xl bg-[#F7F8F6] text-[#17211D] font-bold text-xs border border-[#E8ECE9]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingClaim}
                  className="flex-1 min-h-[44px] py-2.5 px-4 rounded-2xl bg-[#167C61] text-white hover:bg-[#0E5643] disabled:bg-[#167C61]/60 font-bold text-xs shadow-xs"
                >
                  {isSubmittingClaim ? 'Registering Claim...' : 'Submit Claim Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
