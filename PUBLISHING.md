# GitHub és GitHub Pages

A meglévő CAESAR-demó forrása és statikus fájljai a `main` ágra kerülnek. A `node_modules`, a `dist` és a Playwright ideiglenes eredménykönyvtárai nem részei a forráscommitnak. A négy játékbeli képernyőkép és az ellenőrzési jegyzőkönyv az `artifacts/` könyvtárban található.

## Automatikus publikálás

A `.github/workflows/pages.yml` folyamat minden `main` push után:

1. Node.js 24 alatt, a lockfile alapján telepíti a függőségeket.
2. Telepíti a Chromium tesztböngészőt, és lefuttatja a két meglévő tesztet.
3. Elkészíti a statikus Vite-buildet, böngészőben ellenőrzi a projekt alkönyvtára alatti betöltést, majd feltölti az artifactot.
4. A GitHub által biztosított tokennel telepíti azt a GitHub Pages-re. Saját API-kulcsot nem igényel.

Az első telepítéshez a repository **Settings → Pages → Build and deployment → Source** mezőjében **GitHub Actions** szükséges. Ha a repository privát, a Pages elérhetősége a GitHub-előfizetéstől és a repository beállításaitól függ.

A workflow kézzel is elindítható a repository **Actions → Verify and publish CAESAR → Run workflow** menüpontjából. A GitHub-oldali sikeres build és deploy ellenőrzendő; a helyi build nem bizonyítja a távoli publikálást.

A szokásos projektcím: `https://tikitaka1984.github.io/caesar-marcius-idusa/`. Ez várt cím, és csak sikeres telepítés után tekinthető működő játéklinknek.

## Ellenőrzés

```sh
npm ci
npm run build
npm test
npm run test:pages
```

A build relatív erőforrásútvonalakkal készül. A játék szkriptjei, a favicon, a karakteratlasz és a burkolattextúra a repository alkönyvtára alatt is helyesen kell betöltődjenek. A Pages-oldal tényleges böngészős ellenőrzésénél a belépést, a renderelt WebGL-képet, az irányítást és a konzolt is ellenőrizni kell.

A felhőkörnyezetből az API-műveletekhez `api.github.com`, a nyilvános játék ellenőrzéséhez `tikitaka1984.github.io` hálózati elérése szükséges. Ha az API-hálózat tiltott, a meglévő Git-hozzáférésen keresztüli forrásfeltöltés ettől még működhet; az adminisztratív Pages-beállítás és a nyilvános oldal ellenőrzése azonban külön marad.

## A jelenlegi integráció korlátja

A helyi ellenőrzések sikeresek, de a 2026-10-23-i publikálási kísérletkor a Git-feltöltés és a GitHub API írási műveletei is 403-as jogosultsághibát kaptak. A GitHub-kapcsolatnak a repository tartalmának és a workflow fájlnak az írását, valamint a Pages létrehozását is engedélyeznie kell. A fiók adminisztrátori jogosultságát jelző metadata önmagában nem bizonyítja az integráció írhatóságát. A hozzáférés javítása után a már elkészült helyi `main` feltölthető; a játékot nem kell újra létrehozni.

A teljes Git-történetet tartalmazó `caesar-marcius-idusa-publication.bundle` alternatív helyi visszaállítása:

```sh
git clone caesar-marcius-idusa-publication.bundle caesar-marcius-idusa
cd caesar-marcius-idusa
git remote set-url origin https://github.com/Tikitaka1984/caesar-marcius-idusa.git
git push -u origin main
```

Ezt olyan saját gépen is végre lehet hajtani, ahol a GitHub-bejelentkezés már írásra jogosult. A sikeres push után a Pages forrása **GitHub Actions** legyen, majd az Actions felületen ellenőrizni kell a telepítést.
