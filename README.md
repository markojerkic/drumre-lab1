# Društvene mreže lab 1

## Pokretanje

MongoDB baza se pokreće preko `docker-compose` komande:

```bash
docker compose up
```

Ova naredba stvori instancu MongoDB servera na portu 27027 i instancu Mongo Express servera na portu 38081.
Za pristup Mongo Express serveru koristi se link: [http://localhost:38081/](http://localhost:38081/db/drumre/books),
a za autentikaciju koristi se korisničko ime `admin` i lozinka `pass`.

Nakon toga se pokreće server:

```bash
npm install
npm run dev
```

Aplikacija je dostupna na linku: [http://localhost:5173/](http://localhost:5173/).

Za pokretanje uvoza podataka u bazu koristi se:

```bash
curl http://localhost:5173/seed
```

Ova naredba će preuzeti podatke o TV emisijama s [Trakt-a](https://api.trakt.tv/shows) te o knjigama
s [NY Times Books API](https://api.nytimes.com/svc/books).

Za OAuth ser koristi GitHub.
