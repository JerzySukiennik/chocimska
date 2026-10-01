# SP Chocimska deploy notes
- Site root is the project root (served by GitHub Pages at https://chocimska.gzowo.fun). `Niepotrzebne/` is git-ignored.
- Version snapshots: NEVER run snapshot-version.sh directly. Use `bash Niepotrzebne/tools/snapshot.sh` (strips media/ and files/ from the snapshot; they are shared with the root). A plain snapshot would duplicate ~650 MB and break the 1 GB Pages limit.
- Smoke test before push: `node -e "new Function(require('fs').readFileSync('js/app.js','utf8'))"` and curl the local preview.
