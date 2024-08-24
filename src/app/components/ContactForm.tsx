"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ContactFormProps {
  onCancel: () => void;
  contact?: {
    id?: number;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    ville: string;
  };
  isEditMode?: boolean;
  onSuccess?: () => void; // Fonction pour gérer la soumission réussie
}

const ContactForm: React.FC<ContactFormProps> = ({ onCancel, contact, isEditMode = false, onSuccess }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    ville: '',
  });

  const [errors, setErrors] = useState<any>({}); // Pour stocker les erreurs de validation

  useEffect(() => {
    if (contact) {
      setFormData({
        nom: contact.nom || '',
        prenom: contact.prenom || '',
        email: contact.email || '',
        telephone: contact.telephone || '',
        ville: contact.ville || '',
      });
    }
  }, [contact]);

  const validateForm = () => {
    const newErrors: any = {};

    // Validation des champs
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

    setErrors(newErrors);

    // Retourne vrai si le formulaire est valide
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); // Réinitialiser les erreurs

    if (!validateForm()) {
      // Si le formulaire n'est pas valide, ne pas envoyer
      return;
    }

    try {
      if (isEditMode && contact?.id) {
        // Modification d'un contact existant
        await axios.put(`http://localhost:8000/contacts/${contact.id}`, formData);
      } else {
        // Création d'un nouveau contact
        await axios.post('http://localhost:8000/contacts', formData);
      }
      if (onSuccess) onSuccess(); // Appeler la fonction onSuccess après une soumission réussie
      onCancel(); // Cacher le formulaire après soumission
    } catch (error: any) {
      console.error('Erreur lors de la soumission du formulaire:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nom:</label>
        <input
          type="text"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          className={errors.nom ? 'input-error' : ''}
        />
        {errors.nom && <span className="error-message">{errors.nom}</span>}
      </div>
      <div>
        <label>Prénom:</label>
        <input
          type="text"
          name="prenom"
          value={formData.prenom}
          onChange={handleChange}
          className={errors.prenom ? 'input-error' : ''}
        />
        {errors.prenom && <span className="error-message">{errors.prenom}</span>}
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? 'input-error' : ''}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>
      <div>
        <label>Téléphone:</label>
        <input
          type="text"
          name="telephone"
          value={formData.telephone}
          onChange={handleChange}
          className={errors.telephone ? 'input-error' : ''}
        />
        {errors.telephone && <span className="error-message">{errors.telephone}</span>}
      </div>
      <div>
        <label>Ville:</label>
        <select
          name="ville"
          value={formData.ville}
          onChange={handleChange}
          className={errors.ville ? 'input-error' : ''}
        >
          <option value="">-- Sélectionnez une ville --</option>
          <option value="Paris">Paris</option>
          <option value="Lyon">Lyon</option>
          <option value="Marseille">Marseille</option>
        </select>
        {errors.ville && <span className="error-message">{errors.ville}</span>}
      </div>
      <button type="submit">{isEditMode ? 'Sauvegarder' : 'Ajouter'}</button>
      <button type="button" onClick={onCancel}>Annuler</button>
    </form>
  );
};

export default ContactForm;
