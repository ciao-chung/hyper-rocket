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
    "revision": "8112a28eeb9fa55d5c2fd1d0834bbfcb"
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
    "url": "assets/js/10.98c3b305.js",
    "revision": "58d350226bfc21cfe716913df278b653"
  },
  {
    "url": "assets/js/11.83bb81c9.js",
    "revision": "dbe4f56d7fc00bcbdd3aa866bc63687d"
  },
  {
    "url": "assets/js/12.191dc66c.js",
    "revision": "488eb0447f34f8135d238a06f2ba01f7"
  },
  {
    "url": "assets/js/13.8d7a635c.js",
    "revision": "440d713745b47794a90783e76bf1f873"
  },
  {
    "url": "assets/js/14.19717449.js",
    "revision": "a9538cdb687860bc6ad9880b08fe73d0"
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
    "url": "assets/js/8.db579477.js",
    "revision": "9a8cb5aeafd0dd9cadce5f29b3bbb807"
  },
  {
    "url": "assets/js/9.397c9b80.js",
    "revision": "b8e72980ec906c535a4a9e62d0ab1cca"
  },
  {
    "url": "assets/js/app.687a99a0.js",
    "revision": "c8bcd9bc9825ad718f5b8717f18cbaac"
  },
  {
    "url": "demo.gif",
    "revision": "9a26ce7ccf8a29356d7ef285acd597d6"
  },
  {
    "url": "deploy/execute.html",
    "revision": "e934fe59d9a977423939483a87632f4e"
  },
  {
    "url": "deploy/execute/commandArray.html",
    "revision": "2923bd862b21508f0bdefbe20613ce3e"
  },
  {
    "url": "deploy/execute/hooks.html",
    "revision": "fe571fa39f264f5ade1849d8d1061ea2"
  },
  {
    "url": "deploy/executeEnv.html",
    "revision": "20c73694ff726f1b70e77ade06e8140a"
  },
  {
    "url": "deploy/executeLaravel.html",
    "revision": "f8d100789ceb80df13ee0b532f83e569"
  },
  {
    "url": "deploy/executeNuxt.html",
    "revision": "deb74c74285b7b65315c31924f96b64c"
  },
  {
    "url": "deploy/executeVue.html",
    "revision": "7028e5e4b0d3709c803b9f8dc384e06b"
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
    "revision": "c7707247c899f977283683e914c103cd"
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
