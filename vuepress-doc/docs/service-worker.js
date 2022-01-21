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
    "revision": "44b1b462c3b338709ad0cb7efd46f249"
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
    "url": "assets/js/11.f1eb56d5.js",
    "revision": "de0de14fd37257d8d37df3cdc56c54cf"
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
    "url": "assets/js/8.b680cab3.js",
    "revision": "542737a18afd9022b29e8fb85aecf267"
  },
  {
    "url": "assets/js/9.fc85cb76.js",
    "revision": "3e8d9cf3fc7ca9effbf85718664b6654"
  },
  {
    "url": "assets/js/app.97626d03.js",
    "revision": "68d89f98af05c47ef4593861c05387ba"
  },
  {
    "url": "demo.gif",
    "revision": "9a26ce7ccf8a29356d7ef285acd597d6"
  },
  {
    "url": "deploy/execute.html",
    "revision": "80a4e98ad694539413d98c316d5565f4"
  },
  {
    "url": "deploy/execute/commandArray.html",
    "revision": "acfab7b5961d3cecb876a30b52f8ec3f"
  },
  {
    "url": "deploy/execute/hooks.html",
    "revision": "2d998bdade673e387ebc78175cf11a19"
  },
  {
    "url": "deploy/executeEnv.html",
    "revision": "9b6547afc2c0b7e8dfb4ef8e9866d5a7"
  },
  {
    "url": "deploy/executeLaravel.html",
    "revision": "5057766b9e263797f86ee4f13ff2c083"
  },
  {
    "url": "deploy/executeNuxt.html",
    "revision": "284111b77e2fd7d3f4fccdd6e4ad8873"
  },
  {
    "url": "deploy/executeVue.html",
    "revision": "418b2d900fe94c05895ead914fcf97c1"
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
    "revision": "94206feeeca9d0e488a1a3bc44af190d"
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
