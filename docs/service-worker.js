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
    "revision": "86b80c84bc43c7430d952f163f84475c"
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
    "url": "assets/js/10.caf39c9c.js",
    "revision": "cedc8048935de8dca9f22c998a886832"
  },
  {
    "url": "assets/js/11.a2abc9c3.js",
    "revision": "479ea0354dc9b6104e5b7ba8139989e8"
  },
  {
    "url": "assets/js/12.7d9ae852.js",
    "revision": "1da06c0749beb6fe05a50fa48a8c8c99"
  },
  {
    "url": "assets/js/13.24c98ed5.js",
    "revision": "b10538013cb6477166bcfbbc7bd0f15d"
  },
  {
    "url": "assets/js/14.b0fb5756.js",
    "revision": "b86f2ca23f27148de1a1111eec525c67"
  },
  {
    "url": "assets/js/15.96773cc9.js",
    "revision": "c5168fb304291fe8c5c9fa3827c6dd75"
  },
  {
    "url": "assets/js/16.017e5e04.js",
    "revision": "3a57102c339b52a95669370e468fa3dc"
  },
  {
    "url": "assets/js/17.0da08839.js",
    "revision": "98228f8ae896adbe4ddd458759cb1e89"
  },
  {
    "url": "assets/js/18.12480274.js",
    "revision": "00d8bece645d1d4e98e1fd4878c1c215"
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
    "url": "assets/js/4.097a04aa.js",
    "revision": "a4da5a231afdf27ed565a5739cd534e6"
  },
  {
    "url": "assets/js/5.6ce5b4c6.js",
    "revision": "39c9e832ca6b0624eb445b306029a7f0"
  },
  {
    "url": "assets/js/6.3d18361f.js",
    "revision": "720ffc4078ec1a7a6c527c8b525873cb"
  },
  {
    "url": "assets/js/7.d5eb02ac.js",
    "revision": "04ed7aa21cd780d39adf673a92309fb0"
  },
  {
    "url": "assets/js/8.adb38780.js",
    "revision": "defce7e7f8fe9455c5dea7b3075736d3"
  },
  {
    "url": "assets/js/9.e8a78482.js",
    "revision": "8b15ecfbdef7cea2671a78f58d29325a"
  },
  {
    "url": "assets/js/app.fea373ad.js",
    "revision": "3e6f24939628d8c3dfe017278854a79b"
  },
  {
    "url": "demo.gif",
    "revision": "9a26ce7ccf8a29356d7ef285acd597d6"
  },
  {
    "url": "deploy/execute.html",
    "revision": "7a87eca8f37315ccedf97d42b1861b8c"
  },
  {
    "url": "deploy/execute/commandArray.html",
    "revision": "a09d917550cee2a4aa35d301f4e65327"
  },
  {
    "url": "deploy/execute/hooks.html",
    "revision": "331f3649a1be79c619cf84917d777d17"
  },
  {
    "url": "deploy/executeCommand.html",
    "revision": "795bcb0277a7cacb20962dd5bc923d9e"
  },
  {
    "url": "deploy/executeEnv.html",
    "revision": "15824db1a7314b7765a9567fa4c11c65"
  },
  {
    "url": "deploy/executeLaravel.html",
    "revision": "47b72b0624cd3ac6033a37753c0c9667"
  },
  {
    "url": "deploy/executeNuxt.html",
    "revision": "9850c081cb9f24f6ae453a49feb2e88d"
  },
  {
    "url": "deploy/executeVue.html",
    "revision": "997a76a5df79ae34b3c031fc13ee051e"
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
    "revision": "4a298c9f48174879c8c9faf01f9d708d"
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
