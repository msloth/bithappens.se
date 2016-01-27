---
layout: post
title: Error uploading to JCreate
---

I had this error a while ago in a new virtual machine, where I was trying to compile and upload to a <a title=\"sentilla\" href=\"http://www.sentilla.com/perk_faq.html\">Sentilla JCreate</a>, an obsolete sensor node similar to the Tmote Sky but without some of the sensors and added an accelerometer. This was the error:
<pre><small>$make myfile.upload
...text
something like: only pure serial drivers exist ... -bsl=revb</small></pre>
Now, trying with the same this as super user worked,
<pre><small>$ sudo make myfile.upload
...text
something like: -bsl=mini</small></pre>
So, a permissions error then. This was solved by adding a rules file for USB:
<pre><small>$ sudo gedit /etc/udev/rules.d/5-usb.rules &amp;
#Add the following line:
SUBSYSTEM==\"usb\", ENV{DEVTYPE}==\"usb_device\", GROUP=\"dialout\", MODE=\"0664\"</small></pre>
then reload rules by:
<pre><small>$ sudo udevadm control --reload-rules</small></pre>
&nbsp;

Cred to Niklas W that came up with this solution...

[bash]
$ sudo make myfile.upload
[/bash]
