ChartNew.js
===========


Simple HTML5 Charts using the canvas element




For my personnal use, I had to integrate lot of changes into Chart.js (https://github.com/nnnick/Chart.js). 

So, I have re-worked Chart.js. Most of the changes, are associated to requests in "GitHub" issues of Chart.js.



New Charts integrated in this version compared to Graph.js

* HorizontalBar
* HorizontalStackedBar
* [Line,Bar with logarithmic y-Axis](wiki/100_110_Scale)
* [BarLine (bar chart with an integrated line chart)](wiki/070_020_Bar#barline)
	

New Items in graph compared to Graph.js :

* Title
* Subtitle
* X Axis Label
* Y Axis Label
* Unit Label
* Y Axis on the right and/or the left
* [Annotates](wiki/100_020_Annotations) (content can be configured through "templates")
* canvas Border
* [Legend](wiki/100_090_Legend)
* Footnote
* [crossText](wiki/100_040_CrossText) (you can put a text over the graph at the place of your choice)
* graphMin / graphMax
    

A quick sample can be found on http://www.favomo.be/graphjs

Another sample : http://www.favomo.be/graphjs/demo.html


I did not document how to use the new items but most of them will be easy to understand. If someone can write it, it would be great (my english is not suffisant to do that correctly) - If you want to contact me, you will find my email address in ChartNew.js

This version is down-compatible (on PC) with the version of Chart.js available on 13 January 2014.

Hope it will be usefull for some of you ! Perhaps a start for a new community developpement... Why not ?
