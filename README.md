# Elza Browser

##### Private, fast and minimal web browser based on electron with builtin tor.

### Build Instructions

- Clone the repository and install required npm modules
- Install electron `npm install electron@9.3.1 --save-dev`. Latest electron is not currently supported due to a [bug in electron-dl](https://github.com/sindresorhus/electron-dl/issues/122).
- Place the tor binary inside resources folder. If you are using Windows, tor binary is directly available at the tor website. You have to manually build tor if you are using Mac/Linux. Follow [this link](https://www.torproject.org/download/tor/) to get the tor source code. Build instructions are available [here](https://2019.www.torproject.org/docs/tor-doc-unix.html.en).
  - In Windows, place tor executable at ./resources/win/Tor/tor.exe
  - In Mac and Linux, place tor executable at ./resources/lin/tor
- `npm run electron-dev` to run elza browser in developer mode.
- Refer package.json for npm scripts to build elza for your platform.
- Refer the [github workflow](https://github.com/elzabrowser/elza/blob/master/.github/workflows/release.yml) to learn building elza from source.
