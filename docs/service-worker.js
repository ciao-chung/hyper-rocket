/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "7ba9470c9620fcaf29ba3737216ef1ed"
  },
  {
    "url": "assets/css/0.styles.93a425e4.css",
    "revision": "7fc554aa31fbdfad24db3067e92346e9"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.ffaeeea1.js",
    "revision": "cfec1c84b262e17f30f19b6c01dcd607"
  },
  {
    "url": "assets/js/11.0d00ed41.js",
    "revision": "1728e7718fc5cfacec8be9beab2a8e62"
  },
  {
    "url": "assets/js/12.191dc66c.js",
    "revision": "488eb0447f34f8135d238a06f2ba01f7"
  },
  {
    "url": "assets/js/13.0bdd63ab.js",
    "revision": "33f3d72a333e5303a68f507214045c51"
  },
  {
    "url": "assets/js/14.6d829845.js",
    "revision": "b10d43b58820d5b5ee59159d689ecacc"
  },
  {
    "url": "assets/js/15.7061ffe4.js",
    "revision": "b175d9d18e9edd066b302955750b141a"
  },
  {
    "url": "assets/js/16.cddae4e0.js",
    "revision": "edc8450b5d2eba11a8d7770c0293c073"
  },
  {
    "url": "assets/js/2.daf7a04b.js",
    "revision": "42a43355dcaf74ac11b518530de77cd5"
  },
  {
    "url": "assets/js/3.75cb8508.js",
    "revision": "637f5d0c8b27bce239d0037b4f407135"
  },
  {
    "url": "assets/js/4.3ea03653.js",
    "revision": "05ccfb20ee453e48b00224291f426cd4"
  },
  {
    "url": "assets/js/5.40b83fb8.js",
    "revision": "6fec3b81a4ca4e72891e2cc26eaa7b1b"
  },
  {
    "url": "assets/js/6.fe0d8327.js",
    "revision": "7d3645637438fab46cb16fbe68fd5dba"
  },
  {
    "url": "assets/js/7.d5eb02ac.js",
    "revision": "04ed7aa21cd780d39adf673a92309fb0"
  },
  {
    "url": "assets/js/8.66d5eebc.js",
    "revision": "6beaba1dc60a3138c4b7f68e461b2665"
  },
  {
    "url": "assets/js/9.a13168a4.js",
    "revision": "fc8dc875fa97ce070b901c080e52ab6a"
  },
  {
    "url": "assets/js/app.64d81434.js",
    "revision": "100fa3ea4d10c5ca644a894ab61c57cf"
  },
  {
    "url": "demo.gif",
    "revision": "9a26ce7ccf8a29356d7ef285acd597d6"
  },
  {
    "url": "deploy/execute.html",
    "revision": "78fc500d200bd719725017f7a4f79250"
  },
  {
    "url": "deploy/execute/commandArray.html",
    "revision": "6fee4eeb2a5251cb407c77299fbd6f25"
  },
  {
    "url": "deploy/execute/hooks.html",
    "revision": "7ebaa31f4550ddbbbaf7d924876b1c07"
  },
  {
    "url": "deploy/executeEnv.html",
    "revision": "7ac8383416da8243022e619d4725f358"
  },
  {
    "url": "deploy/executeLaravel.html",
    "revision": "2cfc637ceca9409da013ed8312c888a0"
  },
  {
    "url": "deploy/executeNuxt.html",
    "revision": "d7a444f1f97c0ac8b631073d135b66d9"
  },
  {
    "url": "deploy/executeVue.html",
    "revision": "250d9c808d55cdb965c0c21f65bac990"
  },
  {
    "url": "icon-192x192.png",
    "revision": "accae27fbba2094dac4292ffb5aa124c"
  },
  {
    "url": "icon-512x512.png",
    "revision": "803bea36c3bf17ada8833c6d4e292bf9"
  },
  {
    "url": "icon.png",
    "revision": "b4fe075b400ab487f957c50138bbb9d6"
  },
  {
    "url": "index.html",
    "revision": "29f3750dc317bcd7100162d06f995d10"
  },
  {
    "url": "logo.png",
    "revision": "a3180e87ffbc54798dde7f2ae35f3b3a"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
