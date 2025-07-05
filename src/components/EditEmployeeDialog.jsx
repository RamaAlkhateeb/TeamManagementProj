import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { User, CalendarDays, Mail, Phone, MapPin, BadgeCheck } from "lucide-react";

export default function EditEmployeeDialog({ open, onClose, editing, onChange, onSave }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl border-2 border-navy-900 rounded-3xl bg-white shadow-lg p-8">
        <DialogHeader>
          <DialogTitle className="text-3xl font-extrabold text-navy-900 mb-6 text-center">
            {editing?.id ? "Edit Employee" : "Add Employee"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div>
            <label className="flex items-center gap-2 text-navy-700 font-semibold mb-1 text-sm">
              <User size={20} /> First Name
            </label>
            <Input name="firstName" value={editing?.firstName || ''} onChange={onChange} placeholder="First Name" />
          </div>

          <div>
            <label className="flex items-center gap-2 text-navy-700 font-semibold mb-1 text-sm">
              <User size={20} /> Last Name
            </label>
            <Input name="lastName" value={editing?.lastName || ''} onChange={onChange} placeholder="Last Name" />
          </div>

          <div>
            <label className="flex items-center gap-2 text-navy-700 font-semibold mb-1 text-sm">
              <Mail size={20} /> Email
            </label>
            <Input name="email" value={editing?.email || ''} onChange={onChange} placeholder="Email" />
          </div>

          <div>
            <label className="flex items-center gap-2 text-navy-700 font-semibold mb-1 text-sm">
              <Phone size={20} /> Phone
            </label>
            <Input name="phone" value={editing?.phone || ''} onChange={onChange} placeholder="Phone" />
          </div>

          <div>
            <label className="flex items-center gap-2 text-navy-700 font-semibold mb-1 text-sm">
              <BadgeCheck size={20} /> National ID
            </label>
            <Input name="nationalIdentificationNumber" value={editing?.nationalIdentificationNumber || ''} onChange={onChange} placeholder="National ID" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-navy-700 font-semibold mb-1 text-sm">
                <CalendarDays size={20} /> Birth Date
              </label>
             <Input
  type="date"
  name="birthDate"
  value={editing?.birthDate?.split('T')?.[0] || ''}
  onChange={onChange}
/>

            </div>
            <div>
              <label className="flex items-center gap-2 text-navy-700 font-semibold mb-1 text-sm">
                <CalendarDays size={20} /> Hire Date
              </label>
             <Input
  type="date"
  name="hireDate"
  value={editing?.hireDate?.split('T')?.[0] || ''}
  onChange={onChange}
/>

            </div>
          </div>

        </div>

        <DialogFooter className="mt-6 flex justify-end gap-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
