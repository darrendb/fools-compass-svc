# FoolsCompass Backend
(Built with Strapi)

Note: using yarn rather than npm

## GitHub Repo
https://github.com/darrendb/fools-compass-svc
## GitHub Wiki
https://github.com/darrendb/fools-compass-svc/wiki

## Getting Started
### (First-time, or when changing to un-watched files)
$ yarn build

### (Daily Dev, assumes build has been called at least once)
$ yarn develop

### (Production)
$ yarn start

## Default Dev access uri
http://localhost:1937/dashboard

# Release Notes
## 2021-08-22-1
- Home page has "Warning: Prop `className` did not match..."
- readings/slug page has "Warning: Extra attributes from the server: style..."

## Heroku
### logs
heroku logs -n 200 -a fools-compass-svc
heroku logs --tail -a fools-compass-svc
heroku addons:open papertrail -a fools-compass-svc
