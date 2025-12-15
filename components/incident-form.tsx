'use client'

import { useState } from 'react'
import { ArrowLeft, Save } from 'lucide-react'
import { Incident } from "@/app/officials/peaceandorder/incidents/mockIncidents"
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface IncidentFormProps {
  incident: Partial<Incident> | null
  onBack: () => void
  onSave: (incident: Incident) => void
}

export default function IncidentForm({ incident, onBack, onSave}: IncidentFormProps) {
  const [formData, setFormData] = useState<Partial<Incident>>({
    incidentId: incident?.incidentId, // ✅ Fixed: use incidentId
    dateReported: incident?.dateReported || new Date().toISOString().split('T')[0],
    timeReported: incident?.timeReported || new Date().toTimeString().slice(0, 5),
    type: incident?.type || 'Noise Complaint',
    location: incident?.location || '',
    purok: incident?.purok || 'Purok 1',
    reportedBy: incident?.reportedBy || '',
    description: incident?.description || '',
    involvedParties: incident?.involvedParties || [],
    status: incident?.status || 'Pending',
    assignedOfficer: incident?.assignedOfficer || '',
    dateResolved: incident?.dateResolved,
    notes: incident?.notes || '',
  })

  const [partyInput, setPartyInput] = useState('')

  const handleChange = (key: keyof Incident, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const addParty = () => {
    if (!partyInput.trim()) return
    setFormData(prev => ({
      ...prev,
      involvedParties: [...(prev.involvedParties || []), partyInput],
    }))
    setPartyInput('')
  }

  const removeParty = (index: number) => {
    setFormData(prev => ({
      ...prev,
      involvedParties: (prev.involvedParties || []).filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Cast to full Incident
    const completeIncident: Incident = {
      ...formData,
      involvedParties: formData.involvedParties || [],
      dateResolved: formData.dateResolved,
      notes: formData.notes || '',
    } as Incident

    onSave(completeIncident)
    onBack()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button onClick={onBack} variant="outline" className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-2xl">{incident ? 'Edit Incident' : 'Report New Incident'}</h2>
          <p className="text-gray-600">Fill in the incident details below</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Incident Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          <h3 className="text-lg font-semibold">Incident Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateReported">Date Reported *</Label>
              <Input
                id="dateReported"
                type="date"
                required
                value={formData.dateReported}
                onChange={e => handleChange('dateReported', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="timeReported">Time Reported *</Label>
              <Input
                id="timeReported"
                type="time"
                required
                value={formData.timeReported}
                onChange={e => handleChange('timeReported', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="type">Incident Type *</Label>
              <Select
                value={formData.type}
                onValueChange={val => handleChange('type', val)}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Noise Complaint">Noise Complaint</SelectItem>
                  <SelectItem value="Theft">Theft</SelectItem>
                  <SelectItem value="Disturbance">Disturbance</SelectItem>
                  <SelectItem value="Traffic Violation">Traffic Violation</SelectItem>
                  <SelectItem value="Vandalism">Vandalism</SelectItem>
                  <SelectItem value="Curfew Violation">Curfew Violation</SelectItem>
                  <SelectItem value="Domestic Dispute">Domestic Dispute</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="purok">Purok / Zone *</Label>
              <Select
                value={formData.purok}
                onValueChange={val => handleChange('purok', val)}
              >
                <SelectTrigger id="purok">
                  <SelectValue placeholder="Select Purok" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Purok 1">Purok 1</SelectItem>
                  <SelectItem value="Purok 2">Purok 2</SelectItem>
                  <SelectItem value="Purok 3">Purok 3</SelectItem>
                  <SelectItem value="Purok 4">Purok 4</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                type="text"
                required
                placeholder="Specific location"
                value={formData.location}
                onChange={e => handleChange('location', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="reportedBy">Reported By *</Label>
              <Input
                id="reportedBy"
                type="text"
                required
                placeholder="Name of reporter"
                value={formData.reportedBy}
                onChange={e => handleChange('reportedBy', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="assignedOfficer">Assigned Officer *</Label>
              <Input
                id="assignedOfficer"
                type="text"
                required
                placeholder="Officer assigned"
                value={formData.assignedOfficer}
                onChange={e => handleChange('assignedOfficer', e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                rows={4}
                required
                placeholder="Detailed description of incident"
                value={formData.description}
                onChange={e => handleChange('description', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Involved Parties */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          <h3 className="text-lg font-semibold">Involved Parties</h3>

          <div className="flex gap-2 mb-2">
            <Input
              type="text"
              placeholder="Add party (name - role)"
              value={partyInput}
              onChange={e => setPartyInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addParty())}
            />
            <Button type="button" onClick={addParty}>Add</Button>
          </div>

          <div className="space-y-1">
            {(formData.involvedParties || []).map((party, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span>{party}</span>
                <Button variant="destructive" size="sm" onClick={() => removeParty(index)}>Remove</Button>
              </div>
            ))}
          </div>
        </div>

        {/* Status & Notes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          <h3 className="text-lg font-semibold">Status & Notes</h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={val => handleChange('status', val as Incident['status'])}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Investigating">Investigating</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="notes">Notes / Remarks</Label>
              <Textarea
                id="notes"
                rows={3}
                placeholder="Additional notes or actions"
                value={formData.notes}
                onChange={e => handleChange('notes', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" variant="default" className="flex items-center gap-2">
            <Save className="w-5 h-5" />
            {incident ? 'Update Incident' : 'Report Incident'}
          </Button>
          <Button type="button" variant="outline" onClick={onBack}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
