import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

// Sunucunun çalıştığı adresi buraya yazın. Örneğin: 'http://localhost:4000'
const SOCKET_IO_URL = "http://localhost:4000";
const socket = io(SOCKET_IO_URL);

function EslestirmeEkrani() {
  const [odaId, setOdaId] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Oyuncuyu eşleştirme sırasına ekleyin
    socket.emit('eslestirmeIstegi', { oyun: 'oyunAdı' }); // 'oyunAdı' yerine dinamik veri gelebilir

    // Eşleştirme sonucunu dinleyin
    socket.on('eslestirildi', (data) => {
      setOdaId(data.odaId);
      setTimeout(() => { // Yükleme ekranı için kısa bir gecikme ekleyin
        setLoading(false);
        navigate(`/oda/${data.odaId}`); // Kullanıcıyı sohbet odasına yönlendir
      }, 2000); // 2 saniye sonra yönlendirme yap
    });

    // Komponent temizlendiğinde socket bağlantısını kapat
    return () => {
      socket.off('eslestirildi');
    };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-xl font-semibold mb-4">Eşleştirme Ekranı</h2>
      {loading ? (
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-3 text-center">Eşleştiriliyorsunuz, lütfen bekleyin...</p>
        </div>
      ) : (
        <p>Eşleştirildiniz! Oda ID: {odaId}</p>
      )}
    </div>
  );
}

export default EslestirmeEkrani;
