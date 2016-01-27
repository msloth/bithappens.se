---
layout: post
title: Simple yet efficient wireless with Contiki
---


## SimpleRDC


This is a step forward in making wireless communication more easy and viable for small systems. There already exist a number of protocols for low-power wireless. Most of them are quite complex and hence use much RAM and ROM which makes them unfeasible for the Launchpad and similarly constrained systems. This is a simple yet efficient radio duty-cycling protocol for Contiki that achieves 3% idle listening duty cycle while allowing for an average 65 ms latency with no prior contact or synchronization.

<!--more-->

Why do we need to do this? Well, it\'s an application-specific question and at least for battery-operated (or similarly, energy scavenging) systems, it\'s expensive, cumbersome, and in some cases infeasible to change batteries in situ. Or rather, it all comes down to $$$. The microcontroller in this case, which is a really low-power microcontroller, is not the most energy consuming component in the system. The radio is.

The msp430 uses about a milli-ampere in operation, ie about 1-3 mW. A typical 802.15.4 ISM radio on the other hand needs ca 45-60 mW when transmitting and 60 mW when receiving. This is true for both sub-GHz and 2.4 GHz radios. You might ask why it\'s more expensive to receive (or listen)? To receive, the radio must have a crystal oscillator running, radio signal amplifiers and filters and logic running in order to find any signal in the medium. This takes a lot of power in comparison. So, we try to keep the radio off as much as possible.

SimpleRDC, as it\'s called, builds on protocols such as ContikiMAC and X-MAC but makes away with lot\'s of the complexity. It\'s also quite similar to the Thingsquare Drowsie RDC protocol and part of the subset of RDCs we call LPL, or low-power listening, in contrast to eg LPP, or low-power probing.

We periodically wake up and listen for a while before going to sleep to save energy. To transmit to a neighbor, we repeatedly transmit the frame for an entire sleep period and a little more. This way, we should be able to hit the wake-up of the neighbor. In ContikiMAC, we learn when the neighbors wake-up and can time any outgoing messages to the wake-up, thus saving time, energy, and bandwidth. SimpleRDC has not support for this out of the box due to the RAM constraints. Neighbor tables take a lot of space.

If we want to transmit a broadcast, ie to any neighbor that may hear the message, we transmit for a sleep period plus some guard time, and turn off the radio between each transmission. With unicasts, ie one specified destination, we can optimize this a bit. If the receiver tells us when it has received the message, we can end the transmission train early. Thus, we keep the radio on and listen for this short acknowledgment (ACK). We can tune this to send and recieve ACKs quickly, thus reducing time between transmissions, and as a byproduct of this reduce the on-time in each wake-up.
