---
layout: post
title: Changing Iphone sms signals
---

After jailbreaking, you can ssh to the phone and change stuff you couldn\'t before, like the sms-signals. There are a preset number of signals (4.3.3 there are six) and you have to replace them with your own. First it must be converted to AIFF and renamed to .caf.

Prep the phone:
	* Jailbreak the phone

	* Install OpenSSH from Cydia



Prep the mac and sms signal:
	* Download and install Cyberduck on a mac (simple sftp gui prog)


	* Find the signal that you want


	* In Itunes, go into preferences -- advanced -- importing -- \"Import using\", set to AIFF


	* Import into Itunes, then rightclick the tone in the songlist and choose \"show in finder\"


	* Rename it into the one you want to replace (I dislike #4 and #6), eg *sms-received4.caf*



Install the sms signal:
	* make sure SSH is enabled on the phone


	* find the Wifi IP address; Settings -- Wifi -- press the arrow on your net


	* In cyberduck, ssh into your IP, port 22 using root and your root password (if you haven\'t changed it, it is \"alpine\").


	* Navigate into /System/Library/Audio/UISounds


	* Download all sms-receivedX.caf as a backup


Upload your file to overwrite it on the Iphone
End connection, restart Settings on the Iphone and choose the signal you just overwrote. Et voila.