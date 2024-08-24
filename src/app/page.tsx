"use client";

import React, { useState } from 'react';
import ContactForm from '@/app/components/ContactForm';
import ContactList from '@/app/components/ContactList';

const HomePage: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [refresh, setRefresh] = useState(false);

    const handleAddContactClick = () => {
        setShowForm(true);
    };

    const handleFormCancel = () => {
        setShowForm(false);
    };

    const handleFormSuccess = () => {
        setShowForm(false); // Fermer le formulaire après une soumission réussie
        setRefresh(prev => !prev); // Déclencher le rafraîchissement
    };

    return (
        <div>
            <h1>Liste des Contacts</h1>
            <button onClick={handleAddContactClick}>Ajouter un contact</button>
            {showForm && (
                <ContactForm
                    onCancel={handleFormCancel}
                    onSuccess={handleFormSuccess} // Passer la fonction de succès
                />
            )}
            <ContactList refresh={refresh} /> {/* Passer l'état de rafraîchissement */}
        </div>
    );
};

export default HomePage;
