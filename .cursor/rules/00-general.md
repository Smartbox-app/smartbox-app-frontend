# General agent process

## After each prompt / feature

Before finishing a response that changed code:

1. Re-read the relevant `.cursor/rules/*` that apply to the files touched (at least `00-general`, plus `10-react` for UI / `20-nestjs` for API).
2. Diff your change against those rules (imports, component style, reuse of existing UI, patterns called out there).
3. Fix any rule drift in the same turn — do not leave “follow-ups” for style/convention violations you just introduced.
4. If a rule is unclear or conflicts with an explicit user request, follow the user request and note the conflict in one line.
