"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { Contact } from '@/app/type';
import ContactForm from '@/app/components/ContactForm'; // Assurez-vous du bon chemin d'importation

const ContactDetail: React.FC = () => {
    const { id } = useParams();
    const [contact, setContact] = useState<Contact | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        if (!id) return;

        const fetchContact = async () => {
            try {
                const response = await axios.get<Contact>(`http://localhost:8000/contacts/${id}`);
                setContact(response.data);
            } catch (error) {
                setError('Erreur lors de la récupération des détails du contact');
            } finally {
                setLoading(false);
            }
        };

        fetchContact();
    }, [id]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleDeleteClick = async () => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) {
            try {
                await axios.delete(`http://localhost:8000/contacts/${id}`);
                router.push('/'); // Redirige vers la page d'accueil après suppression
            } catch (error) {
                console.error('Erreur lors de la suppression du contact:', error);
                setError('Erreur lors de la suppression du contact');
            }
        }
    };

    const handleFormSubmit = async () => {
        // Recharger les détails du contact après modification
        try {
            const response = await axios.get<Contact>(`http://localhost:8000/contacts/${id}`);
            setContact(response.data);
            setIsEditing(false); // Fermer le formulaire après la soumission réussie
        } catch (error) {
            console.error('Erreur lors de la mise à jour des détails du contact:', error);
            setError('Erreur lors de la mise à jour du contact');
        }
    };

    const handleBackClick = () => {
        router.push('/'); // Redirige vers la liste des contacts
    };

    if (loading) {
        return <p>Chargement...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!contact) {
        return <p>Contact non trouvé</p>;
    }

    return (
        <div>
            <button onClick={handleBackClick}>Retour à la liste</button>
            <h1>Détails du Contact</h1>
            {isEditing ? (
                <ContactForm
                    contact={contact}
                    isEditMode={true}
                    onCancel={handleCancelEdit}
                    onSuccess={handleFormSubmit} // Ajouter une prop pour gérer la soumission réussie
                />
            ) : (
                <div>
                    <p><strong>Prénom:</strong> {contact.prenom}</p>
                    <p><strong>Nom:</strong> {contact.nom}</p>
                    <p><strong>Email:</strong> {contact.email}</p>
                    <p><strong>Téléphone:</strong> {contact.telephone}</p>
                    <p><strong>Ville:</strong> {contact.ville}</p>
                    <p><strong>Créé le:</strong> {new Date(contact.created_at).toLocaleString()}</p>
                    <p><strong>Mis à jour le:</strong> {new Date(contact.updated_at).toLocaleString()}</p>
                    <button onClick={handleEditClick}>Modifier</button>
                    <button onClick={handleDeleteClick}>Supprimer</button>
                </div>
            )}
        </div>
    );
};

export default ContactDetail;
