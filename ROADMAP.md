# Roadmap — jobbsøk

## Status: MVP kjerneløkke ferdig
Scan → uttrekk → mønstre → sammenligning → veikart, alt fungerende.
Multi-side arkitektur med konsistent design (spruce/ochre/paper/ink).

---

## Kortsiktig — forbedre eksisterende kjernefunksjonalitet
- [x] Rikere "umiddelbar scanning"-oppsummering (kategorisert, prioritert analyse per annonse)
- [ ] Forbedre veikart-forklaringer (mer nyansert enn "appears in X postings")
- [ ] Forbedre mønster-visning
- [ ] Utvide SKILL_SYNONYMS løpende med reelle annonser (Finn.no)
- [ ] Læringsmekanisme for ferdighetsgjenkjenning: analysere limte inn annonser over tid for å
      oppdage nye ferdigheter/teknologibehov som ikke fanges av dagens liste, og foreslå nye
      synonymer/omformuleringer av kjente ferdigheter automatisk — utover manuell utvidelse

## Mellomlangsiktig — jobbprofil og søknader
- [ ] Utvide "Mine ferdigheter" til full jobbprofil: CV-innhold, notater, erfaring
- [ ] Søknadsside: 1) tilbakemelding på egenskrevne søknader, 2) generere skreddersydde søknader per annonse.
      Tilbakemeldingen bør konkret være en sjekkpunkt-liste (innfridd / ikke innfridd), vurdert mot
      to kriteriesett: annonsens spesifikke krav, og generelle beste-praksis for søknad/CV-skriving
      hentet fra eksterne kilder — ikke bare lenket ut (som "Langsiktig"-punktet under), men faktisk
      vevd inn som vurderingskriterier
- [ ] Kobling: søknadsgenerering bruker jobbprofil + spesifikk annonse

## Langsiktig — intervju og livssyklus
- [ ] Intervjuforberedelse-portal (fysisk + teknisk, kodeoppgaver)
- [ ] Live-scanning av profil/søknad/CV over tid
- [ ] Lenker til eksterne relevante ressurser/verktøy
- [ ] Community/rekrutterer-innsikt
- [ ] Varsling om nye relevante stillingsannonser fra eksterne jobbportaler (Finn.no, Abakus.no,
      NAV/Arbeidsplassen, e.l.), matchet mot jobbprofilen (ferdigheter du har + ferdigheter
      stillingen etterspør). NAV har et åpent stillings-API ment for tredjepartsbruk — naturlig
      første kilde. Finn.no og andre kommersielle portaler krever trolig partnertilgang eller må
      ToS-sjekkes før noen form for automatisert innhenting bygges — ikke anta skraping er greit

## Strukturelt — kreves for å skalere utover enbruker/lokal
- [ ] Auth (ekte brukere, ikke enbruker uten innlogging)
- [ ] Herding av RLS-policies (bytte ut "allow all" med brukerskopet)
- [ ] Deployment (Vercel)
- [ ] Kapasitet/ytelse for flere brukere
- [ ] Vurdere betalte AI-verktøy (Claude API e.l.) når prosjektet er modent nok til at kostnad fordeles på faktisk bruk — ikke nå

## Vedlikehold — for når "enda en ny feature" ikke er fokus
Ikke bundet til rekkefølge eller frist. Fylles på løpende og krysses av når det passer —
stedet å falle tilbake på mellom feature-arbeid, ikke noe som skal presses gjennom på én gang.
CI kjører nå `typecheck` + `lint` på push/PR (`.github/workflows/ci.yml`), så regresjon i disse
to fanges automatisk. Verdt å utvide selve CI-jobben etter hvert som testdekning kommer.
- [ ] Testoppsett: start med Vitest og skriv første tester for `skillAnalysis.ts` sine rene
      funksjoner (ingen database, ingen React — billigst og mest lærerikt sted å begynne).
      Legg testjobben til i CI-workflowen når den finnes.
- [ ] `app/error.tsx` + synlig feil-tilstand i fetches — i dag henger sider i "Laster..." for alltid
      hvis en fetch faktisk feiler, siden ingen side håndterer feil-responser fra API-rutene
- [ ] Rydd opp i ubrukte dupliserte komponenter: `SkillGap.tsx` og `UserSkillsManager.tsx` er
      bekreftet døde (samme "kommentert ut, erstattet av inline-duplikat i siden"-mønster som
      `SkillPatterns`/`Roadmap` hadde før de ble konsolidert) — slett dem, eller gjenopplive og
      konsolider på samme måte

## Arkitekturprinsipp
Alt henger sammen via ÉN delt jobbprofil. Fremtidige features (søknadsgenerering,
intervjuforberedelse, live-scanning) leser fra og skriver til samme grunnlag —
ikke isolerte datasiloer per feature.