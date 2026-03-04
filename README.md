# SaaS tellimuse demo projekt

## Ülevaade

See projekt demonstreerib kaasaegset SaaS-arhitektuuri, kus autentimine ja maksed on delegeeritud välistele pilveteenustele.

Projekti eesmärk oli realiseerida:

* Autentimine (Clerk hosted login)
* Korduvmakse (Stripe Payment Link)
* Backend teenus Renderi platvormil
* Automaatne suunamine pärast edukat makset

Lahendus järgib 12-Factor App metoodika Backing Services põhimõtet, kus väliseid teenuseid käsitletakse võrgu kaudu tarbitavate komponentidena.

---

## Arhitektuur

HTML esileht koos maksenupuga
↓
Stripe hosted checkout
↓
Automaatne suunamine pärast makset
↓
Backend API Renderis

Autentimine toimub eraldi Clerk hosted login lehe kaudu.

---

## Autentimine

Autentimine on teostatud Clerki Hosted Login Page abil.

Lubatud meetodid:

* Email + parool
* Google OAuth

Seadistatud on meeskonna nimi ja bränding.

Clerk haldab:

* Paroolide räsi
* Sessioonihaldust
* OAuth integratsiooni
* Turvalist sisselogimisvoogu

Backend ei salvesta paroole ega tundlikke autentimisandmeid.

---

## Maksed

Maksed on realiseeritud Stripe Payment Links funktsionaalsusega testrežiimis.

Loodud toode:

* Nimi: Meie SaaS-i PRO-tellimus
* Hind: 15 € kuus
* Tüüp: korduvmakse (subscription)

Stripe haldab:

* Kaardimaksete töötlemist
* PCI DSS vastavust
* Hosted maksevormi
* Maksekinnitust
* Suunamist pärast edukat makset

Testimiseks kasutati Stripe testkaarte.

---

## Backend (Render)

Backend on loodud Node.js ja Express abil.

Rakenduse endpointid:

GET /health
Tagastab teenuse staatuse ja uptime väärtuse.

GET /
Tagastab HTML lehe, mis sisaldab Stripe maksenupu linki.

Keskkonnamuutujad:

* Rakendus kasutab process.env.PORT muutujat, mis tagab ühilduvuse Renderi platvormiga.

Pärast edukat makset suunab Stripe kasutaja automaatselt Renderis jooksvale teenusele.

---

## Demonstreeritud põhimõtted

* 12-Factor App – Backing Services
* SaaS ja PaaS integratsioon
* Security by Design
* Privacy by Design
* Vastutuse delegeerimine spetsialiseeritud teenustele
* Turvaline maksete ja autentimise arhitektuur

---

## Kasutatud tehnoloogiad

* Node.js
* Express
* Stripe (Payment Links, Test Mode)
* Clerk (Authentication)
* Render (Cloud hosting)

---

## Tulemus

* Töötab hosted autentimisleht
* Loodud korduvmaksega toode
* Genereeritud ja testitud makselink
* Automaatne suunamine pärast edukat makset
* Avalikult kättesaadav backend teenus Renderis

Projekt demonstreerib minimaalset, kuid realistlikku SaaS makse- ja autentimisarhitektuuri, kus tundlikud andmed on delegeeritud professionaalsetele välisteenustele.
