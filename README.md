# mern-bt

A personal follow-along of Brad Traversy's **"MERN Stack Front To Back"**
course — building a social-network REST API (Node/Express/MongoDB) with a
React/Redux client. The repository's own `package.json` description names
the course directly; this README documents what the **default branch
(`master`)** actually contains, since that's what a visitor sees first.

No source files were changed to produce this README beyond the security
fix noted under "Known limitations."

## What's actually on `master`

`master` is **backend-only** — there is no `client/`, `fe/`, or any React
code on this branch, despite the course (and the repo description) being
about a full MERN app with a React/Redux frontend.

| Path | Purpose |
|---|---|
| `server.js` | Express app entry point; mounts four API routers, connects to MongoDB on boot. |
| `config/db.js`, `config/default.json` | Mongoose connection + JWT secret, loaded via the `config` npm package. |
| `middleware/auth.js` | Verifies a JWT passed in the `x-api-token` header. |
| `models/User.js`, `models/Profile.js` | Mongoose schemas — `User` (name/email/password/avatar) and `Profile` (company/skills/experience/education/social links). |
| `routers/api/users.js` | `POST /api/users` — register a user (bcrypt-hashed password, Gravatar avatar, returns a JWT). |
| `routers/api/auth.js` | `GET /api/auth` (current user, JWT-protected), `POST /api/auth` (login, returns a JWT). |
| `routers/api/profile.js` | Full CRUD for the current user's profile, plus experience/education sub-resources (`PUT`/`DELETE`) and public profile lookups. |
| `routers/api/posts.js` | **Stub only** — `GET /` returns the literal string `"Posts route."`. No create/list/delete, and there's no `models/Post.js` on this branch. |
| `command.txt` | Scratch notes of the `npm install`/`npm audit` commands run while building the project — not a script. |

`npm test` is the CRA/Express default placeholder (`echo "Error: no test
specified" && exit 1`) — there is no real test suite.

## Branches: the React/Redux frontend exists, but not here

`master`'s tip (`081c4b0`) is a Renovate dependency-bump merge from
2023-11-03 — a later push date than any other branch, which could read as
"most current." It isn't. `git merge-base` shows `master` shares history
with `Section-1`/`Section-2`/`Section-3` (the early backend lessons: auth,
users, profiles) but was never merged forward from `Section-5` onward —
its merge-base with `Section-9` is `Section-1`'s own tip commit
(`059cc15`). Everything `master` gained after that point is Renovate PRs
(`#2`–`#9`, dependency bumps only); no application commits.

The actual course progression continued on unmerged branches:

- **`Section-5`** adds `models/Post.js` and real create/list/comment/like
  routes to `routers/api/posts.js` (vs. `master`'s stub).
- **`Section-6` through `Section-9`** add `fe/`, a full Create React App
  frontend with `react-redux`, `redux`, `redux-thunk`, and
  `react-router-dom` — matching the course's "React, Redux" description —
  plus a static `devconnector_html_theme/` reference theme. `Section-9` is
  the most advanced state found.

None of `Section-5`–`Section-9` are merged into `master` (confirmed via
`git merge-base --is-ancestor`, all `NO`). A visitor to the repo's default
branch sees a backend-only stub of the project the description advertises.

## Known limitations (disclosed, and one fixed)

- **Fixed in this pass — exposed live credentials.** `config/default.json`
  was tracked in git (`.gitignore` only excluded `node_modules/`) and
  contained a real-looking MongoDB Atlas connection string with an
  embedded username/password, plus a JWT signing secret, committed since
  this repo's initial commit and pushed to a public GitHub repo. Both
  values have been replaced with placeholders in this commit, and
  `config/local.json` (the `config` package's convention for
  gitignored local overrides) has been added to `.gitignore` so a real
  config can be supplied locally without being committed. **This does not
  undo the exposure**: the original credentials remain visible in every
  prior commit in this repo's git history and must be treated as already
  compromised. Rotating the MongoDB Atlas database user's password and
  regenerating the JWT secret is a separate action only the account owner
  can take, and purging the old values from git history (e.g. via
  `git filter-repo` or BFG, which requires a force-push) is a separate,
  more disruptive decision — neither was done as part of this
  documentation pass.
- **The `posts` feature doesn't exist on `master`** — see "Branches"
  above; it's a stub pending a merge that never happened.
- **No `client`/`fe` React app on `master`** despite the repo/course
  description — see "Branches."
- **No automated tests.**
- **No `LICENSE` file.**

## Setup

```bash
npm install
cp config/default.json config/local.json   # then fill in real values
npm run server                              # nodemon, http://localhost:5000
```

`config/local.json` is gitignored and overrides `config/default.json` via
the `config` package — set a real `mongoURI` and `jwtSecretKey` there,
never in `default.json`.
