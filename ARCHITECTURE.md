# BroFix public site (brofixapp.com) - architecture

## Stack

Static HTML/CSS, zero npm dependencies. Node 24 build script (build.mjs) wraps src/pages/<he|en>/<page>.html bodies in src/partials/layout.mjs and writes dist/. Hosted on GitHub Pages (custom domain brofixapp.com).

## Modules and boundaries

src/pages/he and src/pages/en (one file per page, same name in both), src/partials (layout), src/i18n (labels), src/css (one stylesheet), static/ (copied as-is: assets, CNAME), scripts/ (gates). dist/ is generated and gitignored.

## Invariants

_(not provided at init)_

<!-- crew:start -->
# Brofix public site (brofixapp.com) - architecture

## Stack

static HTML, Node build script, zero npm deps

## Modules and boundaries

src/pages, src/partials, src/css, src/i18n, build.mjs, scripts

## Invariants

_(not provided at init)_
<!-- crew:end -->
