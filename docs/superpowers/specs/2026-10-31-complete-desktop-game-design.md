# CAESAR – teljes asztali játék

A felhasználó a történet befejezését kérte; a telefonos támogatás az utolsó, későbbi feladat. A korábban javasolt III. fejezet, Pompeius curiája és a mentett döntések folytatása alkotja a jóváhagyott irányt.

## Kiadási határ

Három, elejétől végéig játszható fejezet, történeti lezárás és döntésösszegzés. Megmarad az első két fejezet, a római látvány, az asztali vezérlés és a mentések. Nincs új mobil UI, harcrendszer, alternatív történelmi Caesar-megmentés vagy negyedik fejezetet ígérő befejezés.

## Harmadik fejezet

A II. fejezet után a Forum nyugati útjelzője átvezet a külön, stilizált Campus Martius–Pompeius porticus–curia helyszínre. Ez kifejezett helyszínváltás, nem a Forum templomának átnevezése. A két világ azonos motorral és fizikai függvénnyel működik, memóriában váltva; a régió és a pozíció is mentődik.

Négy feladat: helyszín azonosítása egy vezetővel; a korábbi döntés szerinti figyelmeztetés/nyomozás/helyszín-ellenőrzés két irattal és egy közvetítővel; forráskritikus következtetés után az ülés és a merénylet nem grafikus elbeszélt jelenete; az írnoki beszámoló és történeti utóhang. A három út eltérő cselekvést és személyes lezárást ad, a történeti merénylet kimenetelét nem írja át.

## Szerkezet és állapot

Külön `chapter3.js`, `chapter3-ui.js` és `world/campus.js` modulok. A meglévő mentéstároló 3-as sémára migrálja az 1-es és 2-es mentéseket, az eredeti kulcsot és az első két fejezetet megőrizve. A befejezés csak minden előfeltételből vezethető le; a hibás következtetés javítható, a félbehagyott jelenet folytatható. Az új játék megerősítést kér. A kampányáttekintés a teljes játék ívét, a lezárás a mentett döntések eredményét mutatja.

## Ellenőrzés és átadás

A korábbi 18 teszt megmarad. Új állapottesztek és három valós, mentésből induló III. fejezeti útvonal, továbbá egy friss játékból induló, minden fejezeten ténylegesen végiggyalogló kampányteszt. Production prefix-próba, build, forrás- és dokumentációfrissítés, publikálás. A hálózati szabályok által blokkolt közvetlen éles próbát külön kell jelezni; a helyi/CI eredmény nem helyettesíti azt.
