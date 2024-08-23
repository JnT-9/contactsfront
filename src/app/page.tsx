// app/page.tsx

import React from 'react';
import ContactList from './components/ContactList';

const HomePage: React.FC = () => {
    return (
        <main>
            <h1>Bienvenue sur l'application de gestion des contacts</h1>
            <ContactList />
        </main>
    );
};

export default HomePage;
