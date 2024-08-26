"use client";

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import { Contact } from '../type';
import { useRouter } from 'next/navigation';

// Déclaration de l'interface pour les propriétés du composant ContactList
interface ContactListProps {
  refresh: boolean; // Indicateur pour rafraîchir la liste des contacts
}

// Composant fonctionnel ContactList
const ContactList: React.FC<ContactListProps> = ({ refresh }) => {
  // États pour stocker les contacts, les champs sélectionnés, la requête de recherche, et le champ de recherche
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedFields, setSelectedFields] = useState({
    prenom: true,
    nom: true,
    email: true,
    telephone: true,
    ville: true,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState('nom');
  const router = useRouter(); // Pour la navigation

  // Effet pour récupérer les contacts depuis le serveur lors du montage du composant ou lors du rafraîchissement
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get<Contact[]>('http://localhost:8000/contacts');
        setContacts(response.data); // Met à jour les contacts dans l'état
      } catch (error) {
        console.error('Erreur lors de la récupération des contacts:', error); // Gère les erreurs de récupération
      }
    };

    fetchContacts();
  }, [refresh]);

  // Filtre les contacts selon la requête de recherche et le champ sélectionné
  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const fieldValue = contact[searchField as keyof Contact]?.toString().toLowerCase() || ''; // Récupère la valeur du champ
      return fieldValue.includes(searchQuery.toLowerCase()); // Filtre selon la requête de recherche
    });
  }, [contacts, searchField, searchQuery]);

  // Gestionnaire de changement pour les cases à cocher des champs sélectionnés
  const handleFieldChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFields(prevFields => ({
      ...prevFields,
      [e.target.name]: e.target.checked, // Met à jour l'état des champs sélectionnés
    }));
  }, []);

  // Gestionnaire de clic sur une ligne de tableau pour naviguer vers le détail d'un contact
  const handleRowClick = useCallback((id: number) => {
    router.push(`/contacts/${id}`); // Navigue vers la page de détails du contact
  }, [router]);

  return (
    <div className="p-4 bg-gray-800 text-white shadow-md rounded-lg">
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Choisir les champs à afficher</h2>
        <div className="flex flex-wrap gap-4">
          {/* Cases à cocher pour sélectionner les champs à afficher */}
          {Object.keys(selectedFields).map(field => (
            <label key={field} className="flex items-center text-gray-300">
              <input
                type="checkbox"
                name={field}
                checked={selectedFields[field as keyof typeof selectedFields]} // Vérifie si le champ est sélectionné
                onChange={handleFieldChange}
                className="mr-2 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500"
              />
              {field.charAt(0).toUpperCase() + field.slice(1)} {/* Affiche le nom du champ */}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4 flex flex-col md:flex-row gap-4">
        <label className="flex-1">
          Recherche :
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Met à jour la requête de recherche
            placeholder="Rechercher..."
            className="block w-full mt-1 px-3 py-2 border rounded-md shadow-sm bg-gray-700 text-white border-gray-600 focus:border-indigo-500 focus:ring-indigo-500"
          />
        </label>
        <label>
          Par :
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)} // Met à jour le champ de recherche
            className="block mt-1 px-3 py-2 border rounded-md shadow-sm bg-gray-700 text-white border-gray-600 focus:border-indigo-500 focus:ring-indigo-500"
          >
            {/* Options de champ de recherche */}
            {Object.keys(selectedFields).map(field => (
              <option key={field} value={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</option>
            ))}
          </select>
        </label>
      </div>

      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            {/* En-têtes de tableau en fonction des champs sélectionnés */}
            {selectedFields.nom && <th className="border p-2">Nom</th>}
            {selectedFields.prenom && <th className="border p-2">Prénom</th>}
            {selectedFields.email && <th className="border p-2">Email</th>}
            {selectedFields.telephone && <th className="border p-2">Téléphone</th>}
            {selectedFields.ville && <th className="border p-2">Ville</th>}
          </tr>
        </thead>
        <tbody>
          {/* Affiche les contacts filtrés */}
          {filteredContacts.map((contact) => (
            <tr key={contact.id} onClick={() => handleRowClick(contact.id)} className="cursor-pointer hover:bg-gray-700">
              {selectedFields.nom && <td className="border p-2">{contact.nom}</td>}
              {selectedFields.prenom && <td className="border p-2">{contact.prenom}</td>}
              {selectedFields.email && <td className="border p-2">{contact.email}</td>}
              {selectedFields.telephone && <td className="border p-2">{contact.telephone}</td>}
              {selectedFields.ville && <td className="border p-2">{contact.ville}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContactList;
