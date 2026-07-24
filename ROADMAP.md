# Roadmap — jobbsøk

## Status: MVP kjerneløkke ferdig
Scan → uttrekk → mønstre → sammenligning → veikart, alt fungerende.
Multi-side arkitektur med konsistent design (spruce/ochre/paper/ink).

---

## Kortsiktig — forbedre eksisterende kjernefunksjonalitet
- [ ] Rikere "umiddelbar scanning"-oppsummering (kategorisert, prioritert analyse per annonse)
- [ ] Forbedre veikart-forklaringer (mer nyansert enn "appears in X postings")
- [ ] Forbedre mønster-visning
- [ ] Utvide SKILL_SYNONYMS løpende med reelle annonser (Finn.no)

## Mellomlangsiktig — jobbprofil og søknader
- [ ] Utvide "Mine ferdigheter" til full jobbprofil: CV-innhold, notater, erfaring
- [ ] Søknadsside: 1) tilbakemelding på egenskrevne søknader, 2) generere skreddersydde søknader per annonse
- [ ] Kobling: søknadsgenerering bruker jobbprofil + spesifikk annonse

## Langsiktig — intervju og livssyklus
- [ ] Intervjuforberedelse-portal (fysisk + teknisk, kodeoppgaver)
- [ ] Live-scanning av profil/søknad/CV over tid
- [ ] Lenker til eksterne relevante ressurser/verktøy
- [ ] Community/rekrutterer-innsikt

## Strukturelt — kreves for å skalere utover enbruker/lokal
- [ ] Auth (ekte brukere, ikke enbruker uten innlogging)
- [ ] Herding av RLS-policies (bytte ut "allow all" med brukerskopet)
- [ ] Deployment (Vercel)
- [ ] Kapasitet/ytelse for flere brukere
- [ ] Vurdere betalte AI-verktøy (Claude API e.l.) når prosjektet er modent nok til at kostnad fordeles på faktisk bruk — ikke nå

## Arkitekturprinsipp
Alt henger sammen via ÉN delt jobbprofil. Fremtidige features (søknadsgenerering,
intervjuforberedelse, live-scanning) leser fra og skriver til samme grunnlag —
ikke isolerte datasiloer per feature.