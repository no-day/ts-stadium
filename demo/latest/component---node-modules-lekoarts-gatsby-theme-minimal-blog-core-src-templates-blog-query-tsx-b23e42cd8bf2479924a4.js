(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{DH7T:function(t,a,e){"use strict";e.r(a);var s=e("ERkP"),n=e.n(s),c=e("oj0F"),o=e("pHTu"),r=e("Wbzz"),l=e("EH3t"),i=e("uJ7a"),u=e("Pkl4"),b=e("xKV+"),g=e("1VzP"),j=function(t){var a=t.posts,e=Object(u.a)(),s=e.tagsPath,n=e.basePath;return Object(c.c)(l.a,null,Object(c.c)(g.a,{title:"Blog"}),Object(c.c)(o.c,{sx:{alignItems:"center",justifyContent:"space-between",flexFlow:"wrap"}},Object(c.c)(o.d,{as:"h1",variant:"styles.h1",sx:{marginY:2}},"Blog"),Object(c.c)(o.e,{as:r.Link,sx:{variant:"links.secondary",marginY:2},to:Object(b.a)("/"+n+"/"+s)},"View all tags")),Object(c.c)(i.a,{posts:a,sx:{mt:[4,5]}}))};a.default=function(t){var a=Object.assign({},t),e=a.data.allPost;return n.a.createElement(j,Object.assign({posts:e.nodes},a))}},lp4W:function(t,a,e){"use strict";var s=e("ERkP"),n=e.n(s),c=e("pHTu"),o=e("Wbzz"),r=e("Pkl4"),l=e("xKV+");a.a=function(t){var a=t.tags,e=Object(r.a)(),s=e.tagsPath,i=e.basePath;return n.a.createElement(n.a.Fragment,null,a.map((function(t,a){return n.a.createElement(n.a.Fragment,{key:t.slug},!!a&&", ",n.a.createElement(c.e,{as:o.Link,to:Object(l.a)("/"+i+"/"+s+"/"+t.slug)},t.name))})))}},uJ7a:function(t,a,e){"use strict";var s=e("oj0F"),n=e("ERkP"),c=e.n(n),o=e("pHTu"),r=e("Wbzz"),l=e("lp4W"),i=function(t){var a=t.post,e=t.showTags,n=void 0===e||e;return Object(s.c)(o.a,{mb:4},Object(s.c)(o.e,{as:r.Link,to:a.slug,sx:{fontSize:[1,2,3],color:"text"}},a.title),Object(s.c)("p",{sx:{color:"secondary",mt:1,a:{color:"secondary"},fontSize:[1,1,2]}},Object(s.c)("time",null,a.date),a.tags&&n&&Object(s.c)(c.a.Fragment,null," — ",Object(s.c)(l.a,{tags:a.tags}))))};a.a=function(t){var a=t.posts,e=t.className,n=void 0===e?"":e,c=t.showTags,o=void 0===c||c;return Object(s.c)("section",{sx:{mb:[5,6,7]},className:n},a.map((function(t){return Object(s.c)(i,{key:t.slug,post:t,showTags:o})})))}}}]);
//# sourceMappingURL=component---node-modules-lekoarts-gatsby-theme-minimal-blog-core-src-templates-blog-query-tsx-b23e42cd8bf2479924a4.js.map