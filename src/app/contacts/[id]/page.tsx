"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { Contact } from '@/app/type';
import ContactForm from '@/app/components/ContactForm';
import { PencilSquareIcon, TrashIcon, ArrowLeftIcon } from '@heroicons/react/24/solid'; // Importer les icônes

// Composant de détail du contact
const ContactDetail: React.FC = () => {
    // Extraction de l'ID du contact depuis les paramètres de l'URL
    const { id } = useParams();
    const [contact, setContact] = useState<Contact | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const router = useRouter();

    // Chargement des détails du contact lors du montage du composant
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

    // Fonction pour basculer en mode édition
    const handleEditClick = () => {
        setIsEditing(true);
    };

    // Fonction pour annuler l'édition
    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    // Fonction pour supprimer un contact
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

    // Fonction appelée après la soumission du formulaire d'édition
    const handleFormSubmit = async () => {
        try {
            const response = await axios.get<Contact>(`http://localhost:8000/contacts/${id}`);
            setContact(response.data);
            setIsEditing(false); // Fermer le formulaire après la soumission réussie
        } catch (error) {
            console.error('Erreur lors de la mise à jour des détails du contact:', error);
            setError('Erreur lors de la mise à jour du contact');
        }
    };

    // Fonction pour retourner à la liste des contacts
    const handleBackClick = () => {
        router.push('/'); // Redirige vers la liste des contacts
    };

    // Gestion des états de chargement, d'erreur et d'absence de contact
    if (loading) {
        return <p className="text-white">Chargement...</p>;
    }

    if (error) {
        return <p className="text-white">{error}</p>;
    }

    if (!contact) {
        return <p className="text-white">Contact non trouvé</p>;
    }

    return (
        <div className="max-w-md mx-auto p-4 bg-gray-800 text-white shadow-md rounded-lg relative">
            {/* Header avec icônes pour la navigation et les actions */}
            <div className="flex items-center mb-4">
                <button 
                    onClick={handleBackClick} 
                    className="mr-4 p-2 bg-gray-600 rounded-full hover:bg-gray-700"
                >
                    <ArrowLeftIcon className="w-6 h-6 text-white" />
                </button>
                <h1 className="text-xl font-bold flex-grow text-center">Détails du Contact</h1>
                <div className="flex space-x-2">
                    {!isEditing && (
                        <>
                            <button 
                                onClick={handleEditClick} 
                                className="p-2 bg-yellow-600 rounded-full hover:bg-yellow-700"
                            >
                                <PencilSquareIcon className="w-6 h-6 text-white" />
                            </button>
                            <button 
                                onClick={handleDeleteClick} 
                                className="p-2 bg-red-600 rounded-full hover:bg-red-700"
                            >
                                <TrashIcon className="w-6 h-6 text-white" />
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Contenu des détails ou formulaire d'édition */}
            {isEditing ? (
                <ContactForm
                    contact={contact}
                    isEditMode={true}
                    onCancel={handleCancelEdit}
                    onSuccess={handleFormSubmit} // Gestion de la soumission réussie du formulaire
                />
            ) : (
                <div>
                    <p className="text-white"><strong>Prénom:</strong> {contact.prenom}</p>
                    <p className="text-white"><strong>Nom:</strong> {contact.nom}</p>
                    <p className="text-white"><strong>Email:</strong> {contact.email}</p>
                    <p className="text-white"><strong>Téléphone:</strong> {contact.telephone}</p>
                    <p className="text-white"><strong>Ville:</strong> {contact.ville}</p>
                    <p className="text-white"><strong>Créé le:</strong> {new Date(contact.created_at).toLocaleString()}</p>
                    <p className="text-white"><strong>Mis à jour le:</strong> {new Date(contact.updated_at).toLocaleString()}</p>
                </div>
            )}
        </div>
    );
};

export default ContactDetail;
