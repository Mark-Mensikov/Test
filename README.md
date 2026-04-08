# SaaS Tagasiside Portaal PRO

See on lihtne tagasisideportaal, kus kasutajad saavad lisada ettepanekuid, neid hinnata, kommenteerida ja administraator saab sisu modereerida.

## Ülevaade

Rakendus koosneb kahest osast:

- **Frontend**: HTML, CSS, JavaScript ja PocketBase SDK
- **Backend**: väike Express server, mis serveerib frontend-i ja annab PocketBase URL-i läbi `/config` endpointi

## Käivitamine

Frontend töötab Node.js serveri kaudu.

```bash
cd front
npm install
npm start
```

Rakendus kuulab vaikimisi pordil `3000`, kui `PORT` keskkonnamuutuja ei ole määratud.

## Rollid ja õigused

### Külaline

- Saab näha ainult avalikke postitusi.
- Postituse autorit ei kuvata, näidatakse `Anonüümne`.
- Ei saa hääletada, kommenteerida ega postitada.

### Tavaline kasutaja

- Saab luua uusi postitusi.
- Saab hääletada teiste postituste poolt.
- Ei saa hääletada omaenda postituse poolt.
- Saab lisada kommentaare.
- Saab kustutada ainult oma kommentaare.
- Näeb postituste autorite e-posti aadresse.

### VIP kasutaja

- Kõik tavalise kasutaja õigused.
- Saab muuta oma postitusi.
- VIP staatust tähistatakse kuldse märgiga.
- VIP staatus põhineb `verified` väljal, kuid rakendus toetab vajadusel ka vana `is_pro` välja.

### Administraator

- Saab muuta kõiki postitusi.
- Saab kustutada kõiki postitusi.
- Saab kustutada kõiki kommentaare.
- Saab anda ja eemaldada VIP staatust.
- Näeb ka ülevaatusel olevaid ja tagasi lükatud postitusi.

## Postituste nähtavus

Praegune loogika on järgmine:

- **Külaline** näeb ainult `completed` postitusi.
- **Tavaline kasutaja** näeb ainult `completed` postitusi.
- **Administraator** näeb kõiki postitusi.

Kui post on olekus `under-review`, siis seda näeb ainult administraator kuni ta muudab staatuse nähtavaks kõigile.

## Hääletamine

Hääletamine töötab `votes` kollektsiooni kaudu.

- Üks kasutaja saab anda ühele postitusele ainult ühe hääle.
- Hääle suund on `1` või `-1`.
- Sama suuna uuesti vajutamine eemaldab hääle.
- Vastassuunale üleminekul uuendatakse olemasolev hääl.
- Postituste järjestus kuvatakse häälesumma järgi: suurema positiivse tulemusega postitused on eespool.

## Kommentaarid

- Kasutaja saab lisada kommentaare postitustele.
- Kommentaarile saab vastata konkreetsele kommentaarile.
- Tavaline kasutaja saab kustutada ainult oma kommentaare.
- Administraator saab kustutada kõiki kommentaare.

## VIP / Stripe

VIP staatuse aktiveerimine on seotud Stripe testmaksega.

- Kasutaja maksab Stripe Payment Linki kaudu.
- Pärast edukat makset suunatakse ta tagasi rakendusse parameetriga `?payment=success`.
- Frontend proovib seada kasutaja profiilile `verified = true`.
- Kui skeemis kasutatakse veel vana välja, toetatakse ka `is_pro` fallback-i.

## PocketBase kollektsioonid

### `users`

Laiendatud auth-kollektsioon.

Olulised väljad:

- `email`
- `emailVisibility`
- `verified`
- `name`
- `avatar`
- `is_admin`
- `is_pro`

Märkus: kui soovid, et autoriseeritud kasutajad näeksid teiste kasutajate e-posti aadresse, peab PocketBase’i seadistus seda lubama või peab kasutama eraldi nähtavat välja.

### `posts`

Olulised väljad:

- `title`
- `description`
- `author`
- `status`
- `votes` (seda välja võib skeemis hoida, kuid praegune frontend arvutab skoori `votes` kollektsioonist)

Staatused:

- `under-review`
- `completed`
- `rejected`

### `votes`

Olulised väljad:

- `user`
- `post`
- `direction` (`1` või `-1`)

Oluline:

- `user + post` peab jääma unikaalseks.
- `direction` peab olema number ja soovitavalt täisarv.

### `comments`

Olulised väljad:

- `post`
- `user`
- `text`

## Soovitatavad PocketBase reeglid

Need reeglid peavad sobima praeguse frontend-i loogikaga.

### `posts`

- `listRule`: `status = "completed" || @request.auth.is_admin = true`
- `viewRule`: `status = "completed" || @request.auth.is_admin = true`
- `createRule`: `@request.auth.id != ""`
- `updateRule`: `@request.auth.is_admin = true || (author = @request.auth.id && (@request.auth.is_pro = true || @request.auth.verified = true))`
- `deleteRule`: `@request.auth.is_admin = true`

### `votes`

- `listRule`: `@request.auth.id != ""`
- `viewRule`: `@request.auth.id != ""`
- `createRule`: `user = @request.auth.id`
- `updateRule`: `user = @request.auth.id`
- `deleteRule`: `user = @request.auth.id`

### `comments`

- `listRule`: `@request.auth.id != ""`
- `viewRule`: `@request.auth.id != ""`
- `createRule`: `@request.auth.id != "" && user = @request.auth.id`
- `updateRule`: `user = @request.auth.id || @request.auth.is_admin = true`
- `deleteRule`: `user = @request.auth.id || @request.auth.is_admin = true`

### `users`

- Kasutaja saab muuta oma profiili.
- Administraator saab muuta teisi kasutajaid.
- Kui kasutad e-posti kuvamist, kontrolli kindlasti `emailVisibility` seadet.

## Tehnilised märkused

- Frontend küsib PocketBase URL-i endpointist `/config`.
- Rakendus kasutab PocketBase SDK-d brauseris.
- Kommentaaride ja postituste värskendamine toimub otse PocketBase andmete põhjal.
- UI-s kasutatakse lihtsat staatuse, rolli ja häälesaagi kuvamist.

## Märkused arendajale

Kui muudate PocketBase skeemi, kontrollige alati üle:

- kas frontend kasutab ikka samu välja nimesid;
- kas `verified` või `is_pro` on VIP loogika jaoks õige allikas;
- kas `votes.direction` on olemas;
- kas autorite e-posti aadressid on autoriseeritud kasutajatele nähtavad.
