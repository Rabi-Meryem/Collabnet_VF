'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupEntreprise() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phoneNumber: '',
    password: '',
    department: '',
    position: '',
    location: '',
    description: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleCreateAccount = async () => {
    try {
      console.log('Données envoyées:', formData);
      
      // On n'envoie que les champs qui existent dans le schéma
      const dataToSend = {
        companyName: formData.companyName,
        email: formData.email,
        password: formData.password,
        position: formData.position,
        phoneNumber: formData.phoneNumber,
        department: formData.department,
        description: formData.description
      };
      
      console.log('Données à envoyer à l\'API:', dataToSend);
      
      const res = await fetch('/api/signup/entreprise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Inscription entreprise réussie');
        router.push('/home-page-En');
      } else {
        alert(data.message || 'Erreur lors de l\'inscription');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur de communication avec le serveur');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D102B] text-white px-4">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[#0D102B] rounded-xl p-8">
        {/* Form */}
        <div className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold">Create an account</h1>
          <p className="text-gray-300">Already have an account ? <a href="/login-entreprise" className="underline">Log in</a></p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              name="companyName" 
              value={formData.companyName}
              onChange={handleChange} 
              className="p-3 rounded-md bg-[#1F1F5A] placeholder-gray-400" 
              placeholder="Company name" 
              required
            />
            
            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-[#252566] placeholder-gray-300"
              required
            >
              <option value="">Sélectionner une position</option>
              <option value="Researcher">Researcher</option>
              <option value="Company">Company</option>
            </select>

            <input 
              name="email" 
              value={formData.email}
              onChange={handleChange} 
              className="p-3 rounded-md bg-[#1F1F5A] placeholder-gray-400" 
              placeholder="Email" 
              type="email" 
              required
            />
            <input 
              name="phoneNumber" 
              value={formData.phoneNumber}
              onChange={handleChange} 
              className="p-3 rounded-md bg-[#1F1F5A] placeholder-gray-400" 
              placeholder="Phone Number" 
              required
            />
            <input 
              name="password" 
              value={formData.password}
              onChange={handleChange} 
              className="p-3 rounded-md bg-[#1F1F5A] placeholder-gray-400 col-span-2" 
              placeholder="Enter your password" 
              type="password" 
              required
            />
            <input 
              name="department" 
              value={formData.department}
              onChange={handleChange} 
              className="p-3 rounded-md bg-[#1F1F5A] placeholder-gray-400" 
              placeholder="Department" 
              required
            />
            <input 
              name="location" 
              value={formData.location}
              onChange={handleChange} 
              className="p-3 rounded-md bg-[#1F1F5A] placeholder-gray-400" 
              placeholder="Location" 
            />
            <input 
              name="description" 
              value={formData.description}
              onChange={handleChange} 
              className="p-3 rounded-md bg-[#1F1F5A] placeholder-gray-400 col-span-2" 
              placeholder="Description" 
            />
          </div>
          
          <button 
            onClick={handleCreateAccount}
            className="w-full bg-[#45B4D0] text-white font-semibold py-3 rounded-md hover:bg-[#3aa0b9] transition"
          >
            Create account
          </button>

          <div className="flex items-center justify-between gap-4 text-gray-400">
            <hr className="w-full border-gray-600" />
            <span className="text-sm">or register with</span>
            <hr className="w-full border-gray-600" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="bg-[#1F1F5A] py-3 rounded-md hover:bg-[#292982] transition">Google</button>
            <button className="bg-[#1F1F5A] py-3 rounded-md hover:bg-[#292982] transition">Facebook</button>
          </div>
        </div>

        {/* Image */}
        <div className="hidden md:block">
          <img 
            src="/img cherch2.jpg"
            alt="Entreprise"
            className="rounded-xl object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}
