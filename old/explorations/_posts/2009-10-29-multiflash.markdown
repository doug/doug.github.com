---
layout: article
title: Multi-Flash Edge Detection
author: Doug
description: 'Experimenting using multi-flash techniques to do edge sensing.'
---

{{ page.description }}

### Like this:
<img class="span-24" src="/explorations/multiflash/boneFGBG.bmp" alt="edge"/>

You can read about it [here](http://vision.ai.uiuc.edu/~tankh/) on this persons awesome website.

I decided I wanted a bit of a challenge and the code was already written to do something like the above image [Multi-Flash Edge Detection](/explorations/multiflash/NPRCameraSrc.zip "FlashEdgeDetection").  So I wanted to see if I could come up with some simple way to just use light to detect edges with real time video.

Also as an additional constraint I wanted to see if I could write software to do this entire thing including the lighting so that someone with just a laptop and it's built in camera can do this at home. As such the program also draws light on the screen to use as the colored light from different angles.  The light wasn't really bright enough to do this purely with the shadows, so I had to deviate a bit from the original goal, but that is generally when the fun stuff happens anyway.
### See setup image below.
<img class="span-24" src="/explorations/multiflash/setup.jpg" alt="setup"/>

Then just use those different colored shadows to extract out the edges in the image.

### See video below.
<object class="span-24" type="application/x-shockwave-flash" width="640" height="360" data="http://www.flickr.com/apps/video/stewart.swf?v=71377" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"> <param name="flashvars" value="intl_lang=en-us&amp;photo_secret=104853cd45&amp;photo_id=4056898951&amp;flickr_show_info_box=true"></param> <param name="movie" value="http://www.flickr.com/apps/video/stewart.swf?v=71377"></param> <param name="bgcolor" value="#000000"></param> <param name="allowFullScreen" value="true"></param><embed type="application/x-shockwave-flash" src="http://www.flickr.com/apps/video/stewart.swf?v=71377" bgcolor="#000000" allowfullscreen="true" flashvars="intl_lang=en-us&amp;photo_secret=104853cd45&amp;photo_id=4056898951&amp;flickr_show_info_box=true" height="360" width="640"></embed></object>

### Code  
[multiflash.java](/explorations/multiflash/multiflash.java "MultiFlash.java")
