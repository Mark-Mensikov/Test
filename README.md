
💡 SaaS Tagasiside Portaal (Feedback Board) PRO
See on täisfunktsionaalne SaaS-rakendus, mis võimaldab kasutajatel esitada tootearenduse ettepanekuid, nende poolt hääletada ja hallata platvormi sisu vastavalt rollidele.

🚀 Lingid
Frontend: http://mbatwwnb4zirf6xd9k8f6dz7.176.112.158.3.sslip.io/

PocketBase Admin: http://pocketbase-hv4bvovfn86uwdafxs7d7p1s.176.112.158.3.sslip.io/_/

🛠 Tehniline stäkk
Frontend: HTML5, CSS3, JavaScript (PocketBase SDK)

Backend: PocketBase (Andmebaas, Auth, failihaldus)

Maksemeetod: Stripe (Test Mode) integratsioon

Infrastructure: Coolify (Self-hosted Docker konteinerid)

🔑 Kasutajarollid ja õigused (RBAC)
Rakenduses on rakendatud dünaamiline rollipõhine juurdepääsu kontroll:

Külaline (Sisselogimata): Saab vaadata postituste nimekirja ja häälte arvu.

Tavakasutaja:

Saab luua uusi ettepanekuid.

Saab hääletada teiste postituste poolt (piirang: 1 hääl postituse kohta, enda poolt hääletada ei saa).

VIP Kasutaja (verified: true):

Kõik tavakasutaja õigused.

Õigus muuta (Edit) oma postitusi.

Visuaalne eristus: "VIP" märk ja esiletõstetud kuldne taust postitustel.

Administraator (is_admin: true):

Täielik kontroll platvormi üle.

Õigus muuta ja kustutada (Delete) kõiki postitusi sõltumata autorist.

💳 Stripe ja VIP-staatuse loogika
Süsteem kasutab Stripe Payment Linki teenust.

Pärast edukat makset suunatakse kasutaja tagasi portaali parameetriga ?payment=success.

Frontend tuvastab parameetri ja kutsub välja PocketBase API, et uuendada kasutaja profiilis väli verified: true.

See aktiveerib koheselt VIP-funktsionaalsuse ilma käsitsi sekkumiseta.

📦 Andmebaasi struktuur (Collections)
users: Laiendatud väljadega verified (Boolean) ja is_admin (Boolean).

posts: Pealkiri, kirjeldus, häälte arv, staatus ja seos autoriga.

votes: Seoste tabel, mis kasutab Unique Index (user + post), et vältida topelthääletamist ja tagada andmete terviklikkus.

🛠 Paigaldus ja juurutamine
Projekt on juurutatud Coolify platvormile, kasutades Dockerit.

PocketBase on seadistatud kasutama Persistent Volume'i, mis tagab andmete säilimise serveri taaskäivitamisel.

API päringud on kaitstud PocketBase API Rules (Server-side validation) abil.
