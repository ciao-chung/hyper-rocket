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
    "revision": "efedbf9f10937a460018ed33a92ef15f"
  },
  {
    "url": "assets/css/0.styles.5fcfe61d.css",
    "revision": "09ad09b804812a02f2fee4b3e2301919"
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
    "url": "assets/js/12.953e8117.js",
    "revision": "bbf034b6ad3e4a6d1ab60242f5682663"
  },
  {
    "url": "assets/js/13.1689a888.js",
    "revision": "f1b3eea32871ad84675ebeb34a32cf7e"
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
    "url": "assets/js/5.bd68e4c8.js",
    "revision": "f3a8982dbf4db6b5a299b07e9afb7473"
  },
  {
    "url": "assets/js/6.fa6c4a53.js",
    "revision": "fa119447ee8b8ea757b1634568d3642d"
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
    "url": "assets/js/9.fc85cb76.js",
    "revision": "3e8d9cf3fc7ca9effbf85718664b6654"
  },
  {
    "url": "assets/js/app.fb56e920.js",
    "revision": "86a8e16cc436ef5eeb6994cab2ca00bb"
  },
  {
    "url": "demo.gif",
    "revision": "9a26ce7ccf8a29356d7ef285acd597d6"
  },
  {
    "url": "deploy/execute.html",
    "revision": "a9617e34237545a5f68942ee8aaf5742"
  },
  {
    "url": "deploy/execute/commandArray.html",
    "revision": "f9e9c08ab7cd218d8f2e77bb34d5cff3"
  },
  {
    "url": "deploy/execute/hooks.html",
    "revision": "372ee7d619bc8065c6b7742b80d1c789"
  },
  {
    "url": "deploy/executeEnv.html",
    "revision": "7fd2afa33039b033c1e41862c7888928"
  },
  {
    "url": "deploy/executeLaravel.html",
    "revision": "5e2794b58cd58e14b5f7feb3dd6e2cd0"
  },
  {
    "url": "deploy/executeNuxt.html",
    "revision": "80e1bca731d80aae682ccb6ca2d22c8b"
  },
  {
    "url": "deploy/executeVue.html",
    "revision": "bd50be909a3e2a65a655ec1713ed5e66"
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
    "revision": "34dfe286318c4dd18ee6e221b7f05de3"
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
