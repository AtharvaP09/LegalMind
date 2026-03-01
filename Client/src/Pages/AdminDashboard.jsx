import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiUserPlus, FiTrash2, FiLogOut } from 'react-icons/fi';
import API from '../api';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        is_admin: false
    });

    const navigate = useNavigate();

    // Verify admin status on mount
    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                const response = await API.get('/api/session', { withCredentials: true });
                if (!response.data.logged_in || !response.data.is_admin) {
                    navigate('/UserLogin');
                } else {
                    fetchUsers();
                }
            } catch (error) {
                navigate('/UserLogin');
            }
        };
        checkAdminStatus();
    }, [navigate]);

    const fetchUsers = async () => {
        try {
            const response = await API.get('/api/admin/users', { withCredentials: true });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('Failed to fetch users. Ensure you have admin privileges.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId, username) => {
        if (username === 'admin') {
            alert('Cannot delete the master admin user.');
            return;
        }

        if (window.confirm(`Are you sure you want to delete user "${username}"? This will also delete all their documents.`)) {
            try {
                await API.delete(`/api/admin/users/${userId}`, { withCredentials: true });
                setUsers(users.filter(u => u.id !== userId));
            } catch (error) {
                console.error('Error deleting user:', error);
                alert(error.response?.data?.message || 'Failed to delete user.');
            }
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            await API.post('/api/admin/users', formData, { withCredentials: true });
            alert('User added successfully!');
            setShowModal(false);
            setFormData({ username: '', email: '', password: '', is_admin: false });
            fetchUsers(); // Refresh the list
        } catch (error) {
            console.error('Error adding user:', error);
            alert(error.response?.data?.message || 'Failed to add user.');
        }
    };

    const handleLogout = async () => {
        try {
            await API.post('/api/UserLogout', {}, { withCredentials: true });
            sessionStorage.clear();
            navigate('/UserLogin');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    if (loading) return <div className="admin-dashboard-container">Loading Admin Panel...</div>;

    return (
        <div className="admin-dashboard-container">
            <div className="admin-header">
                <div>
                    <h1 className="admin-title"><FiUsers style={{ marginRight: '10px' }} /> Admin Dashboard</h1>
                    <p>Manage LegalMind users and system access</p>
                </div>
                <div className="admin-actions">
                    <button className="btn-add" onClick={() => setShowModal(true)}>
                        <FiUserPlus /> Add New User
                    </button>
                    <button className="btn-cancel" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiLogOut /> Logout
                    </button>
                </div>
            </div>

            <div className="admin-glass-panel">
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>#{user.id}</td>
                                    <td style={{ fontWeight: 500 }}>{user.username}</td>
                                    <td style={{ color: '#9ca3af' }}>{user.email}</td>
                                    <td>
                                        <span className={user.is_admin ? 'admin-badge' : 'user-badge'}>
                                            {user.is_admin ? 'Admin' : 'User'}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn-delete"
                                            onClick={() => handleDeleteUser(user.id, user.username)}
                                            disabled={user.username === 'admin'}
                                            title={user.username === 'admin' ? "Master admin cannot be deleted" : "Delete user"}
                                        >
                                            <FiTrash2 /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                                        No users found in the database.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add User Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="modal-title">Create New User</h2>
                        <form onSubmit={handleAddUser}>
                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    placeholder="Enter username"
                                />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="Enter email address"
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Create password"
                                    minLength="6"
                                />
                            </div>
                            <div className="checkbox-group">
                                <input
                                    type="checkbox"
                                    id="admin-check"
                                    checked={formData.is_admin}
                                    onChange={(e) => setFormData({ ...formData, is_admin: e.target.checked })}
                                />
                                <label htmlFor="admin-check" style={{ marginBottom: 0, cursor: 'pointer' }}>Grant Admin Privileges</label>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-add">
                                    Create User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
