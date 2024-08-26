"use client";

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Déclaration de l'interface pour les propriétés du composant ContactForm
interface ContactFormProps {
  onCancel: () => void; // Fonction appelée pour annuler le formulaire
  contact?: {
    id?: number; // ID du contact, présent en mode édition
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    ville: string;
  };
  isEditMode?: boolean; // Indique si le formulaire est en mode édition
  onSuccess?: () => void; // Fonction appelée après la soumission réussie du formulaire
}

// Composant fonctionnel ContactForm
const ContactForm: React.FC<ContactFormProps> = ({ onCancel, contact, isEditMode = false, onSuccess }) => {
  // État pour stocker les données du formulaire
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    ville: '',
  });

  // État pour stocker les messages d'erreur de validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Effet pour pré-remplir le formulaire en mode édition
  useEffect(() => {
    if (contact) {
      setFormData(contact);
    }
  }, [contact]);

  // Fonction pour valider les données du formulaire
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    // Validation des champs avec conditions spécifiques pour chaque champ
    if (!formData.prenom || formData.prenom.length > 50) {
      newErrors.prenom = 'Le prénom est requis et doit contenir au maximum 50 caractères.';
    }
    if (!formData.nom || formData.nom.length > 50) {
      newErrors.nom = 'Le nom est requis et doit contenir au maximum 50 caractères.';
    }
    if (!formData.email) {
      newErrors.email = 'L\'email est requis.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'L\'email doit être une adresse valide.';
    } else if (formData.email.length > 255) {
      newErrors.email = 'L\'email doit contenir au maximum 255 caractères.';
    }
    if (!formData.telephone) {
      newErrors.telephone = 'Le téléphone est requis.';
    } else if (!/^\d{10}$/.test(formData.telephone)) {
      newErrors.telephone = 'Le téléphone doit contenir exactement 10 chiffres.';
    }
    if (!formData.ville || !['Paris', 'Lyon', 'Marseille'].includes(formData.ville)) {
      newErrors.ville = 'La ville est requise et doit être l\'une des options suivantes : Paris, Lyon, Marseille.';
    }

    // Mise à jour des erreurs dans l'état
    setErrors(newErrors);

    // Retourne true si le formulaire est valide
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Gestionnaire de changement pour les champs du formulaire
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name as keyof typeof formData]: value,  // Mise à jour du champ modifié
    }));
  }, []);

  // Gestionnaire de soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Empêche le comportement par défaut du formulaire
    setErrors({}); // Réinitialise les erreurs

    // Validation du formulaire avant soumission
    if (!validateForm()) {
      return;
    }

    try {
      // Envoie des données au serveur, en fonction du mode (édition ou création)
      if (isEditMode && contact?.id) {
        await axios.put(`http://localhost:8000/contacts/${contact.id}`, formData);
      } else {
        await axios.post('http://localhost:8000/contacts', formData);
      }
      onSuccess?.(); // Appel de la fonction onSuccess si elle est définie
      onCancel(); // Ferme le formulaire
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error); // Affiche une erreur en cas d'échec
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-800 text-white shadow-md rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Champs du formulaire avec validation */}
        {['nom', 'prenom', 'email', 'telephone', 'ville'].map((field) => (
          <div key={field}>
            <label className="block text-white">
              {field.charAt(0).toUpperCase() + field.slice(1)}:
            </label>
            <input
              type={field === 'email' ? 'email' : 'text'}
              name={field}
              value={formData[field as keyof typeof formData]}  // Mise à jour de la valeur selon l'état formData
              onChange={handleChange}
              className={`block w-full mt-1 px-3 py-2 border rounded-md shadow-sm bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[field] ? 'border-red-500' : 'border-gray-600'}`}
            />
            {errors[field] && <span className="text-red-500 text-sm">{errors[field]}</span>} {/* Affiche les erreurs de validation */}
          </div>
        ))}
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600">{isEditMode ? 'Sauvegarder' : 'Ajouter'}</button>
          <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-gray-600">Annuler</button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
