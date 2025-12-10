// frontend/src/pages/AdminPage.tsx

import React, { useState, useEffect } from 'react';
import { getUsers, updateUserRole, getAuditLogs } from '../api/userApi';
import { type AuthUser } from '../types/Hero'; 

const AdminPage: React.FC = () => {
    const [users, setUsers] = useState<AuthUser[]>([]);
    const [logs, setLogs] = useState<any[]>([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Charger les données (utilisateurs et logs)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersData, logsData] = await Promise.all([
                    getUsers(),
                    getAuditLogs()
                ]);
                setUsers(usersData);
                setLogs(logsData);
            } catch (err) {
                setError("Accès refusé ou impossible de charger les données (Admin seulement ?).");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Gérer le changement de rôle
    const handleRoleChange = async (userId: string, newRole: 'admin' | 'editor' | 'visitor') => {
        try {
            const updatedUser = await updateUserRole(userId, newRole);
            
            // Mettre à jour l'état local
            setUsers(users.map(user => 
                user.id === userId ? { ...user, role: updatedUser.role } : user
            ));
        } catch (err) {
            setError("Impossible de changer le rôle. Veuillez réessayer.");
        }
    };

    if (loading) return <div className="admin-container"><p>Chargement du panneau d'administration...</p></div>;
    if (error) return <div className="admin-container"><p className="error">{error}</p></div>;

    return (
        <div className="admin-container">
            <h1>Panneau d'Administration 🛡️</h1>

            {/* 1. Gestion des Utilisateurs */}
            <section className="user-management">
                <h2>Utilisateurs Enregistrés</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nom d'utilisateur</th>
                            <th>Rôle actuel</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id.substring(0, 8)}...</td>
                                <td>{user.username}</td>
                                <td>{user.role}</td>
                                <td>
                                    <select 
                                        value={user.role} 
                                        onChange={(e) => 
                                            handleRoleChange(user.id, e.target.value as 'admin' | 'editor' | 'visitor')
                                        }
                                        // Empêcher l'utilisateur de changer son propre rôle via cette interface
                                        disabled={user.id === localStorage.getItem('user')?.id}
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="editor">Éditeur</option>
                                        <option value="visitor">Visiteur</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* 2. Journalisation (Audit Log) */}
            <section className="audit-log">
                <h2>Historique des Modifications (Logs)</h2>
                {/* La gestion de l'historique des actions est un bonus [cite: 69] */}
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Utilisateur</th>
                            <th>Action</th>
                            <th>Détails</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log, index) => (
                            <tr key={index}>
                                <td>{new Date(log.timestamp).toLocaleDateString()}</td>
                                <td>{log.user}</td>
                                <td>{log.action}</td>
                                <td>{log.details}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {logs.length === 0 && <p>Aucun événement journalisé trouvé.</p>}
            </section>
        </div>
    );
};

export default AdminPage;