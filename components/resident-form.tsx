import { useState } from 'react';
import { ArrowLeft, Save, QrCode } from 'lucide-react';
import { Button } from './ui/button';
import { Resident } from "@/app/officials/residentinformation/mockResidents"

export interface ResidentFormProps {
  resident: Partial<Resident> | null;
  onSave: (resident: Resident) => void;
  onBack?: () => void;
}

export default function ResidentForm({ resident, onBack, onSave }: ResidentFormProps) {
  const [formData, setFormData] = useState<Partial<Resident>>(
    resident || {
      firstName: '',
      middleName: '',
      lastName: '',
      birthDate: '',
      sex: 'Male',
      civilStatus: 'Single',
      contactNumber: '',
      email: '',
      residentType: 'Local',
      isHeadOfFamily: false,
      familyId: '',
      relationshipToHead: 'Head',
      houseNumber: '',
      street: '',
      purok: 'Purok 1',
      city: 'Quezon City',
      province: 'Metro Manila',
      vulnerableTypes: [],
      status: 'Active',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.id) formData.id = `RES-${Math.floor(Math.random()*1000).toString().padStart(3,'0')}`;
        onSave(formData as Resident);
        onBack?.();   
   };

  const handleVulnerableTypeChange = (type: string) => {
    const current = formData.vulnerableTypes || [];
    if (current.includes(type)) {
      setFormData({
        ...formData,
        vulnerableTypes: current.filter(t => t !== type),
      });
    } else {
      setFormData({
        ...formData,
        vulnerableTypes: [...current, type],
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl">{resident ? 'Edit Resident' : 'Add New Resident'}</h2>
          <p className="text-gray-600">Fill in the resident information below</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">First Name *</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Middle Name</label>
              <input
                type="text"
                value={formData.middleName}
                onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Last Name *</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Birth Date *</label>
              <input
                type="date"
                required
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Sex *</label>
              <select
                required
                value={formData.sex}
                onChange={(e) => setFormData({ ...formData, sex: e.target.value as 'Male' | 'Female' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Civil Status *</label>
              <select
                required
                value={formData.civilStatus}
                onChange={(e) => setFormData({ ...formData, civilStatus: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Widow">Widow/Widower</option>
                <option value="Separated">Separated</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Contact Number *</label>
              <input
                type="tel"
                required
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0917-123-4567"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Resident Type *</label>
              <select
                required
                value={formData.residentType}
                onChange={(e) => setFormData({ ...formData, residentType: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Local">Local</option>
                <option value="Boarder">Boarder</option>
                <option value="Old Resident">Old Resident</option>
              </select>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg mb-4">Address Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">House Number *</label>
              <input
                type="text"
                required
                value={formData.houseNumber}
                onChange={(e) => setFormData({ ...formData, houseNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Street *</label>
              <input
                type="text"
                required
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Purok *</label>
              <select
                required
                value={formData.purok}
                onChange={(e) => setFormData({ ...formData, purok: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Purok 1">Purok 1</option>
                <option value="Purok 2">Purok 2</option>
                <option value="Purok 3">Purok 3</option>
                <option value="Purok 4">Purok 4</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">City *</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Family Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg mb-4">Family Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Family ID *</label>
              <input
                type="text"
                required
                value={formData.familyId}
                onChange={(e) => setFormData({ ...formData, familyId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="FAM-001"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Relationship to Head *</label>
              <select
                required
                value={formData.relationshipToHead}
                onChange={(e) => setFormData({ ...formData, relationshipToHead: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Head">Head</option>
                <option value="Spouse">Spouse</option>
                <option value="Child">Child</option>
                <option value="Parent">Parent</option>
                <option value="Sibling">Sibling</option>
                <option value="Boarder">Boarder</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex items-center gap-2 pt-8">
              <input
                type="checkbox"
                checked={formData.isHeadOfFamily}
                onChange={(e) => setFormData({ ...formData, isHeadOfFamily: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="text-sm text-gray-700">Head of Family</label>
            </div>
          </div>
        </div>

        {/* Vulnerable Sector */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg mb-4">Vulnerable Sector Classification</h3>
          <div className="space-y-2">
            {['PWD', 'Senior Citizen', 'Solo Parent', 'Indigent'].map((type) => (
              <label key={type} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.vulnerableTypes?.includes(type)}
                  onChange={() => handleVulnerableTypeChange(type)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg mb-4">Status</h3>
          <select
            required
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Transferred Out">Transferred Out</option>
            <option value="Deceased">Deceased</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            <Save className="w-5 h-5" />
            {resident ? 'Update Resident' : 'Add Resident'}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
