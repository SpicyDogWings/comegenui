# Taste
- Prefers to communicate in Spanish (Rioplatense register, e.g. "el remoto manda", "por las dudas"); expects replies in Spanish. Confidence: 0.85
- On git conflicts, defers to the remote ("el remoto manda"): prefers resolving by taking the upstream/remote version rather than preserving local commits. Confidence: 0.7
- Keeps implementation plans as markdown files under `.opencode/plans/` committed to the repo, and asks the agent to review a plan before executing it. Confidence: 0.6
- Action-oriented: once a plan is reviewed/approved, wants the agent to just execute it end-to-end ("hazlo") without pausing for branch/scope confirmations, and is fine doing the work on the existing branch instead of a fresh one. Confidence: 0.55
- Gives very terse, context-free instructions, often abbreviated and without subject/context (e.g. "git pull esta fallando, el remoto manda"; "el último commit tiene un plan, revisalo"; "convierte el btn en modo vapor"), and expects the agent to investigate the repo and fill in the details autonomously. Confidence: 0.65
- Wants bleeding-edge/pre-release tooling adopted and used for real, not just installed (Vue 3.6 RC, dual TypeScript 7, and asking to convert existing components to Vue's experimental "vapor" mode). Confidence: 0.5
- When asking for a code change, expects it to actually be implemented, not just investigated/reported as blocked; audits the agent's claims about what was done (e.g. repeatedly asking whether "vapor mode" was really added to the button). Confidence: 0.55
- When something is blocked/failing, wants a precise root-cause explanation of what exactly fails (e.g. "¿qué es lo que falla en modo vapor?") rather than a vague summary. Confidence: 0.5
