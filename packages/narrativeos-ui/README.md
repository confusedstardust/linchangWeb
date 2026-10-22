# @narrativeos/ui

Shared account menu, account client, session hook, administrator link, icons, styles, translations and compact brand asset. Extracted from the existing Forge account menu; popovers continue to use Radix UI.

The source of truth is `linchangWeb/packages/narrativeos-ui`. Change this package instead of copying components into either app. Each app retains its API and navigation adapter. No Next.js dependency is required by the shared code.

The portal consumes `file:packages/narrativeos-ui`. Forge consumes an npm archive under `forge_frontend_next/vendor`, so independent Docker builds never need a sibling checkout or access to a private package registry.

To release a change, bump this package's version, then run from this directory:

```powershell
npm pack --pack-destination C:/SelfCreated/MyProject/workwithflynt/engine_skeleton/forge_frontend_next/vendor
```

In `forge_frontend_next`, run `npm install ./vendor/narrativeos-ui-<version>.tgz`, commit the archive, package manifest and lockfile together, and validate both apps. The npm lockfile pins the archive's integrity. The archive is a distribution artifact, not a second editable implementation.

Both Next.js apps must list `@narrativeos/ui` in `transpilePackages` and import `@narrativeos/ui/styles.css` before their app CSS. React and Radix are peer dependencies resolved by the consuming app.
