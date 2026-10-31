# Róma-bővítés megvalósítási sorrend

Jóváhagyott specifikáció: ../specs/2026-10-31-rome-city-expansion-design.md. A hivatkozott writing-plans készség a felhős és helyi katalógusban nem érhető el; a konkrét megvalósítási tervet itt rögzítjük.

1. Közös régióadatok, 4-es mentésséma, régi útvonal megőrzése, három új feladat állapotgépe; migrációs és előfeltétel-tesztek.
2. Közös pályaépítési segédek, külön Subura / Boarium / Domus, valódi akadályok, mozgó futár és csónak; lusta régiójegyzék.
3. Öt régió bekötése: helyszínválasztó, útjelzők, visszaút, régiónkénti ellenőrzőpont, térkép és céljelzés.
4. A három helyszíni feladat felülete és beillesztése a friss kampányba; a régi mentések főszála változatlanul folytatható. Egyértelmű megerősítések és következő lépés.
5. Célzott állapot- és bejárástesztek: új pályák, víz/kapu, futár újrakezdése, elutazás/visszatérés és mentés. A friss teljes kampány mind az öt régiót bejárja.
6. Teljes regressziós futás, build, production prefix-próba. Forrás befagyasztása a végső tesztelés alatt. Valódi játékképek és dokumentáció.
7. GitHubra feltöltés, CI és Pages-telepítés visszaellenőrzése; forrás- és build-csomag. A közvetlen éles próba hálózati korlátját külön rögzítjük.

A felhasználó konkrét elakadt mentése nem áll rendelkezésre; annak javítását nem állítjuk reprodukció nélkül. A továbbhaladás látható visszajelzését és a meglévő átmeneteket külön ellenőrizzük.
