---
layout: post
title: Contiki for TI MSP430 Launchpad
---

Contiki has for a long time had ports for several MSP430-based platforms, but they were a bit expensive for the hobbyist (eg Sky or Z1). The TI Launchpad is based on a msp430g2452 and \'2553 which have 256/512 bytes of RAM and 16 kB ROM costs 10$, so it\'s too small for Contiki, and there is no simple API for stuff like ADC or PWM. Now I have ported Contiki to the Launchpad, with plenty of space for applications.