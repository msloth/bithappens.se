---
layout: post
title: Changing Iphone sms signals
---

After jailbreaking, you can ssh to the phone and change stuff you couldn\'t before, like the sms-signals. There are a preset number of signals (4.3.3 there are six) and you have to replace them with your own. First it must be converted to AIFF and renamed to .caf.

Prep the phone:
	<li>Jailbreak the phone</li>
	<li>Install OpenSSH from Cydia</li>


Prep the mac and sms signal:
	<li>Download and install Cyberduck on a mac (simple sftp gui prog)</li>

	<li>Find the signal that you want</li>

	<li>In Itunes, go into preferences -- advanced -- importing -- \"Import using\", set to AIFF</li>

	<li>Import into Itunes, then rightclick the tone in the songlist and choose \"show in finder\"</li>

	<li>Rename it into the one you want to replace (I dislike #4 and #6), eg <strong>sms-received4.caf</strong></li>


Install the sms signal:
	<li>make sure SSH is enabled on the phone</li>

	<li>find the Wifi IP address; Settings -- Wifi -- press the arrow on your net</li>

	<li>In cyberduck, ssh into your IP, port 22 using root and your root password (if you haven\'t changed it, it is \"alpine\").</li>

	<li>Navigate into /System/Library/Audio/UISounds</li>

	<li>Download all sms-receivedX.caf as a backup</li>

Upload your file to overwrite it on the Iphone
End connection, restart Settings on the Iphone and choose the signal you just overwrote. Et voila.