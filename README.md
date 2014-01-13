ChartNew.js
===========


Simple HTML5 Charts using the canvas element




For my personnal use, I had to integrate lot of changes into Chart.js (https://github.com/nnick/Chart.js. 

So, I have re-worked Chart.js. Most of the changes, are associated to requests in "GitHub" issues of Chart.js.



This first version probably contains lot of bugs (for instance, it doesn't work on android/IPhone), but I think that it can be used without big troubles on a PC.

New Charts integrated in this version compared to Graph.js

    HorizontalBar
    HorizontalStackedBar

New Items in graph compared to Graph.js :

    Title
    Subtitle
    X Axis Label
    Y Axis Label
    Unit Label
    Y Axis on the right and/or the left
    Annotates (content can be configured through "templates")
    canvas Border
    Legend
    Footnote
    crossText (you can put a text over the graph at the place of your choice)
    graphMin / graphMax

A quick sample can be found on http://www.favomo.be/graphjs

Another sample : http://www.favomo.be/graphjs/demo.html


I did not document how to use the new items but most of them will be easy to understand. If someone can write it, it would be great (my english is not suffisant to do that correctly) - If you want to contact me, you will find my email address in ChartNew.js

This version is down-compatible (on PC) with the version of Chart.js available on 13 January 2014.

Hope it will be usefull for some of you ! Perhaps a start for a new community developpement... Why not ?
