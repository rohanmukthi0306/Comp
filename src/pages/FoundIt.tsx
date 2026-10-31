import React, { useState, useRef } from 'react';
import { Camera, Upload, ArrowLeft, CheckCircle2, ShieldCheck, MapPin, Clock, Calendar, AlertCircle, X, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { useFindIt } from '../context/FindItContext';
import { ItemCategory, FoundItemReport } from '../types/findItTypes';

interface FoundItProps {
  onBack: () => void;
  onNavigate: (route: string, id?: string) => void;
}

const VALID_DATES = ['2026-10-29', '2026-10-30', '2026-10-31'];

const LOCATION_OPTIONS = [
  'Main Auditorium',
  'Registration Desk',
  'Food Court',
  'North Quad',
  'Exhibition Hall',
  'Sports Ground',
  'Other',
];

const CATEGORIES: ItemCategory[] = [
  'Electronics',
  'Bags',
  'Wallets',
  'ID Cards',
  'Clothing',
  'Books',
  'Accessories',
  'Other',
];

export const FoundIt: React.FC<FoundItProps> = ({ onBack, onNavigate }) => {
  const { addFoundItem } = useFindIt();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [category, setCategory] = useState<ItemCategory>('Electronics');
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [locationSelect, setLocationSelect] = useState('Main Auditorium');
  const [customLocation, setCustomLocation] = useState('');
  const [foundDate, setFoundDate] = useState('2026-10-30');
  const [foundTime, setFoundTime] = useState('02:30 PM');

  // Photo states
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  // Validation & submission states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccessItem, setSubmissionSuccessItem] = useState<FoundItemReport | null>(null);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type: JPG, JPEG, PNG, WebP
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setPhotoError('Invalid image format. Please select a JPG, JPEG, PNG, or WebP photo.');
      return;
    }

    // Validate size: max 10MB
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setPhotoError('Image size exceeds 10 MB limit. Please select a smaller photo.');
      return;
    }

    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoDataUrl(reader.result as string);
    };
    reader.onerror = () => {
      setPhotoError('Failed to read the selected image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoDataUrl(null);
    setPhotoFile(null);
    setPhotoError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!itemName.trim()) {
      newErrors.itemName = 'Item name is required.';
    } else if (itemName.trim().length < 3) {
      newErrors.itemName = 'Please enter a descriptive item name (at least 3 characters).';
    }

    if (!category) {
      newErrors.category = 'Item category is required.';
    }

    if (!description.trim()) {
      newErrors.description = 'Please provide a detailed description to assist ownership verification.';
    } else if (description.trim().length < 10) {
      newErrors.description = 'Description should be at least 10 characters long.';
    }

    const finalLocation = locationSelect === 'Other' ? customLocation.trim() : locationSelect;
    if (!finalLocation) {
      newErrors.location = 'Found location is required.';
    }

    if (!VALID_DATES.includes(foundDate)) {
      newErrors.foundDate = 'Festival dates are restricted to October 29, 30, or 31, 2026.';
    }

    if (!foundTime.trim()) {
      newErrors.foundTime = 'Approximate found time is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent duplicate submissions

    if (!validate()) {
      // Scroll to top of form
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const finalLocation = locationSelect === 'Other' ? customLocation.trim() : locationSelect;

      const created = await addFoundItem({
        title: itemName.trim(),
        category,
        description: description.trim(),
        foundLocation: finalLocation,
        foundDate,
        foundTime: foundTime.trim(),
        imageFileOrData: photoFile || photoDataUrl,
        custodyLocation: 'Central Helpdesk Booth #4, North Quad',
        custodianName: 'Staff Officer on Duty (Helpdesk #4)',
      });

      // Reset form fields
      setItemName('');
      setDescription('');
      setLocationSelect('Main Auditorium');
      setCustomLocation('');
      setFoundDate('2026-10-30');
      setFoundTime('02:30 PM');
      handleRemovePhoto();

      // Show success modal with created item details
      setSubmissionSuccessItem(created);
    } catch (err: any) {
      console.error('Submission failed:', err);
      setErrors({ form: err.message || 'An error occurred while saving the report to the central database. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12 max-w-2xl mx-auto">
      {/* Top back & context bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[44px] px-3.5 py-2 rounded-2xl bg-white border border-[#E8ECE9] text-xs font-semibold text-[#17211D] hover:bg-[#F7F8F6] flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#167C61]" />
          <span>Back to FindIt</span>
        </button>

        <span className="text-xs font-bold text-[#167C61] bg-[#DDEDE6] px-3 py-1 rounded-full">
          Live Intake Workflow
        </span>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#167C61] uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Found Item Intake Protocol</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211D] tracking-tight mt-1">
          Report a Found Item
        </h1>
        <p className="text-sm text-[#78827D] mt-0.5">
          Enter item details to log the discovery. All physical items should be deposited at Central Helpdesk Booth #4 in the North Quad.
        </p>
      </div>

      {/* SUCCESS CONFIRMATION MODAL */}
      {submissionSuccessItem && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#167C61] shadow-xl space-y-5 animate-scaleUp">
          <div className="w-14 h-14 rounded-2xl bg-[#DDEDE6] text-[#167C61] flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-8 h-8 stroke-[2.25px]" />
          </div>

          <div className="text-center space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#17211D] tracking-tight">
              Your found item has been successfully registered.
            </h2>
            <p className="text-xs sm:text-sm text-[#78827D] max-w-md mx-auto leading-relaxed">
              The report is stored in the local registry, an in-app notification has been dispatched, and an indicator marker has been updated on the festival calendar.
            </p>
          </div>

          {/* Reference badge highlight */}
          <div className="p-4 rounded-2xl bg-[#F7F8F6] border border-[#E8ECE9] text-center space-y-1">
            <span className="text-[11px] font-semibold text-[#78827D] uppercase tracking-wider block">
              Permanent Custody Reference Code
            </span>
            <span className="text-xl sm:text-2xl font-mono font-extrabold text-[#167C61] tracking-wider block">
              {submissionSuccessItem.refCode}
            </span>
            <span className="text-[11px] text-[#78827D] block">
              Status: <span className="font-bold text-[#17211D]">IN_CUSTODY</span> (Central Helpdesk Booth #4)
            </span>
          </div>

          {/* Submitted Photograph Preview */}
          {submissionSuccessItem.imageUrl && (
            <div className="rounded-2xl overflow-hidden border border-[#E8ECE9] max-h-48 bg-[#17211D] flex items-center justify-center">
              <img
                src={submissionSuccessItem.imageUrl}
                alt={submissionSuccessItem.title}
                className="w-full max-h-48 object-contain"
              />
            </div>
          )}

          {/* Summary preview */}
          <div className="p-4 rounded-2xl bg-[#DDEDE6]/30 border border-[#167C61]/20 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-[#78827D]">Item:</span>
              <span className="font-bold text-[#17211D]">{submissionSuccessItem.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#78827D]">Category:</span>
              <span className="font-semibold text-[#17211D]">{submissionSuccessItem.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#78827D]">Location Found:</span>
              <span className="font-semibold text-[#17211D]">{submissionSuccessItem.foundLocation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#78827D]">Date & Time:</span>
              <span className="font-semibold text-[#17211D]">
                {submissionSuccessItem.foundDate} at {submissionSuccessItem.foundTime}
              </span>
            </div>
          </div>

          {/* TWO REQUIRED ACTIONS: View Found Item & Back to FindIt */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('item-details', submissionSuccessItem.id)}
              className="flex-1 min-h-[48px] py-3 px-5 rounded-2xl bg-[#167C61] text-white hover:bg-[#0E5643] active:scale-[0.98] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <span>View Found Item</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('findit')}
              className="flex-1 min-h-[48px] py-3 px-5 rounded-2xl bg-[#F7F8F6] text-[#17211D] hover:bg-[#E8ECE9] active:scale-[0.98] font-bold text-xs sm:text-sm border border-[#E8ECE9] flex items-center justify-center transition-all cursor-pointer"
            >
              <span>Back to FindIt</span>
            </button>
          </div>
        </div>
      )}

      {/* Form Error Banner */}
      {errors.form && (
        <div className="p-4 rounded-2xl bg-[#D9534F]/10 border border-[#D9534F]/30 text-xs text-[#D9534F] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errors.form}</span>
        </div>
      )}

      {/* Main Intake Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8ECE9] shadow-xs space-y-6">
        {/* Hidden native mobile file and camera inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleImageFileChange}
          className="hidden"
          id="gallery-input"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          capture="environment"
          onChange={handleImageFileChange}
          className="hidden"
          id="camera-input"
        />

        {/* 1. Upload Photograph Area with Camera & Gallery Support */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#17211D] uppercase tracking-wider block">
              1. Photograph of Belonging (Optional)
            </label>
            <span className="text-[11px] text-[#78827D]">JPG, PNG, WebP up to 10MB</span>
          </div>

          {photoError && (
            <div className="p-3 rounded-xl bg-[#D9534F]/10 border border-[#D9534F]/25 text-xs text-[#D9534F] flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{photoError}</span>
            </div>
          )}

          {photoDataUrl ? (
            <div className="relative rounded-2xl overflow-hidden border border-[#E8ECE9] bg-[#17211D] flex flex-col items-center justify-center p-2">
              <img
                src={photoDataUrl}
                alt="Selected item preview"
                className="w-full max-h-72 object-contain rounded-xl"
              />
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-full bg-black/70 hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 backdrop-blur-sm transition-all"
                  title="Replace photograph"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Replace</span>
                </button>
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="p-1.5 rounded-full bg-black/70 hover:bg-[#D9534F] text-white transition-colors"
                  title="Remove photograph"
                  aria-label="Remove photograph"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-[#E8ECE9] hover:border-[#167C61]/50 rounded-2xl p-6 sm:p-8 bg-[#F7F8F6] text-center transition-all">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#E8ECE9] flex items-center justify-center text-[#167C61] shadow-xs mx-auto mb-3">
                <Camera className="w-6 h-6 stroke-[1.75px]" />
              </div>

              <div className="text-xs font-bold text-[#17211D] mb-1">
                Attach a clear photograph of the item
              </div>
              <p className="text-[11px] text-[#78827D] max-w-sm mx-auto mb-4 leading-relaxed">
                Photos are stored securely in local IndexedDB and help the owner confirm identity during festival verification.
              </p>

              {/* Dual triggers: Native Camera capture and Gallery file picker */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-white border border-[#E8ECE9] hover:bg-[#DDEDE6]/40 text-xs font-bold text-[#167C61] flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Take Photo (Camera)</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-white border border-[#E8ECE9] hover:bg-[#DDEDE6]/40 text-xs font-bold text-[#17211D] flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-[#78827D]" />
                  <span>Choose from Gallery</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 2. Item Category */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#17211D] uppercase tracking-wider block">
            2. Item Category <span className="text-[#D9534F]">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ItemCategory)}
            className="w-full min-h-[44px] px-4 py-2.5 rounded-2xl bg-[#F7F8F6] border border-[#E8ECE9] text-xs font-semibold text-[#17211D] focus:outline-none focus:ring-2 focus:ring-[#167C61]/20 focus:border-[#167C61] transition-all cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-[11px] text-[#D9534F] font-medium">{errors.category}</p>}
        </div>

        {/* 3. Item Name */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#17211D] uppercase tracking-wider block">
            3. Item Name & Identification <span className="text-[#D9534F]">*</span>
          </label>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="e.g. Space Grey MacBook Air, Black Leather Bifold Wallet"
            className={`w-full min-h-[44px] px-4 py-2.5 rounded-2xl bg-[#F7F8F6] border text-xs font-medium text-[#17211D] placeholder-[#78827D] focus:outline-none focus:ring-2 focus:ring-[#167C61]/20 focus:border-[#167C61] transition-all ${
              errors.itemName ? 'border-[#D9534F]' : 'border-[#E8ECE9]'
            }`}
          />
          {errors.itemName && <p className="text-[11px] text-[#D9534F] font-medium">{errors.itemName}</p>}
        </div>

        {/* 4. Description Textarea */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#17211D] uppercase tracking-wider block">
            4. Detailed Description <span className="text-[#D9534F]">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Include distinctive stickers, case color, scratches, engravings, or unique identifying traits..."
            className={`w-full p-4 rounded-2xl bg-[#F7F8F6] border text-xs font-medium text-[#17211D] placeholder-[#78827D] focus:outline-none focus:ring-2 focus:ring-[#167C61]/20 focus:border-[#167C61] transition-all resize-none ${
              errors.description ? 'border-[#D9534F]' : 'border-[#E8ECE9]'
            }`}
          />
          {errors.description && <p className="text-[11px] text-[#D9534F] font-medium">{errors.description}</p>}
        </div>

        {/* 5. Found Location */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#17211D] uppercase tracking-wider block">
            5. Location Where Found <span className="text-[#D9534F]">*</span>
          </label>
          <select
            value={locationSelect}
            onChange={(e) => setLocationSelect(e.target.value)}
            className="w-full min-h-[44px] px-4 py-2.5 rounded-2xl bg-[#F7F8F6] border border-[#E8ECE9] text-xs font-semibold text-[#17211D] focus:outline-none focus:ring-2 focus:ring-[#167C61]/20 focus:border-[#167C61] transition-all cursor-pointer"
          >
            {LOCATION_OPTIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          {locationSelect === 'Other' && (
            <div className="pt-2">
              <input
                type="text"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                placeholder="Specify exact building, room, or lawn zone..."
                className={`w-full min-h-[44px] px-4 py-2.5 rounded-2xl bg-[#F7F8F6] border text-xs font-medium text-[#17211D] placeholder-[#78827D] focus:outline-none focus:ring-2 focus:ring-[#167C61]/20 focus:border-[#167C61] transition-all ${
                  errors.location ? 'border-[#D9534F]' : 'border-[#E8ECE9]'
                }`}
              />
            </div>
          )}
          {errors.location && <p className="text-[11px] text-[#D9534F] font-medium">{errors.location}</p>}
        </div>

        {/* 6 & 7. Date (Restricted to Oct 29, 30, 31) and Approximate Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#17211D] uppercase tracking-wider block">
              6. Found Date (Oct 2026) <span className="text-[#D9534F]">*</span>
            </label>
            <select
              value={foundDate}
              onChange={(e) => setFoundDate(e.target.value)}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-2xl bg-[#F7F8F6] border border-[#E8ECE9] text-xs font-semibold text-[#17211D] focus:outline-none focus:ring-2 focus:ring-[#167C61]/20 focus:border-[#167C61] transition-all cursor-pointer"
            >
              <option value="2026-10-29">October 29, 2026 (Day 1 - Thursday)</option>
              <option value="2026-10-30">October 30, 2026 (Day 2 - Friday - Default)</option>
              <option value="2026-10-31">October 31, 2026 (Day 3 - Saturday)</option>
            </select>
            {errors.foundDate && <p className="text-[11px] text-[#D9534F] font-medium">{errors.foundDate}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#17211D] uppercase tracking-wider block">
              7. Approximate Time <span className="text-[#D9534F]">*</span>
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-[#167C61] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={foundTime}
                onChange={(e) => setFoundTime(e.target.value)}
                placeholder="e.g. 11:30 AM or 03:45 PM"
                className={`w-full min-h-[44px] pl-10 pr-4 py-2.5 rounded-2xl bg-[#F7F8F6] border text-xs font-medium text-[#17211D] focus:outline-none focus:ring-2 focus:ring-[#167C61]/20 focus:border-[#167C61] transition-all ${
                  errors.foundTime ? 'border-[#D9534F]' : 'border-[#E8ECE9]'
                }`}
              />
            </div>
            {errors.foundTime && <p className="text-[11px] text-[#D9534F] font-medium">{errors.foundTime}</p>}
          </div>
        </div>

        {/* Custody Station Guidance Note */}
        <div className="p-4 rounded-2xl bg-[#DDEDE6]/40 border border-[#167C61]/20 text-xs text-[#17211D] space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-[#167C61]">
            <MapPin className="w-4 h-4" />
            <span>Physical Custody Station Handoff</span>
          </div>
          <p className="text-[#78827D] leading-relaxed">
            Please deposit the physical item with a volunteer at Central Helpdesk Booth #4 in the North Quad so that verified claimants can pick it up.
          </p>
        </div>

        {/* 8. Submit Report Button with duplicate prevention */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-[48px] py-3.5 px-6 rounded-2xl bg-[#167C61] hover:bg-[#0E5643] disabled:bg-[#167C61]/60 text-white active:scale-[0.98] font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Registering Report in FindIt...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>SUBMIT FOUND ITEM</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
