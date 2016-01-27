---
layout: post
title: Error uploading to JCreate
---

I had this error a while ago in a new virtual machine, where I was trying to compile and upload to a <a title=\"sentilla\" href=\"http://www.sentilla.com/perk_faq.html\">Sentilla JCreate</a>, an obsolete sensor node similar to the Tmote Sky but without some of the sensors and added an accelerometer. This was the error:
```$make myfile.upload
...text
something like: only pure serial drivers exist ... -bsl=revb```
Now, trying with the same this as super user worked,
```$ sudo make myfile.upload
...text
something like: -bsl=mini```
So, a permissions error then. This was solved by adding a rules file for USB:
```$ sudo gedit /etc/udev/rules.d/5-usb.rules &amp;
#Add the following line:
SUBSYSTEM==\"usb\", ENV{DEVTYPE}==\"usb_device\", GROUP=\"dialout\", MODE=\"0664\"```
then reload rules by:
```$ sudo udevadm control --reload-rules```
&nbsp;

Cred to Niklas W that came up with this solution...



```
static uint16_t bitrev(uint16_t j, uint16_t nu)
{
  uint16_t k;
  k = 0;
  for (; nu &gt; 0; nu--) {
    k  = (k &lt;&lt; 1) + (j &amp; 1);
    j = j &gt;&gt; 1;
  }
  return k;
}
```

[sourcecode language=\"c\" light=\"true\"]
static uint16_t bitrev(uint16_t j, uint16_t nu)
{
  uint16_t k;
  k = 0;
  for (; nu &gt; 0; nu--) {
    k  = (k &lt;&lt; 1) + (j &amp; 1);
    j = j &gt;&gt; 1;
  }
  return k;
}
[/sourcecode]


[sourcecode language=\"c\" light=\"false\"]
static uint16_t bitrev(uint16_t j, uint16_t nu)
{
  uint16_t k;
  k = 0;
  for (; nu &gt; 0; nu--) {
    k  = (k &lt;&lt; 1) + (j &amp; 1);
    j = j &gt;&gt; 1;
  }
  return k;
}
[/sourcecode]