# Serbian Transliteration — Biblioteka za transkripciju srpskog pisma

`serbian-transliteration` je lagana i brza JavaScript/TypeScript biblioteka za transkripciju srpskog teksta između ćirilice i latinice. Omogućava jednostavno konvertovanje rečenica ili reči, pogodna je za Node.js i browser okruženja, i ne zahteva dodatne biblioteke.

---

## ✨ Karakteristike

- 🔄 Brzo i precizno konvertovanje između ćirilice i latinice
- 📝 Podržava kompletnu srpsku abecedu i azbuku, uključujući digrafe (lj, nj, dž, đ, č, ć, š, ž)
- 📦 Laka za korišćenje — bez spoljnjih biblioteka
- 🌐 Radi u Node.js i browseru
- 🛠️ Jednostavan API za integraciju u druge projekte

---

## 📦 Instalacija

Instalirajte paket putem npm-a:
```bash
npm install @pr00x/serbian-transliteration
```

---

## 🚀 Primer korišćenja

```js
import SerbianTransliteration from 'serbian-transliteration'; // ESM syntax
// const SerbianTransliteration = require('serbian-transliteration'); // CommonJS syntax

let result;

// Osnovna transkripcija
result = SerbianTransliteration.toLatin('Љубав и пријатељство');
console.log(result); // Ljubav i prijateljstvo

result = SerbianTransliteration.toCyrillic('Srećno, želim ti lep dan!');
console.log(result); // Срећно, желим ти леп дан!

// Automatsko prepoznavanje pisma i transkripcija
result = SerbianTransliteration.autoTransliterate('Добар dan!');
console.log(result); // Dobar dan!

result = SerbianTransliteration.autoTransliterate('Dobar дан!');
console.log(result); // Добар дан!

// Prepoznavanje pisma
const isCyrillic = SerbianTransliteration.isCyrillic('Само ћирилица');
console.log(isCyrillic); // true

const isLatin = SerbianTransliteration.isLatin('Samo latinica');
console.log(isLatin); // true

// Korišćenje opcije skip.words (reči koje se ne transkriptuju)
result = SerbianTransliteration.toCyrillic(
    'Poseti sajt Wikipedia i pročitaj članak.',
    { skip: { words: ['Wikipedia', 'članak'] } }
);
console.log(result); // Посети сајт Wikipedia и прочитај članak.

// Korišćenje opcije skip.markers (delovi koje treba preskočiti)
result = SerbianTransliteration.toCyrillic(
    'Ovo je <skip>some code</skip> koje ne treba transkriptovati.',
    { skip: { markers: ['<skip>', '</skip>'] } }
);
console.log(result); // Ово је some code које не треба транскриптовати.

// Kombinovanje skip.words i skip.markers
result = SerbianTransliteration.toCyrillic(
    'Voli <skip>JavaScript</skip> i koristi StackOverflow svakog dana.',
    { skip: { words: ['StackOverflow'], markers: ['<skip>', '</skip>'] } }
);
console.log(result); // Воли JavaScript и користи StackOverflow сваког дана.

// Automatsko preskakanje reči koje sadrže q, w, x, y
result = SerbianTransliteration.toCyrillic('Ovo je query sa xray i Wendy.');
console.log(result); // Ово је query са xray и Wendy.

// Bacanje greške kad su marker tagovi isti
try {
    result = SerbianTransliteration.toCyrillic(
        'Ovaj <tag>deo</tag> se ne menja',
        { skip: { markers: ['<tag>', '<tag>'] } }
    );
} catch(err) {
    console.error(err); // The opening and closing markers cannot be the same.
}
```

---

## 🛠️ API
| Funkcija                   | Opis                                                           |
|----------------------------|----------------------------------------------------------------|
| `toLatin(text)`            | Pretvara srpski tekst sa ćirilice na latinicu                  |
| `toCyrillic(text, options?)` | Pretvara srpski tekst sa latinice na ćirilicu, uz opcione skip parametre |
| `isCyrillic(text)`         | Vraća `true` ako je većina teksta na ćirilici                  |
| `isLatin(text)`            | Vraća `true` ako je većina teksta na latinici                  |
| `autoTransliterate(text)`  | Automatski detektuje pismo i prevodi tekst u suprotno pismo    |
---

## 📚 Dokumentacija

- **toLatin(text: string): string**  
  Pretvara srpski tekst iz ćirilice u latinicu.

- **toCyrillic(text: string, options?: ToCyrillicOptions): string**  
  Pretvara srpski tekst iz latinice u ćirilicu. Podržava opcije za preskakanje reči i regiona.

- **isCyrillic(text: string): boolean**  
  Vraća `true` ako je većina teksta na ćirilici, u suprotnom `false`.

- **isLatin(text: string): boolean**  
  Vraća `true` ako je većina teksta na latinici, u suprotnom `false`.

- **autoTransliterate(text: string): string**  
  Automatski detektuje pismo i prevodi tekst u suprotno pismo (ćirilica ↔ latinica).

---

## 👨‍💻 Autor

[@pr00x (Jovan Bogovac)](https://github.com/pr00x)

---

## 🤝 Doprinos

Svi predlozi i poboljšanja su dobrodošli!  
Otvorite pull request ili prijavite problem putem GitHub Issues.

---

## 📝 Licenca

Ovaj projekat je licenciran pod MIT licencom.  
Pogledajte `LICENSE` fajl za više detalja.