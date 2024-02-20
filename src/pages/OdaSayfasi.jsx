import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

// Soket bağlantısını her bir bileşen için ayrı ayrı başlatmak yerine,
// uygulamanın üst düzeyinde (örneğin, bir context içinde) başlatıp burada kullanabilirsiniz.
// Ancak bu örnekte, her bir bileşenin kendi bağlantısını yönetmesini sağlayacağız.
const SOCKET_IO_URL = "http://localhost:4000";

function OdaSayfasi() {
    const { odaId } = useParams();
    const [mesaj, setMesaj] = useState('');
    const [sohbet, setSohbet] = useState([]);
    // Soket bağlantısını useEffect içinde başlatıyoruz.
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Soket bağlantısını başlat
        const newSocket = io(SOCKET_IO_URL, { autoConnect: false });
        newSocket.connect();
        setSocket(newSocket);

        newSocket.emit('odaKatil', odaId);

        newSocket.on('mesajAlindi', (gelenMesaj) => {
            setSohbet((prevSohbet) => [...prevSohbet, gelenMesaj]);
        });

        // Bileşen unmount olduğunda soketi temizle
        return () => {
            newSocket.emit('odadanAyril', odaId);
            newSocket.off('mesajAlindi');
            newSocket.disconnect();
        };
    }, [odaId]);

    const mesajGonder = (e) => {
        e.preventDefault();
        if (mesaj.trim() && socket) {
            const mesajObj = {
                metin: mesaj,
                kullaniciId: socket.id, // Bu kullanıcı ID'sini göndermek isteyip istemediğinize bağlı
            };
            socket.emit('mesajGonder', { odaId, mesaj: mesajObj });
            // Kendi mesajını doğrudan sohbete ekleyerek UI'da göster
            setSohbet(prevSohbet => [...prevSohbet, mesajObj]);
            setMesaj('');
        }
    };

    return (
        <div className="max-w-2xl mx-auto my-8 p-4 shadow-lg rounded-lg bg-white">
            <h2 className="text-2xl font-semibold mb-4">Oda: {odaId}</h2>
            <div className="mb-4">
                <h3 className="font-bold text-lg mb-2">Sohbet</h3>
                <div className="h-64 overflow-y-scroll p-2 bg-gray-100 rounded">
                    {sohbet.map((m, index) => (
                        <div key={index} className={`mb-2 ${m.kullaniciId === socket?.id ? 'text-right' : 'text-left'}`}>
                            <div className="inline-block">
                                <p className={`text-sm font-semibold ${m.kullaniciId === socket?.id ? 'text-blue-500' : 'text-gray-600'}`}>{m.kullaniciId || 'Birisi'}</p>
                                <p className={`inline-block p-2 rounded-lg ${m.kullaniciId === socket?.id ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                                    {m.metin}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <form onSubmit={mesajGonder} className="flex items-center mt-4">
                    <input
                        type="text"
                        value={mesaj}
                        onChange={(e) => setMesaj(e.target.value)}
                        placeholder="Bir mesaj yazın..."
                        className="flex-1 px-4 py-2 mr-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
                    />
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-150">Gönder</button>
                </form>
            </div>
        </div>
    );
}

export default OdaSayfasi;
