# Running tests locally

## SauceLabs
1) Download the [saucelabs proxy](https://wiki.saucelabs.com/display/DOCS/Sauce+Connect+Proxy)
2) Run ```yarn functional-tests``` to start a local server on localhost:8000
3) Run the proxy ```./bin/sc -u SAUCELABS_USER_NAME -k SAUCELABS_ACCESS_KEY -N -i test``` to allow saucelabs to access your localhost
4) Run the tests
```SAUCE_USERNAME=SAUCELABS_USER_NAME SAUCE_ACCESS_KEY=SAUCELABS_ACCESS_KEY TRAVIS_JOB_NUMBER=TUNNEL_ID FILE_ID="285568802145" FILE_VERSION_ID="300497533713" node ./node_modules/codeceptjs/bin/codecept.js run --verbose``` where SAUCE_USERNAME, SAUCELABS_ACCESS_KEY can be found in saucelabs website. TUNNEL_ID is a unique identifier such as your username.

## Selenium (without SauceLabs)
1) Install selenium-standalone `npm install selenium-standalone@latest -g`
2) Install Selenium drivers `selenium-standalone install`
3) Start Selenium `selenium-standalone start`
4) In a separate terminal, build BoxAnnotations `yarn run selenium-build`
5) Run functional tests `FILE_ID="285568802145" FILE_VERSION_ID="300497533713" yarn run functional-tests`
