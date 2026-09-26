# Taste

- Prefers to communicate in Spanish (Rioplatense register, e.g. "el remoto manda", "por las dudas"); expects replies in Spanish. Confidence: 0.85
- On git conflicts, defers to the remote ("el remoto manda"): prefers resolving by taking the upstream/remote version rather than preserving local commits. Confidence: 0.7
- Keeps implementation plans as markdown files under `.opencode/plans/` committed to the repo, and asks the agent to review a plan before executing it. Confidence: 0.6
- Gives very terse, context-free instructions (e.g. "git pull esta fallando, el remoto manda"; "el último commit tiene un plan, revisalo") and expects the agent to investigate the repo and fill in the details autonomously. Confidence: 0.6
