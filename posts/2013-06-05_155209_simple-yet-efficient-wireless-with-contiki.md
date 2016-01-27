---
layout: post
title: Simple yet efficient wireless with Contiki
---











<h2>SimpleRDC</h2>

This is a step forward in making wireless communication more easy and viable for extremely small systems. There already exist a number of protocols for low-power wireless. Most of them are quite complex and hence use much RAM and ROM which makes them unfeasible for the Launchpad and similarly constrained systems. This is a simple yet efficient radio duty-cycling protocol for Contiki that achieves 3% idle listening duty cycle while allowing for an average 65 ms latency with no prior contact or synchronization.

<img src=\"simplerdcpics/cooja/0-SimpleRDC-Cooja-two-nodes-w-unicast-reject-and-ACK.png\" />
Three nodes running SimpleRDC in the Cooja simulator, one of them periodically transmits. Grey means radio is on, blue means that it is transmitting and green that it is receiving (red, not in the picture, means interference, ie it senses something but cannot make out what it is). In the \"Radio messages\" dialog box you see the actual bytes sent over the air. Here, just a simple hex 0102030405 and some frame headers. The ACK of 5 bytes contains the address, a serial number and two bytes CRC footer added by the radio driver. The node serial output is seen in the \"Mote output\" box.

<!--more-->

Why do we need to do this? Well, it\'s an application-specific question and at least for battery-operated (or similarly, energy scavenging) systems, it\'s expensive, cumbersome, and in some cases infeasible to change batteries in situ. Or rather, it all comes down to $$$. The microcontroller in this case, which is a really low-power microcontroller, is not the most energy consuming component in the system. The radio is.

The msp430 uses about a milli-ampere in operation, ie about 1-3 mW. A typical 802.15.4 ISM radio on the other hand needs ca 45-60 mW when transmitting and 60 mW when receiving. This is true for both sub-GHz and 2.4 GHz radios. You might ask why it\'s more expensive to receive (or listen)? To receive, the radio must have a crystal oscillator running, radio signal amplifiers and filters and logic running in order to find any signal in the medium. This takes a lot of power in comparison. So, we try to keep the radio off as much as possible.

SimpleRDC, as it\'s called, builds on protocols such as ContikiMAC and X-MAC but makes away with lots of the complexity. It\'s also quite similar to the Thingsquare Drowsie RDC protocol and part of the subset of RDCs we call LPL, or low-power listening, in contrast to eg LPP, or low-power probing.

We periodically wake up and listen for a while before going to sleep to save energy. To transmit to a neighbor, we repeatedly transmit the frame for an entire sleep period and a little more. This way, we should be able to hit the wake-up of the neighbor. In ContikiMAC, we learn when the neighbors wake-up and can time any outgoing messages to the wake-up, thus saving time, energy, and bandwidth. SimpleRDC has not support for this out of the box due to the RAM constraints. Neighbor tables take a lot of space.

If we want to transmit a broadcast, ie to any neighbor that may hear the message, we transmit for a sleep period plus some guard time, and turn off the radio between each transmission. With unicasts, ie one specified destination, we can optimize this a bit. If the receiver tells us when it has received the message, we can end the transmission train early. Thus, we keep the radio on and listen for this short acknowledgment (ACK). We can tune this to send and recieve ACKs quickly, thus reducing time between transmissions, and as a byproduct of this reduce the on-time in each wake-up.

Compare a broadcast with a unicast:

<img src=\"simplerdcpics/cooja/1-SimpleRDC-Cooja-broadcast.png\" />
Being a broadcast, the sender do not need an ACK and turns off the radio in between transmissions. Note that all the blue bars are transmissions, the same packet being transmitted over and over again.

<img src=\"simplerdcpics/cooja/2-SimpleRDC-Cooja-unicast-zoom-in,ACK-on-rcv.png\" />
The unicast on the other hand keeps the radio and hopes for an ACK. When it receives it, it can terminate the transmission train. A bystander that receives it just drops it and goes back to sleep.

<img src=\"simplerdcpics/cooja/4-SimpleRDC-Cooja-lucky-unicast.png\" />
If the sender is lucky, it starts transmitting at just the right time and can finish very early, here after just one transmission.

