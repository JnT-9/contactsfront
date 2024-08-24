"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Contact } from '../type'; // Assurez-vous que ce chemin est correct
import { useRouter } from 'next/navigation'; // Importer useRouter pour la navigation

interface ContactListProps {
    refresh: boolean; // Ajouter un prop pour le rafraîchissement
}

const ContactList: React.FC<ContactListProps> = ({ refresh }) => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedFields, setSelectedFields] = useState({
        prenom: true,
        nom: true,
        email: true,
        telephone: true,
        ville: true,
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [searchField, setSearchField] = useState('nom');
    const router = useRouter(); // Utiliser useRouter pour la navigation

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await axios.get<Contact[]>('http://localhost:8000/contacts');
                setContacts(response.data);
                setFilteredContacts(response.data); // Initialize filtered contacts
            } catch (error) {
                console.error('Erreur lors de la récupération des contacts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchContacts();
    }, [refresh]); // Dépendance sur refresh

    useEffect(() => {
        // Filter contacts based on search query and search field
        const results = contacts.filter(contact => {
            const fieldValue = contact[searchField as keyof Contact]?.toString().toLowerCase() || '';
            return fieldValue.includes(searchQuery.toLowerCase());
        });
        setFilteredContacts(results);
    }, [searchQuery, searchField, contacts]);

    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFields(prevFields => ({
            ...prevFields,
            [e.target.name]: e.target.checked,
        }));
    };

    const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSearchField(e.target.value);
    };

    const handleRowClick = (id: number) => {
        router.push(`/contacts/${id}`);
    };

    if (loading) {
        return <p>Chargement...</p>;
    }

    return (
        <div>
            <h2>Choisir les champs à afficher</h2>
            <div>
                <label>
                    <input
                        type="checkbox"
                        name="prenom"
                        checked={selectedFields.prenom}
                        onChange={handleFieldChange}
                    />
                    Prénom
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="nom"
                        checked={selectedFields.nom}
                        onChange={handleFieldChange}
                    />
                    Nom
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="email"
                        checked={selectedFields.email}
                        onChange={handleFieldChange}
                    />
                    Email
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="telephone"
                        checked={selectedFields.telephone}
                        onChange={handleFieldChange}
                    />
                    Téléphone
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="ville"
                        checked={selectedFields.ville}
                        onChange={handleFieldChange}
                    />
                    Ville
                </label>
            </div>

            <div>
                <label>
                    Recherche :
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchQueryChange}
                        placeholder="Rechercher..."
                    />
                </label>
                <label>
                    Par :
                    <select value={searchField} onChange={handleSearchFieldChange}>
                        <option value="prenom">Prénom</option>
                        <option value="nom">Nom</option>
                        <option value="email">Email</option>
                        <option value="telephone">Téléphone</option>
                        <option value="ville">Ville</option>
                    </select>
                </label>
            </div>

            <table>
                <thead>
                    <tr>
                        {selectedFields.prenom && <th>Prénom</th>}
                        {selectedFields.nom && <th>Nom</th>}
                        {selectedFields.email && <th>Email</th>}
                        {selectedFields.telephone && <th>Téléphone</th>}
                        {selectedFields.ville && <th>Ville</th>}
                    </tr>
                </thead>
                <tbody>
                    {filteredContacts.map(contact => (
                        <tr key={contact.id} onClick={() => handleRowClick(contact.id)} style={{ cursor: 'pointer' }}>
                            {selectedFields.prenom && <td>{contact.prenom}</td>}
                            {selectedFields.nom && <td>{contact.nom}</td>}
                            {selectedFields.email && <td>{contact.email}</td>}
                            {selectedFields.telephone && <td>{contact.telephone}</td>}
                            {selectedFields.ville && <td>{contact.ville}</td>}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ContactList;
