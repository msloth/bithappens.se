---
layout: post
title: Updating Iphone failed: "not eligible"
---

Background, was running my Iphone 4 with 4.2.1 and tethered jailbreak using redsn0w 0.9.6.4b. I wanted to update it to 4.3.3 to both get rid of the tethered boot (ie, to boot up the phone, it must be connected to my Macbook and I must go through a keypress kombo (not the Konami-code ;) ) and to get the convenience of Wifi-hotspots.

Itunes didn\'t like me though so it kept saying <strong>\"this device is not eligible for the requested build\"</strong> when it came to the \'verifiying with Apple\' stage. Tried lots of things, and I had the latest Itunes etc. This accumulation of tricks I found on various sites is what finally helped:

* sync and backup the phone first! (sync, then rightclick and choose \'backup\', maybe not necessary with both?)
* downloaded the 4.3.3 restore IPSW (google for it)
* removed the gs.apple.com entry in hosts-file (entry added automatically when jailbreaking, if Itunes finds it, it will stop with error 1013); enter
`
sudo nano /etc/hosts
` 
quit+save by ctrl+X, then Y, then enter
* switched off the phone
* plugged it in with USB
* entered DFU mode (same as when you jailbreak: power 5 sec, power+home 10sec, home 5 sec, don\'t let go of buttons between). Now the phone will show up in Itunes
* hold alt/option + command buttons when pressing the \'restore\'-button in Itunes; this will let you choose what firmware to restore from
* point to the 4.3.3 firmware you downloaded
* then Itunes will process and work and finally the phone will boot, completely empty w firmware 4.3.3
* In the dialog \'Set up your iphone\' you can choose to restore it (poor choice of words) from the backup that you took right before this procedure

After all this, I jailbroke it with the 4.3.3 untethered, reinstalled Pkgbackup a