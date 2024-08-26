"use client";

import React, { useState } from 'react';
import ContactForm from '@/app/components/ContactForm';
import ContactList from '@/app/components/ContactList';
import './tailwind.css';

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
        <div className="max-w-4xl mx-auto p-4 relative">
            <h1 className="text-2xl font-bold mb-4 text-center">Contacts</h1>
            <div className="overflow-x-auto mb-4">
                <ContactList refresh={refresh} />
            </div>
            {showForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
                    <div className="bg-gray-800 p-6 rounded-md shadow-lg max-w-sm w-full">
                        <ContactForm
                            onCancel={handleFormCancel}
                            onSuccess={handleFormSuccess} // Passer la fonction de succès
                        />
                    </div>
                </div>
            )}
            <button 
                onClick={handleAddContactClick} 
                className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-green-600 z-50"
            >
                Ajouter un contact
            </button>
        </div>
    );
};

export default HomePage;
