---
layout: post
title: Contiki for TI MSP430 Launchpad
---

<h1>Contiki port for Launchpad</h1>

<a href=\"http://www.bithappens.se/resources/pictures/blog/LP+cc2500+picoscope.jpg\"><img src=\"http://www.bithappens.se/resources/pictures/blog/LP+cc2500+picoscope.jpg\" /></a>

Contiki has for a long time had ports for several MSP430-based platforms, but the platforms were a bit expensive for the hobbyist (eg Sky or Z1 at ca 70-90$ each). The TI Launchpad is based on a msp430g2452 and \'2553, which have 256/512 bytes of RAM and 16 kB ROM, and costs 10$. Thus it\'s a bit too small for Contiki, and there is no simple API for stuff like ADC or PWM. Now I have ported Contiki to the Launchpad, with plenty of space for applications. I had to make a few sacrifices though, mostly due to the very limited amount of RAM, and some things (like serial output over UART) is only available when you use a \'g2553 mcu.

Using this port, the \'Blink\' example (blinking an LED periodically, no serial output) is just 3.3 kB ROM and 194 bytes RAM (data + bss). The serial output example is a little bit bigger: 6.4 kB ROM, 222 bytes RAM. If adding a CC2500 radio, we must then remove the UART as we get 9.3 kB ROM and 440 bytes RAM. Due to the layered nature of the network stack, we need quite some RAM so while still having 512 - 440 = 72 bytes RAM left, much of this is needed for the call stack (saving return address, registers etc on each function call). Thus, using lots of large automatic variables in the radio callbacks would likely crash the device.


<!--more-->
To make this port, I started out by copying the Sky port. Sky uses a msp430f1611 MCU with 16 kB RAM and 48 kB ROM. I then minimized it until it was small enough to fit on a g\'2553, mostly by reducing buffers and removing features. The features I have removed are for example queue-buf (queues up packets for transmission), energest (energy estimation), and regrettably uIP. Energest would have been nifty, it is a software based, low overhead, mechanism for estimating the amount of time the MCU spends in various modes, such as in interrupts, radio listening for traffic, or having a LED on. Removing uIP was unfortunate but basically unavoidable.

<h2>Radio driver</h2>
I had already some cheap (2$ each) radio modules I bought on Aliexpress, with the TI CC2500 radio. They are small and cheap, and I already had experience in working with this family of radios (very similar to CC2420 etc). The radio driver is more or less written from scratch to be low complexity and kind on resources, especially RAM. Next step was a radio duty-cycling layer. There was already some existing RDCs, such as ContikiMAC but they take too much space, are complex and thus overkill. So, I wrote the SimpleRDC RDC based on ContikiMAC but it is also similar to the Thingsquare Drowsie RDC. Removing uIP was not with an easy heart but we can use the Rime stack with all the primitives in it, such as broadcast, unicast, trickle etc.

<h2>Radio duty-cycling</h2>
With SimpleRDC, which I will elaborate further on in another blog post, I get around 3% radio duty-cycle with a 65 ms latency. This equates to an average power consumption for the radio and being able to communicate of a measly 2 mW (as compared with ca 60 mW for and always-on RDC). When developing SimpleRDC I had good use of Cooja, the network simulator, simulating the RDC on Sky-devices. The radio driver and the RDC are very easy to port to your own custom board, just define what pins are what.

After having this basic support and features, I wanted more features. So I wrote drivers for stuff like ADC, PWM, some display drivers, a button driver, serial output over UART, servo motor drivers, etc etc. Switching between including serial output (printf\'s) and not including it is easy, just set a define to 0 or 1 in a configuration file.

To make it simpler for a Contiki-noob to start using it, I wrote a bunch of examples and plenty of comments in the source code.

<h2>How to start using it</h2>

You need a few things to start using this port. In parenthesis is what I have been using, but you might be fine off something else.

<ul>
<li>The port itself (download from Github)</li>
<li>Drivers for TI Launchpad (get from TI)</li>
<li>a compiler (mspgcc)</li>
<li>a tool to upload the compiled binary with (mspdebug)</li>
</ul>

The most simple way may be to download the Instant Contiki Ubuntu virtual machine (VM) with mspgcc, java, and lots of drivers etc pre-installed. Then run the VM in eg VirtualBox or VMWare Player. You will need to download this port though, and probably install drivers for TI Launchpad to Linux.

I use Instant Contiki for several reasons, one being that I then have a common environment no matter what computer I\'m at for the moment.

To download the source files, clone (or download a zip) the port on <a href=\"https://github.com/msloth/contiki-launchpad\">Github</a> or do a 
[bash]
  git clone git://github.com/msloth/contiki-launchpad.git
[/bash]

Then, check your setup by going to the <code>contiki/examples/launchpad/blink/</code> folder and enter the following command
[bash]
  make blink.upload
[/bash]
This will compile the Blink-example and upload it to the device. You need to have the compiler (mspgcc) and the programming tool (mspdebug) in the path.

If you get error-messages, check your path with
[bash]
  which msp430-gcc
  msp430-gcc --version
  which mspdebug
[/bash]

Another nice example to try out is the serial output and input located in <code>contiki/examples/launchpad/readserial-printf/</code>. Upload it with
[bash]
  make serialtests.upload
[/bash]
then log in to the serial connection with
[bash]
  make login
[/bash]

For the rest of the examples, check the folders in the <code>contiki/examples/launchpad/</code> folder. If you are new to Contiki programming, the examples are a great start to get to know how to use processes, timers, events, etc.
