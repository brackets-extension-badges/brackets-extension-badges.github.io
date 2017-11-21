![brackets-extension-badges](https://user-images.githubusercontent.com/17952318/33060113-6fa50e88-ce97-11e7-9694-e282b634ce9b.png)

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

The statistics and the badge generation are both managed by a back-end server, available [here](https://github.com/brackets-extension-badges/badge-provider-nodejs) in Node.js, and [here](https://github.com/brackets-extension-badges/badge-provider-php) in PHP (using the Lumen framework).
