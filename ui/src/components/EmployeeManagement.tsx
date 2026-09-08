import { useState, useEffect } from 'react';
import { Employee, Department } from '../types';
import * as api from '../api';
import EmployeeForm from './EmployeeForm';

const EmployeeManagement = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const departmentMap = new Map(departments.map(d => [d.id, d.name]));

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [emps, deps] = await Promise.all([api.fetchEmployees(), api.fetchDepartments()]);
            setEmployees(emps);
            setDepartments(deps);
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCreateNew = () => {
        setEditingEmployee(null);
        setIsFormVisible(true);
    };

    const handleUpdate = (employee: Employee) => {
        setEditingEmployee(employee);
        setIsFormVisible(true);
    };

    const handleDeactivate = async (employeeId: string) => {
        if (window.confirm("Are you sure you want to deactivate this employee account?")) {
            await api.deactivateEmployee(employeeId);
            await loadData(); // Reload data to reflect changes
        }
    };

    const handleSaveEmployee = async (employeeData: Omit<Employee, 'id' | 'status'> | Partial<Employee>) => {
        if (editingEmployee) {
            await api.updateEmployee(editingEmployee.id, employeeData);
        } else {
            await api.createEmployee(employeeData as Omit<Employee, 'id' | 'status'>);
        }
        await loadData();
        setIsFormVisible(false);
        setEditingEmployee(null);
    };
    
    const handleCancel = () => {
        setIsFormVisible(false);
        setEditingEmployee(null);
    };

    if (isLoading) {
        return <div>Loading employee data...</div>;
    }

    return (
        <div className="management-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Employee Accounts</h2>
                {!isFormVisible && (
                     <button className="btn-success" onClick={handleCreateNew}>Create New Employee Account</button>
                )}
            </div>

            {isFormVisible && (
                <EmployeeForm 
                    employeeToEdit={editingEmployee}
                    departments={departments}
                    onSave={handleSaveEmployee}
                    onCancel={handleCancel}
                />
            )}
            
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(employee => (
                        <tr key={employee.id}>
                            <td>{employee.name}</td>
                            <td>{employee.email}</td>
                            <td>{employee.departmentId ? departmentMap.get(employee.departmentId) || 'N/A' : 'N/A'}</td>
                            <td>{employee.role}</td>
                            <td>{employee.status}</td>
                            <td className="actions-cell">
                                <button className="btn-primary" onClick={() => handleUpdate(employee)}>Update</button>
                                {employee.status === 'Active' && (
                                    <button className="btn-danger" onClick={() => handleDeactivate(employee.id)}>Deactivate</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EmployeeManagement;