Simulating the RDC is very convenient when developing as you can just do a reload and replay the same scenario over and over again. It\'s also fast, this was running at 10-20 times realtime. However, to validate this working in real life too, I looked at the SPI communication between the microcontroller and the radio transceiver. This was done with a Saleae Logic 16 logic analyzer, probing the pin header on one of the Launchpads when running a simple application. On the top four channels we see the SPI: MISO, MOSI, CLK and CS. Then, we see the GDO0 pin from the radio, configured as staying high while receiving or sending, and low otherwise (ie off or simply listening). Channel 5 is an LED toggling when we have sent something.

<img src=\"simplerdcpics/logic/1-SimpleRDC-periodic-tx,channel-samples,toggling-LED.png\" />
We here see the SPI communication of a device doing channel sampling every 125 ms (the narrow bars) and one a second transmit a message (the wide bars). Each bar is actually many SPI transactions for the microcontroller loading the radio with a packet, issuing commands, polling it for status etc.

<img src=\"simplerdcpics/logic/2-SimpleRDC-sending-a-broadcast-with-CSMA,channel-sample-before-and-after.png\" />
Here we zoom in on one broadcast. We see that the radio first performs a CSMA-CA (Carrier Sense Multiple Access, Collision Avoidance) to make sure that it is free to start sending. If we receive anything during this CSMA, we drop the packet. Then, we perform a number of transmissions, turning off the radio in between. At the end, the radio channel sampling is due so we do that too.

<img src=\"simplerdcpics/logic/3-SimpleRDC-sending-an-unicast.png\" />
In contrast, unicast transmissions wants an ACK so the radio is kept on and constantly being polled. The tranmission in the picture was not ACKed so we quit after a while.

<img src=\"simplerdcpics/logic/4-SimpleRDC-BWU-channel-sample,4ms,and-a-unicast-rx+ACK.png\" />
On the receiver end, we see dramatically less SPI transactions. This is a few channel samples, and during the first we received a packet that is destined for us so we send an ACK and go back to sleep. The sender would (hopefully) receive this ACK and can then turn off.

<img src=\"simplerdcpics/logic/5-SimpleRDC-one-polling-channel-sample.png\" />
This is a 4 millisecond channel sample. First issue the command to turn the radio on, wait for it to start listening after the crystal has stabilized and then poll the radio to see if we get anything. If we do, we turn the radio off. Here, we got nothing.

<img src=\"simplerdcpics/logic/6-SimpleRDC-zoom-in-on-a-transmission-go-idle,load-fifo,tx.png\" />
A single transmission: load the transmission FIFO buffer in the radio, then issue the \"transmit\" command, wait for the transmission to end. The bump on channel 4 is the GPIO on the radio being high during the transmission, so we can see and measure exactly how long time this takes (0.64 ms). What we see here is basically corresponding to one of the blue bars in the Cooja simulation screenshots earlier.

So far, we have simulated it so we had a pretty good understanding of how it works, checked the SPI so we know the proper commands are being issued, the timings line up with what we expect from Cooja etc. But, even now we would like to have more proof that it works as intended. There may still be bugs that end up consuming lots of power without it showing up on either Cooja or the Logic. Time to use an oscilloscope and measure the power consumption. I used a Picoscope 3206B dual-channel, 


<img src=\"simplerdcpics/oscilloscope/1-some-channel-sample-period-mcu-wake-up-very-visible.png\" />

<img src=\"simplerdcpics/oscilloscope/2-channel-sample-period,mcu-wake-up-clearly-visible.png\" />

<img src=\"simplerdcpics/oscilloscope/3.5-channel-sample-closeup-18.5-mA-for-4.5-ms.png\" />

<img src=\"simplerdcpics/oscilloscope/3-mcu-at-128-Hz-(CLOCK_SECOND)-wake-up.png\" />

<img src=\"simplerdcpics/oscilloscope/4-unicast-transmission-and-some-channel-samples.png\" />

<img src=\"simplerdcpics/oscilloscope/5-unicast-transmission-with-CSMA.png\" />

<img src=\"simplerdcpics/oscilloscope/6-broadcast-transmission.png\" />

<img src=\"simplerdcpics/oscilloscope/7-broadcast-with-channel-sample,CSMA-and-then-start-of-transmission.png\" />

<img src=\"simplerdcpics/oscilloscope/8-CSMA-and-start-of-unicast.png\" />

<img src=\"simplerdcpics/oscilloscope/9-unicast,part-of-train-tx,then-listen-2-ms-listen-more-expensive-than-transmit.png\" />

<img src=\"simplerdcpics/oscilloscope/10-tx-with-LED-toggle-to-off-ca-3,7-mA-difference-on-off.png\" />


