import { useState, useEffect } from 'react';
import { Department, Employee } from '../types';

interface DepartmentFormProps {
    departmentToEdit: Department | null;
    managers: Employee[];
    onSave: (departmentData: Omit<Department, 'id'>) => void;
    onCancel: () => void;
}

const DepartmentForm = ({ departmentToEdit, managers, onSave, onCancel }: DepartmentFormProps) => {
    const [name, setName] = useState('');
    const [managerId, setManagerId] = useState<string | null>(null);

    useEffect(() => {
        if (departmentToEdit) {
            setName(departmentToEdit.name);
            setManagerId(departmentToEdit.managerId);
        } else {
            setName('');
            setManagerId(managers.length > 0 ? managers[0].id : null);
        }
    }, [departmentToEdit, managers]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) {
            alert("Department Name is required.");
            return;
        }
        onSave({ name, managerId });
    };

    return (
        <div className="form-container">
            <h3>{departmentToEdit ? 'Update Department' : 'Create New Department'}</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="dep-name">Department Name</label>
                        <input id="dep-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="dep-manager">Designated Manager</label>
                        <select id="dep-manager" value={managerId || ''} onChange={(e) => setManagerId(e.target.value || null)}>
                            <option value="">Select a Manager</option>
                            {managers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}>
                        </select>
                    </div>
                </div>
                 <div className="form-actions">
                    <button type="submit" className="btn-primary">Save</button>
                    <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default DepartmentForm;
