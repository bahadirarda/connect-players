import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


 function AnaSayfa() {
  const [arama, setArama] = useState('');
  const navigate = useNavigate();

  const oyunAra = (e) => {
    e.preventDefault();
    navigate(`/eslestir?oyun=${arama}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Oyuncu Eşleştirme Sistemi</h1>
      <form onSubmit={oyunAra} className="flex-row justify-center items-center">
        <input
          type="text"
          placeholder="Oyun ara..."
          value={arama}
          onChange={(e) => setArama(e.target.value)}
          className="mx-5 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-700 transition duration-200">
          Ara
        </button>
      </form>
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        <span className="px-4 py-1 bg-green-200 text-green-800 rounded-full cursor-pointer hover:bg-green-300">Fornite</span>
        <span className="px-4 py-1 bg-red-200 text-red-800 rounded-full cursor-pointer hover:bg-red-300">Counter-Strike</span>
        <span className="px-4 py-1 bg-yellow-200 text-yellow-800 rounded-full cursor-pointer hover:bg-yellow-300">Valorant</span>
        <span className="px-4 py-1 bg-blue-200 text-blue-800 rounded-full cursor-pointer hover:bg-blue-300">League of Legends</span>
      </div>
    </div>
  );
}

export default AnaSayfa;
