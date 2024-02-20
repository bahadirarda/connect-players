import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const oyunOdaları = {};
const kullanıcıOyunları = {};

io.on('connection', (socket) => {
    console.log('Bir kullanıcı bağlandı:', socket.id);

    // Oyuncu eşleştirme isteği
    socket.on('eslestirmeIstegi', ({ oyun }) => {
        if (kullanıcıOyunları[socket.id]) {
            console.log('Kullanıcı zaten bir eşleştirme isteği gönderdi:', socket.id);
            return;
        }

        let odaId = Object.keys(oyunOdaları).find(
            id => oyunOdaları[id].oyun === oyun && oyunOdaları[id].oyuncular.length < 4
        );

        if (!odaId) {
            odaId = uuidv4();
            oyunOdaları[odaId] = { oyun: oyun, oyuncular: [socket.id] };
        } else {
            oyunOdaları[odaId].oyuncular.push(socket.id);
        }

        kullanıcıOyunları[socket.id] = { odaId: odaId, oyun: oyun };

        socket.join(odaId);
        console.log(`Kullanıcı ${socket.id} ${odaId} numaralı odaya eşleştirildi.`);
        io.to(odaId).emit('eslestirildi', { odaId, oyuncular: oyunOdaları[odaId].oyuncular });
    });

    // Odaya mesaj gönderme
    socket.on('mesajGonder', ({ odaId, mesaj }) => {
        io.to(odaId).emit('mesajAlindi', mesaj);
    });

    // Kullanıcı bağlantısı kesildiğinde
    socket.on('disconnect', () => {
        const kullanici = kullanıcıOyunları[socket.id];
        if (kullanici && kullanici.odaId) {
            const odaId = kullanici.odaId;
            const oda = oyunOdaları[odaId];
            if (oda) {
                oda.oyuncular = oda.oyuncular.filter(id => id !== socket.id);
                if (oda.oyuncular.length === 0) {
                    delete oyunOdaları[odaId];
                } else {
                    io.to(odaId).emit('oyuncuAyrildi', { odaId, oyuncular: oda.oyuncular });
                }
            }
        }
        delete kullanıcıOyunları[socket.id];
        console.log('Kullanıcı ayrıldı:', socket.id);
    });
});

const port = process.env.PORT || 4000;
server.listen(port, () => {
    console.log(`Sunucu ${port} portunda çalışıyor.`);
});
