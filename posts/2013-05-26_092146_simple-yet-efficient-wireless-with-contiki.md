---
layout: post
title: Simple yet efficient wireless with Contiki
---

This is a step forward in making wireless communication more easy and viable for small systems. There already exist a number of protocols for low-power wireless. Most of them though are quite complex and hence use much RAM and ROM which makes them unfeasible for the Launchpad and similar constrained systems. This is a simple yet efficient radio duty-cycling protocol for Contiki that achieves 3% idle listening duty cycle while allowing for on average 65 ms latency with no prior contact or synchronization.

SimpleRDC, as it\'s called, builds on protocols such as ContikiMAC and X-MAC but makes away with lot\'s of the complexity.