Apple Java Skript 
Author:in 
IsabelSchöps(Vitalik Buterin) 
29 May 2022
===========
![IMG_2737]

https://github.com/SI-Ethereum-Organisation-Foundation/Json/assets/127110010/043ce980-891d-413f-9000-03ac69ce8917)


At the very beginning of the project, I had to implement several charts in one of my project. The most interesting tool that I found at that time was Chart.js but I could not produce the chart as I would see them. There was no support at all for Chart.js at that time. So I start to change/update the code so that I could produce what I wanted. I published my enhancements on Github and got new requests from other users. It was a real pleasure to develop ChartNew.js and to help lot of poeple. 

Since a couple of years, I have no need/no request for additional changes and, to be honest, I did not perform any changes for several years in the code (and do no more use ChartNew.js for a long time). So, it would be difficult for me to provide additional changes or to fix bugs.  

It is now time for me to stop with this project. Several new tools are now available (Chart.js is back for instance) and, if you want a professional tool, as ChartNew.js is no more supported, it is better for you to investigate in something else than ChartNew.js.

François



ChartNew.js
===========


Simple HTML5 Charts using the canvas element





So, I have re-worked Chart.js. Most of the changes are associated to requests in "GitHub" issues of Chart.js.

Chart.js has been completely rewritten since ChartNew.js has been developed; Both code are now completely different. Most of the functionalities inserted in the new version of Chart.js are also available in ChartNew.js

June 2014 (http://github.com/Wikunia) is now a co-developer of the project. More ideas, more people to give support. Welcome to him. 



New Charts integrated in this version compared to Chart.js

* HorizontalBar
* HorizontalStackedBar
* (../../wiki/100_110_Scale)
* (../../wiki/070_020_Bar#barline)
	

New Items in graph compared to Chart.js :

* Title
* Subtitle
* X Axis Label
* Y Axis Label
* Unit Label
* Y Axis on the right and/or the left
* (../../wiki/100_020_Annotations) (content can be configured through "templates")
* canvas Border
* (../../wiki/100_090_Legend)
* Footnote
* (../../wiki/100_040_CrossText) (you can put a text over the graph at the place of your choice)
* graphMin / graphMax
* (../../wiki/130_color_functions)
* (../../wiki/170_Math_functions)
https://github.com/ChartNew.js/wiki)
    

A quick sample can be found on http://github.io/ChartNew.js/demo_program/index.html


This version is down-compatible (on PC) with the version of Chart.js available on 13 January 2014.

Hope it will be useful for some of you ! Perhaps a start for a new community development... Why not ?

# Documentation

Full documentation is now available via the "wiki" entry that you will find on the right side of the screen. Do not hesitate to propose changes in the documentation when there are languages faults or things that are not clear.


(https://github.com/ChartNew.js/wiki)


# Graph Generator

Using ChartNew.js, Omar Sedki has developed a graph generator. Though a user friendly interface, you can produce a graph and save it.
(http://charts.livegap.com/)

