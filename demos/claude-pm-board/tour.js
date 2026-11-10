// Demo data for claude-pm-board. Schema: see job/site/demos/demo.js (validated by scripts/test-demos.mjs).
window.DEMO = {
  "slug": "claude-pm-board",
  "name": "claude-pm-board",
  "repo": "https://github.com/sinasehlaver/claude-pm-board",
  "tagline": "A local board for running Claude Code across many projects, kept in plain Markdown files that you and your agents both read and write.",
  "intro": "With a dozen projects and short Claude Code sessions, the real status of each one ends up in your head or in old transcripts. pm keeps it in small files next to your code: what's happening, what's next, and where to pick up. Start work from the board and the session reads those files first and updates them before it stops.",
  "stageTitle": "pm · localhost (fake workspace)",
  "tryLede": "A mock of the board with a made-up workspace. The terminal is simulated: no Claude Code runs and nothing is saved.",
  "tasks": [
    { "id": "open", "text": "Open a project card", "hint": "Click the band-site card to see its backlog.", "ok": "Each card is one project: its state and backlog files, on one page." },
    { "id": "add", "text": "Add a todo", "hint": "Type a task in the box under Todo and press Enter.", "ok": "Saved to .claude/backlog/band-site.md, as plain Markdown." },
    { "id": "run", "text": "Press ▶ on a todo", "hint": "Hand that todo to a Claude Code session.", "ok": "The session was briefed on the task and on the project's files." },
    { "id": "file", "text": "Read the state file", "hint": "Click state/band-site.md under the card.", "ok": "The session left a note for whoever comes next, including you." }
  ],
  "finish": "That's the loop: board → ▶ → a briefed session → files updated → board.",
  "howLede": "There is no database. Everything lives in $PM_ROOT/.claude/, and the server only watches and edits these files.",
  "how": [
    { "title": "state/<slug>.md", "text": "Now, Next, Blockers and Resume for one project, capped at 4000 characters, including the exact command to re-run the last test." },
    { "title": "backlog/<slug>.md", "text": "Doing, Todo, Blocked and Done as Markdown bullets. A removed todo is archived, never lost." },
    { "title": "rules/<slug>.md", "text": "Constraints and gotchas for that project, read by every session launched from the board." },
    { "title": "▶ launches a briefed session", "text": "pm calls no LLM itself. ▶ opens a terminal with Claude Code and a prompt that says: read these files, do this task, update them before you stop." },
    { "title": "Runs while you're away", "text": "Tick several todos for one session with subagents, or mark them auto and let unattended runs use spare quota, handing off near a limit." },
    { "title": "Looks after the workspace", "text": "Doctor finds wasteful patterns in your transcripts, Sessions finds old conversations, and Tools covers changes, ports and env files." }
  ],
  "shot": { "src": "../../img/project-claude-pm-board.png", "alt": "The real pm board with colourful project cards, next steps, open-task counts and Start buttons.", "caption": "The real board, on a throwaway workspace with fake projects." },
  "endTitle": "Run it on your own projects",
  "endText": "Node and Claude Code are all you need. Launching sessions is macOS-only for now. Quick start, configuration and the full guide are in the repo."
};
