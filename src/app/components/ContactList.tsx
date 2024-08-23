// app/components/ContactList.tsx
"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Contact } from '../type';

const ContactList: React.FC = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await axios.get<Contact[]>('http://localhost:8000/contacts');
                setContacts(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des contacts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchContacts();
    }, []);

    if (loading) {
        return <p>Chargement...</p>;
    }

    return (
        <div>
            <h1>Liste des Contacts</h1>
            <ul>
                {contacts.map(contact => (
                    <li key={contact.id}>
                        {contact.prenom} {contact.nom} - {contact.email}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ContactList;
