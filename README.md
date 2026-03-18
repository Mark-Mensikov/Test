💡 SaaS Tagasiside Portaal (Feedback Board)
See on täisfunktsionaalne SaaS-rakendus, mis võimaldab kasutajatel esitada tootearenduse ettepanekuid ja nende poolt hääletada. Rakendus on loodud kooliprojekti raames, järgides kaasaegseid veebiarenduse printsiipe.

🚀 Lingid
Frontend: http://mbatwwnb4zirf6xd9k8f6dz7.176.112.158.3.sslip.io/

PocketBase Admin: http://pocketbase-hv4bvovfn86uwdafxs7d7p1s.176.112.158.3.sslip.io/_/

🛠 Tehniline arhitektuur
Projekt koosneb kolmest põhilisest osast:

Frontend (UI): HTML5, CSS3 ja JavaScript (PocketBase SDK).

Backend (BaaS): PocketBase, mis tegeleb andmebaasi, autentimise ja API-ga.

Infrastruktuur: Kõik teenused on juurutatud Coolify platvormil Docker konteineritena.

Olulised tehnilised lahendused:
Persistent Volumes: PocketBase andmed on salvestatud serveri püsikettale, et vältida andmekadu konteineri taaskäivitamisel.

Keskkonnamuutujad (ENV): PocketBase URL ja pordid on seadistatud serveripoolselt, mitte koodi sisse kirjutatud.

📊 Andmemudel (Collections)
users: Süsteemne tabel kasutajatega. Lisatud väli verified (Boolean) VIP staatuse jaoks.

posts: Kasutajate ettepanekud (title, description, votes, status, author).

votes: Seoste tabel, mis tagab, et iga kasutaja saab hääletada ühe postituse poolt vaid üks kord (Unique Index: user + post).

🔐 Turvalisus ja API reeglid
Rakendus järgib "Least Privilege" põhimõtet:

Lugemine: Kõik (isegi sisselogimata kasutajad) näevad postitusi.

Loomine: Ainult autoriseeritud kasutajad saavad lisada postitusi ja hääletada.

VIP Staatus: Kasutaja verified staatust saab muuta ainult pärast edukat Stripe makset.

💳 Stripe integratsioon (SaaS model)
Projektis on integreeritud Stripe Test Mode.

Kasutaja saab osta VIP staatuse (15€).

Pärast makset suunatakse kasutaja tagasi veebilehele parameetriga ?payment=success.

Süsteem tuvastab eduka makse ja uuendab kasutaja profiili (verified: true).

VIP eelised: Kuldsed esiletõstetud postitused, "VIP" märk profiili juures ja reklaamivaba vaade.
