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
    "revision": "ee3a585742e93ef2cb978dd50b1a31b5"
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
    "url": "assets/js/13.d7559c45.js",
    "revision": "6b7e4fd392c3e76775a8274e3bf93bf6"
  },
  {
    "url": "assets/js/14.99f28a3c.js",
    "revision": "6966d17289170bda1f713e24141cadd2"
  },
  {
    "url": "assets/js/15.b72d22a3.js",
    "revision": "0702137c67e43d0807b11ae174de04e5"
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
    "url": "assets/js/9.bd779bc3.js",
    "revision": "e6432060b8ffcf83d34531a9bd3577fc"
  },
  {
    "url": "assets/js/app.ac3f280a.js",
    "revision": "ae586cd7e114460382e014a6b9bb32c4"
  },
  {
    "url": "demo.gif",
    "revision": "9a26ce7ccf8a29356d7ef285acd597d6"
  },
  {
    "url": "deploy/execute.html",
    "revision": "26132e7d6c0f767bbc543bb85d62f1fe"
  },
  {
    "url": "deploy/execute/commandArray.html",
    "revision": "cb01cb0c539efe9cbecb5d58148853dc"
  },
  {
    "url": "deploy/execute/hooks.html",
    "revision": "6d52fa5f903bd7d43f7a06edb13ce166"
  },
  {
    "url": "deploy/executeEnv.html",
    "revision": "6aaf5bac76fcff39525acd17a88d8e8f"
  },
  {
    "url": "deploy/executeLaravel.html",
    "revision": "04703b46d7ff55e734c56b4c9c7bb90e"
  },
  {
    "url": "deploy/executeNuxt.html",
    "revision": "8ec40b6f57886cffe5767d65b459a53d"
  },
  {
    "url": "deploy/executeVue.html",
    "revision": "a4189f3ddc9b2e89391e8b485a88ae49"
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
    "revision": "8cce73f430ab1c49da34cb4a20f6f346"
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
