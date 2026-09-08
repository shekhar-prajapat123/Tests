import { useState, useEffect } from 'react';
import { Employee, Department, Role } from '../types';

interface EmployeeFormProps {
    employeeToEdit: Employee | null;
    departments: Department[];
    onSave: (employeeData: Omit<Employee, 'id' | 'status'> | Partial<Employee>) => void;
    onCancel: () => void;
}

const ROLES: Role[] = ["Employee", "Manager", "Admin"];

const EmployeeForm = ({ employeeToEdit, departments, onSave, onCancel }: EmployeeFormProps) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<Role>('Employee');
    const [departmentId, setDepartmentId] = useState<string | null>(null);

    useEffect(() => {
        if (employeeToEdit) {
            setName(employeeToEdit.name);
            setEmail(employeeToEdit.email);
            setRole(employeeToEdit.role);
            setDepartmentId(employeeToEdit.departmentId);
        } else {
            setName('');
            setEmail('');
            setRole('Employee');
            setDepartmentId(departments.length > 0 ? departments[0].id : null);
        }
    }, [employeeToEdit, departments]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const employeeData = { name, email, role, departmentId };
        onSave(employeeData);
    };

    return (
        <div className="form-container">
            <h3>{employeeToEdit ? 'Update Employee Account' : 'Create New Employee Account'}</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="role">Role</label>
                        <select id="role" value={role} onChange={(e) => setRole(e.target.value as Role)} required>
                            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="department">Department</label>
                        <select id="department" value={departmentId || ''} onChange={(e) => setDepartmentId(e.target.value || null)}>
                            <option value="">No Department</option>
                            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}>
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

export default EmployeeForm;
