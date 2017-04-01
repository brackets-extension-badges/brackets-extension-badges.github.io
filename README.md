![brackets-extension-badges](https://cloud.githubusercontent.com/assets/17952318/24578041/b908d05e-16d8-11e7-9152-47b66656ee0e.gif)

---

## [<p align="center">brackets-extension-badges.github.io</p>](https://brackets-extension-badges.github.io)

---

**Brackets extension badges** are download counters for your [Brackets](https://github.com/adobe/brackets) extensions, as Adobe doesn't provide any official way to retrieve statistics, even for your own extension.

This repository is the source for the [brackets-extension-badges](https://brackets-extension-badges.github.io) website, which is hosted by Github.

## Libraries used

- [Vue.js](https://github.com/vuejs/vue)
- [Materialize](https://github.com/Dogfalo/materialize)
- [jQuery](https://github.com/jquery/jquery)
- [Sass](https://github.com/sass/sass)
- [clipboard.js](https://github.com/zenorocha/clipboard.js)

## Back-end

The statistics and the badge generation are both managed by a back-end server, avaliable [here](https://github.com/brackets-extension-badges/badge-provider-nodejs) in Node.js, and [here](https://github.com/brackets-extension-badges/badge-provider-php) in PHP (using the Lumen framework).