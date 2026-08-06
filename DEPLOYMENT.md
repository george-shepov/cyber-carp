# Cyber Carp VPS deployment

The repository includes a manual immutable-release workflow at `.github/workflows/deploy-vps.yml`.

## Intended target

- Host: `shepovps.giorgiy.org`
- User: `shepov`
- Public URL: `https://cyber-carp.com`
- Release path: `/srv/www/cyber-carp.com/current`
- Release layout: `/srv/www/cyber-carp.com/releases/<run-id>-<sha>/`

The path is intentionally separate from every existing site. The workflow does not stop Docker projects, publish ports, or modify the shared edge.

## Required GitHub production secrets

Add these to the repository’s protected `production` environment before running the workflow:

```text
CYBER_CARP_VPS_HOST=shepovps.giorgiy.org
CYBER_CARP_VPS_USER=shepov
CYBER_CARP_VPS_PORT=22
CYBER_CARP_VPS_PATH=/srv/www/cyber-carp.com/current
CYBER_CARP_VPS_SSH_KEY=<private deployment key; never commit this>
CYBER_CARP_VPS_KNOWN_HOSTS=<pinned host key; never disable host verification>
```

The private key must be entered through GitHub Secrets, not pasted into source control or chat.

## VPS preparation

Before the first release, the `shepov` account must own or be permitted to create:

```text
/srv/www/cyber-carp.com/releases
/srv/www/cyber-carp.com/current
```

The shared `shepov_shared_edge` configuration must contain a reviewed `cyber-carp.com` server route pointing at the `current` directory. Do not start another nginx process or publish ports 80/443 from this application.

## Run

After the branch is merged or the workflow is manually selected from the branch, run **Deploy Cyber Carp preview** and provide the exact commit SHA. The workflow checks out that SHA, uploads only the static runtime files, switches the `current` symlink atomically, and verifies `/site-release.json` through the public edge.

The current paid site should remain the active DNS/edge route until the preview is accepted and the real Cyber Carp media and business details replace the placeholders.
