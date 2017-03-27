ChartNew.js
===========


Simple HTML5 Charts using the canvas element




For my personal use, I had to integrate lot of changes into Chart.js (https://github.com/nnnick/Chart.js). 

So, I have re-worked Chart.js. Most of the changes are associated to requests in "GitHub" issues of Chart.js.

Chart.js has been completely rewritten since ChartNew.js has been developed; Both code are now completely different. Most of the functionalities inserted in the new version of Chart.js are also available in ChartNew.js

June 2014 - [Ole Kröger](http://github.com/Wikunia) is now a co-developer of the project. More ideas, more people to give support. Welcome to him. 



New Charts integrated in this version compared to Chart.js

* HorizontalBar
* HorizontalStackedBar
* [Line,Bar with logarithmic y-Axis](../../wiki/100_110_Scale)
* [BarLine (bar chart with an integrated line chart)](../../wiki/070_020_Bar#barline)
	

New Items in graph compared to Chart.js :

* Title
* Subtitle
* X Axis Label
* Y Axis Label
* Unit Label
* Y Axis on the right and/or the left
* [Annotates](../../wiki/100_020_Annotations) (content can be configured through "templates")
* canvas Border
* [Legend](../../wiki/100_090_Legend)
* Footnote
* [crossText](../../wiki/100_040_CrossText) (you can put a text over the graph at the place of your choice)
* graphMin / graphMax
* [colorFunctions](../../wiki/130_color_functions)
* [mathFunctions](../../wiki/170_Math_functions)
* [etc](https://github.com/FVANCOP/ChartNew.js/wiki)
    

A quick sample can be found on http://fvancop.github.io/ChartNew.js/demo_program/index.html


This version is down-compatible (on PC) with the version of Chart.js available on 13 January 2014.

Hope it will be useful for some of you ! Perhaps a start for a new community development... Why not ?

# Documentation

Full documentation is now available via the "wiki" entry that you will find on the right side of the screen. Do not hesitate to propose changes in the documentation when there are languages faults or things that are not clear.


[Link to the wiki documentation](https://github.com/FVANCOP/ChartNew.js/wiki)


# Graph Generator

Using ChartNew.js, Omar Sedki has developed a graph generator. Though a user friendly interface, you can produce a graph and save it.


[http://charts.livegap.com/](http://charts.livegap.com/)

