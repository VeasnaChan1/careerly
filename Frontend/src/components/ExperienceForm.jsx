import { Briefcase, Plus, Trash2 } from 'lucide-react';
import React from 'react';
import RichTextEditor from './RichTextEditor';

const ExperienceForm = ({ data, onChange }) => {
  const addExperience = () => {
    const newExperience = {
      company: '',
      position: '',
      start_date: '',
      end_date: '',
      description: '',
      is_current: false
    };
    onChange([...data, newExperience]);
  };

  const removeExperience = (index) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateExperience = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">Professional Experience</h3>
          <p className="text-sm text-gray-500">Add your past work experiences here</p>
        </div>

        <button
          type="button"
          onClick={addExperience}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="size-3.5" />
          Add Experience
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
          <Briefcase className="size-8 mx-auto text-gray-400 mb-2" />
          <p className="text-sm font-medium text-gray-600">No experience added</p>
          <button
            type="button"
            onClick={addExperience}
            className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700 underline cursor-pointer"
          >
            + Add your first work experiences
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {data.map((exp, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-xl bg-white shadow-xs space-y-4 relative">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Experience #{index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded cursor-pointer"
                  title="Remove Experience"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Position / Job Title</label>
                  <input
                    type="text"
                    spellCheck="true"
                    lang="en"
                    value={exp.position || exp.job_title || ''}
                    onChange={(e) => {
                      updateExperience(index, 'position', e.target.value);
                      updateExperience(index, 'job_title', e.target.value);
                    }}
                    placeholder="e.g. Frontend Developer"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={exp.company || ''}
                    onChange={(e) => updateExperience(index, 'company', e.target.value)}
                    placeholder="e.g. Smart Axiata"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="month"
                    value={exp.start_date || ''}
                    onChange={(e) => updateExperience(index, 'start_date', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="month"
                    disabled={exp.is_current}
                    value={exp.end_date || ''}
                    onChange={(e) => updateExperience(index, 'end_date', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-400"
                  />
                  <label className="inline-flex items-center gap-2 mt-2 cursor-pointer text-xs text-gray-600">
                    <input
                      type="checkbox"
                      checked={!!exp.is_current}
                      onChange={(e) => {
                        updateExperience(index, 'is_current', e.target.checked);
                        if (e.target.checked) updateExperience(index, 'end_date', 'Present');
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    I currently work here
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Responsibilities & Achievements</label>
                <RichTextEditor
                  value={exp.description || ''}
                  onChange={(val) => updateExperience(index, 'description', val)}
                  placeholder="• Developed and maintained key features..."
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperienceForm;
