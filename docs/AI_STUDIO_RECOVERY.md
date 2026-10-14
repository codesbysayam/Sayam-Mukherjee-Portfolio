# Google AI Studio Recovery Procedure

## Purpose

Preserve project integrity when an AI Studio task fails, is cancelled, or stops before completing its requested changes.

> **Important Real-World Principle**: Application code cannot alter or prevent Google AI Studio's internal cloud execution timers or platform-level cancellation mechanisms. Instead, this recovery system guarantees that any interruption leaves an inspectable, recoverable audit trail so that work is never lost, discarded, or needlessly re-executed from scratch.

---

## 1. Before Starting a Major Change

1. **Check Environment State**:
   - Inspect existing files, recent edits, and the latest status recorded in `docs/IMPLEMENTATION_LOG.md`.
   - Run typecheck (`npm run lint`) and build (`npm run build`) to ensure you are starting from a clean baseline.
2. **Identify Small, Atomic Scopes**:
   - Deconstruct complex tasks into independently testable steps (1–3 related files maximum per step).
3. **Record Planned Task**:
   - Note the Task ID and intended files in `docs/IMPLEMENTATION_LOG.md` under `Active task`.
4. **Preserve Checkpoints**:
   - When remote Git synchronization is configured (`https://github.com/codesbysayam/Sayam-Mukherjee-Portfolio`), ensure previous work is synced or captured in local snapshot records.

---

## 2. If a Task Is Cancelled or Interrupted

When resuming after an unexpected stop, timeout, or context compaction:

1. **NEVER Discard or Reset Blindly**:
   - Do NOT run destructive reset commands like `git reset --hard` or delete entire directories.
   - Do NOT assume that no files were changed; partial edits often exist on disk.
2. **Inspect Current Project Files**:
   - Check modified files and timestamps.
   - If Git is initialized, run `git status` and `git diff` to see exactly what changed.
   - If running inside a container without local `.git` metadata, check the timestamps and content of target files directly.
3. **Compare with `docs/IMPLEMENTATION_LOG.md`**:
   - Identify which changes from the previous active task were completed, partially applied, or untouched.
4. **Preserve Valid Completed Work**:
   - Keep verified edits that compile and pass type checks.
   - Fix partially applied syntax with targeted, surgical line edits (`replace_file_content`).
5. **Rerun Available Verification Commands**:
   - Execute `npm run lint` (`tsc --noEmit`).
   - Execute `npm run validate:data` (`python3 tools/python/portfolio_data_validator.py`).
   - Execute `npm run build` to confirm production bundling succeeds.
6. **Resume from the Last Verified Checkpoint**:
   - Resume ONLY the unfinished subtask rather than rerunning the entire sequence from the very beginning.
7. **Update the Implementation Log**:
   - Document what was found, what was fixed, and the actual test outcomes.

---

## 3. How to Inspect Partially Modified Files

When an edit gets truncated or interrupted midway:
- Run `npm run lint` or `tsc --noEmit`. The TypeScript compiler directly pinpoints broken syntax, unmatched brackets, or missing exports with exact line and column numbers.
- Use `view_file` around the reported error line to see the incomplete code block.
- Apply `replace_file_content` to close unclosed tags, restore missing commas, or complete the intended function.
- Verify again with `npm run lint` before touching any other files.

---

## 4. How to Restore a Known-Good Version When Necessary

- **If Git tracking is active**:
  - To discard only an unverified, broken file: `git checkout -- <file-path>`
  - Never run `git reset --hard` across the entire working tree unless explicitly instructed.
- **If Git is not active in the runtime**:
  - Keep module backups or revert only the specific problematic function using `replace_file_content`.
  - Reference documented baseline states in `docs/ARCHITECTURE.md` and `docs/MEMORY.md`.

---

## 5. Preventing Regressions and Overwriting

- **Read Before Write**: Always inspect existing code before applying edits. Never guess file contents.
- **Surgical Edits**: Use targeted replacements (`replace_file_content`) over whole-file rewrites.
- **Zero Placeholder Data**: Never overwrite real, verified biographical or technical portfolio data with generic placeholders.
- **Safe Area & Responsive Discipline**: Whenever modifying layouts, test that changes maintain responsiveness across 320px–3840px without introducing horizontal scrolling.
