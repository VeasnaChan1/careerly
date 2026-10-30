import React from 'react';
import { BriefcaseBusiness, Globe, Mail, MapPin, Phone, User, Trash2 } from 'lucide-react';
import { Linkedin } from './ui/icons';

const PersonalInfoForm = ({ data, onChange, removeBackground, setRemoveBackground }) => {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Read and compress image to ~500px max dimension to ensure it fits comfortably in localStorage
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 500;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        handleChange('image_url', compressedDataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleChange('image_url', '');
  };

  const imageSrc =
    typeof data?.image_url === 'string' && data.image_url.trim() !== ''
      ? data.image_url
      : data?.image_url instanceof Blob || data?.image_url instanceof File
      ? URL.createObjectURL(data.image_url)
      : null;

  const fields = [
    { key: 'full_name', label: 'Full Name', icon: User, type: 'text', required: true },
    { key: 'email', label: 'Email Address', icon: Mail, type: 'email', required: true },
    { key: 'phone', label: 'Phone Number', icon: Phone, type: 'tel' },
    { key: 'location', label: 'Location', icon: MapPin, type: 'text' },
    { key: 'profession', label: 'Profession', icon: BriefcaseBusiness, type: 'text' },
    { key: 'linkedin', label: 'LinkedIn Profile', icon: Linkedin, type: 'url' },
    { key: 'website', label: 'Personal Website', icon: Globe, type: 'url' },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
      <p className="text-sm text-gray-600">Get started with your contact and personal information</p>

      <div className="flex items-center gap-4 mt-4">
        <label className="cursor-pointer group relative">
          {imageSrc ? (
            <div className="relative">
              <img
                src={imageSrc}
                alt="user profile"
                className="w-16 h-16 rounded-full object-cover ring-2 ring-[#F46200]/30 group-hover:opacity-80 transition-opacity"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-xs transition-colors cursor-pointer"
                title="Remove photo"
              >
                <Trash2 className="size-3" />
              </button>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 text-slate-600 hover:text-[#F46200] transition-colors">
              <User className="size-12 p-3 border border-dashed border-gray-300 rounded-full group-hover:border-[#F46200]" />
              <span className="text-xs font-medium">Upload profile photo</span>
            </div>
          )}
          <input
            type="file"
            accept="image/jpeg, image/png, image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        {imageSrc && (
          <div className="flex flex-col gap-1 pl-2 text-xs">
            <p className="font-medium text-gray-700">Remove Background</p>
            <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-2.5">
              <input
                type="checkbox"
                className="sr-only peer"
                onChange={() => {
                  const nextVal = !removeBackground;
                  setRemoveBackground(nextVal);

                  if (typeof data.image_url === 'string') {
                    let url = data.image_url.replace(/[\?&]tr=e-bgremove/g, '');
                    if (nextVal && !url.startsWith('data:')) {
                      url += (url.includes('?') ? '&' : '?') + 'tr=e-bgremove';
                    }
                    onChange({ ...data, image_url: url });
                  }
                }}
                checked={removeBackground}
              />
              <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-[#F46200] transition-colors duration-200"></div>
              <span className="dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
            </label>
          </div>
        )}
      </div>

      <div className="space-y-4 mt-6">
        {fields.map((field) => {
          const Icon = field.icon;
          return (
            <div key={field.key} className="space-y-1">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Icon className="size-4 text-[#8A847C]" />
                <span>{field.label}</span>
                {field.required && <span className="text-red-500">*</span>}
              </label>
              <input
                type={field.type}
                value={data[field.key] || ''}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F46200]/20 focus:border-[#F46200] outline-none transition-all text-sm text-[#2D2D2D]"
                placeholder={`Enter your ${field.label.toLowerCase()}`}
                required={field.required}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PersonalInfoForm;
