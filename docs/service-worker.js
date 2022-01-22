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
    "revision": "6f8d9e410f6c429598b6cff225d32bbd"
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
    "url": "assets/js/10.d264d10e.js",
    "revision": "338f48b1e15f764699eee72ff6864a07"
  },
  {
    "url": "assets/js/11.65dae30a.js",
    "revision": "7a034a3d737a3df09142374f970d0f5a"
  },
  {
    "url": "assets/js/12.dae70fe8.js",
    "revision": "1d603d085ddc2a0e063e45a75864f5a9"
  },
  {
    "url": "assets/js/13.b1f88abc.js",
    "revision": "94925d67ea215013c8838be3e7efc8ba"
  },
  {
    "url": "assets/js/14.9faf7021.js",
    "revision": "3e4ae7f6459a870a5e853fdc055df089"
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
    "url": "assets/js/8.d41c02db.js",
    "revision": "fe13601997987acd5c934c5c8bef6c51"
  },
  {
    "url": "assets/js/9.8ecbd067.js",
    "revision": "380f3bb8635698da980f02a1fa423acd"
  },
  {
    "url": "assets/js/app.cda44235.js",
    "revision": "c48db8a839195944abb20777022da035"
  },
  {
    "url": "demo.gif",
    "revision": "9a26ce7ccf8a29356d7ef285acd597d6"
  },
  {
    "url": "deploy/execute.html",
    "revision": "81c6d509288fff751c305f2afe39d753"
  },
  {
    "url": "deploy/execute/commandArray.html",
    "revision": "ae782cc49bb0bffb3f1b6229fcb96a91"
  },
  {
    "url": "deploy/execute/hooks.html",
    "revision": "16156ee258bed528436ce0ac19f90bb2"
  },
  {
    "url": "deploy/executeEnv.html",
    "revision": "398083e624b3b44f964e5a7655eed213"
  },
  {
    "url": "deploy/executeLaravel.html",
    "revision": "4742cd817648922da0ce415a913e9128"
  },
  {
    "url": "deploy/executeNuxt.html",
    "revision": "c296bb3881dd1e7a4b7b58e374e604ca"
  },
  {
    "url": "deploy/executeVue.html",
    "revision": "d03bc3c0ec4dc6ef1408032fd14732a7"
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
    "revision": "d037bde359c1048023083bdf899ec1ff"
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
