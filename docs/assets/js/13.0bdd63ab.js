(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{383:function(t,a,e){"use strict";e.r(a);var s=e(49),n=Object(s.a)({},(function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[e("h1",{attrs:{id:"laravel佈署"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#laravel佈署"}},[t._v("#")]),t._v(" Laravel佈署")]),t._v(" "),e("h2",{attrs:{id:"可用屬性"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#可用屬性"}},[t._v("#")]),t._v(" 可用屬性")]),t._v(" "),e("ul",[e("li",[t._v("queue: laravel queue設定, 詳見下述"),e("code",[t._v("queue")]),t._v("段落")])]),t._v(" "),e("h2",{attrs:{id:"queue-optional"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#queue-optional"}},[t._v("#")]),t._v(" queue(optional)")]),t._v(" "),e("blockquote",[e("p",[t._v("Laravel佈署類型專用, 可在rsync後laravel queue worker")])]),t._v(" "),e("p",[e("strong",[t._v("可用屬性")])]),t._v(" "),e("ul",[e("li",[t._v("enabled(required): Boolean, 是否啟用Laravel Queue Worker")]),t._v(" "),e("li",[t._v("workerDir(optional): String, 設定laravel queue worker設定檔目錄名稱, 預設為queue")]),t._v(" "),e("li",[t._v("workers(optional): Array, QueueWorker設定物件陣列")]),t._v(" "),e("li",[t._v("build\n"),e("ul",[e("li",[t._v("env(optional): Object, 覆蓋.env.example的設定(透過"),e("code",[t._v("php artisan env:set")]),t._v(")")]),t._v(" "),e("li",[t._v("envFilePath(optional): Laravel .env設定檔案位置, 若使用此設定上述"),e("code",[t._v("env")]),t._v("屬性將無效")])])])]),t._v(" "),e("p",[e("strong",[t._v("QueueWorker設定物件")])]),t._v(" "),e("ul",[e("li",[t._v("name(required): Queue worker名稱, 佈署指令執行pm2 start的process名稱, 需要同worker設定檔內的name欄位")]),t._v(" "),e("li",[t._v("filename(required): Queue worker設定檔檔名(須包含yml副檔名), 例如queue.yml")]),t._v(" "),e("li",[t._v("variable(optional): Object, queue worker設定yml允許使用mustache.js的變數, 此屬性為設定檔內變數")])]),t._v(" "),e("p",[e("strong",[t._v("Worker設定檔範例(YAML)")])]),t._v(" "),e("div",{staticClass:"language-yaml extra-class"},[e("pre",{pre:!0,attrs:{class:"language-yaml"}},[e("code",[e("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("apps")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n  "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("name")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" laravel"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("queue\n    "),e("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("cwd")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" /site/backend\n    "),e("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("script")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" artisan\n    "),e("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("exec_mode")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" fork\n    "),e("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("interpreter")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" php\n    "),e("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("instances")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),t._v("\n    "),e("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("args")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n      "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" queue"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("work\n      "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("queue=default\n      "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("tries=5\n      "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("sleep=5\n")])])]),e("h2",{attrs:{id:"deploy"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#deploy"}},[t._v("#")]),t._v(" deploy")]),t._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[t._v("hyper-rocket nginx:site "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("\\")]),t._v("\n    --ssl "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("\\")]),t._v(" \n    --filename "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("domain"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v(".conf "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("\\")]),t._v("\n    --path /home/site/project/"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("project-name"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("/backend/public "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("\\")]),t._v("\n    --domain "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("domain"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("\\")]),t._v("\n    --email "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("email"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n")])])])])}),[],!1,null,null,null);a.default=n.exports}}]);