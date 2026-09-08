import { useState, useEffect } from 'react';
import { Department, Employee } from '../types';
import * as api from '../api';
import DepartmentForm from './DepartmentForm';

const DepartmentManagement = () => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const employeeMap = new Map(employees.map(e => [e.id, e.name]));
    const managers = employees.filter(e => e.role === 'Manager' && e.status === 'Active');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [deps, emps] = await Promise.all([api.fetchDepartments(), api.fetchEmployees()]);
            setDepartments(deps);
            setEmployees(emps);
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateNew = () => {
        setEditingDepartment(null);
        setIsFormVisible(true);
    };

    const handleUpdate = (department: Department) => {
        setEditingDepartment(department);
        setIsFormVisible(true);
    };

    const handleDelete = async (departmentId: string) => {
        if (window.confirm("Are you sure you want to delete this department? This will unassign all employees from it.")) {
            await api.deleteDepartment(departmentId);
            await loadData();
        }
    };
    
    const handleSaveDepartment = async (departmentData: Omit<Department, 'id'>) => {
        if (editingDepartment) {
            await api.updateDepartment(editingDepartment.id, departmentData);
        } else {
            await api.createDepartment(departmentData);
        }
        await loadData();
        setIsFormVisible(false);
        setEditingDepartment(null);
    };

    const handleCancel = () => {
        setIsFormVisible(false);
        setEditingDepartment(null);
    };
    
    if (isLoading) {
        return <div>Loading department data...</div>;
    }

    return (
        <div className="management-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Department Information</h2>
                {!isFormVisible && (
                    <button className="btn-success" onClick={handleCreateNew}>Create New Department</button>
                )}
            </div>

            {isFormVisible && (
                <DepartmentForm 
                    departmentToEdit={editingDepartment}
                    managers={managers}
                    onSave={handleSaveDepartment}
                    onCancel={handleCancel}
                />
            )}
            
            <table>
                <thead>
                    <tr>
                        <th>Department Name</th>
                        <th>Designated Manager</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {departments.map(department => (
                        <tr key={department.id}>
                            <td>{department.name}</td>
                            <td>{department.managerId ? employeeMap.get(department.managerId) || 'N/A' : 'Not Assigned'}</td>
                            <td className="actions-cell">
                                <button className="btn-primary" onClick={() => handleUpdate(department)}>Update</button>
                                <button className="btn-danger" onClick={() => handleDelete(department.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DepartmentManagement;
