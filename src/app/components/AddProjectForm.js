"use client";
import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

export default function AddProjectForm({ onSubmit, onCancel, editingProject }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    domain: '',
    trl: '',
    budgetMin: '',
    budgetMax: '',
    deadline: '',
    deliverables: '',
    selectionCriteria: '',
    attachments: null
  });

  useEffect(() => {
    if (editingProject) {
      setFormData({
        title: editingProject.title || '',
        description: editingProject.description || '',
        domain: editingProject.domain || '',
        trl: editingProject.trl || '',
        budgetMin: editingProject.budgetMin || '',
        budgetMax: editingProject.budgetMax || '',
        deadline: editingProject.deadline ? editingProject.deadline.split('T')[0] : '',
        deliverables: editingProject.deliverables || '',
        selectionCriteria: editingProject.selectionCriteria || '',
        attachments: null
      });
    }
  }, [editingProject]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        attachments: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      
      // Ajouter les données du formulaire
      Object.keys(formData).forEach(key => {
        if (key === 'attachments' && formData[key]) {
          formDataToSend.append(key, formData[key]);
        } else if (key !== 'attachments') {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Ajouter l'ID de l'entreprise connectée
      const email = localStorage.getItem('entrepriseEmail');
      if (email) {
        formDataToSend.append('entrepriseEmail', email);
      }

      const response = await fetch('/api/projects-entreprise', {
        method: editingProject ? 'PUT' : 'POST',
        body: formDataToSend
      });

      if (response.ok) {
        const result = await response.json();
        onSubmit(result);
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.message || 'Erreur lors de l\'ajout du projet'}`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du projet:', error);
      alert('Erreur lors de l\'ajout du projet');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">
          {editingProject ? 'Modifier le projet' : 'Ajouter un nouveau projet'}
        </h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre du projet *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Domaine *
            </label>
            <input
              type="text"
              name="domain"
              value={formData.domain}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              TRL (Technology Readiness Level) *
            </label>
            <select
              name="trl"
              value={formData.trl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner un TRL</option>
              <option value="TRL 1">TRL 1 - Basic principles observed</option>
              <option value="TRL 2">TRL 2 - Technology concept formulated</option>
              <option value="TRL 3">TRL 3 - Experimental proof of concept</option>
              <option value="TRL 4">TRL 4 - Technology validated in lab</option>
              <option value="TRL 5">TRL 5 - Technology validated in relevant environment</option>
              <option value="TRL 6">TRL 6 - Technology demonstrated in relevant environment</option>
              <option value="TRL 7">TRL 7 - System prototype demonstration in operational environment</option>
              <option value="TRL 8">TRL 8 - System complete and qualified</option>
              <option value="TRL 9">TRL 9 - Actual system proven in operational environment</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date limite
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget minimum (€)
            </label>
            <input
              type="number"
              name="budgetMin"
              value={formData.budgetMin}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget maximum (€)
            </label>
            <input
              type="number"
              name="budgetMax"
              value={formData.budgetMax}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Livrables attendus
          </label>
          <textarea
            name="deliverables"
            value={formData.deliverables}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Décrivez les livrables attendus du projet..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Critères de sélection
          </label>
          <textarea
            name="selectionCriteria"
            value={formData.selectionCriteria}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Décrivez les critères de sélection des chercheurs..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Documents attachés
          </label>
          <input
            type="file"
            name="attachments"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            accept="image/*,.pdf,.doc,.docx"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {editingProject ? 'Modifier le projet' : 'Ajouter le projet'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
} 