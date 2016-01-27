---
layout: post
title: TI Launchpad makefile
---

[caption id=\"\" align=\"alignleft\" width=\"300\" caption=\"TI Launchpad\"]<a href=\"http://processors.wiki.ti.com/index.php/MSP430_LaunchPad_%28MSP-EXP430G2%29?DCMP=launchpad&amp;HQS=Other+OT+launchpadwiki\"><img title=\"TI Launchpad\" src=\"http://processors.wiki.ti.com/images/thumb/a/ad/LaunchPad_wireframe.PNG/300px-LaunchPad_wireframe.PNG\" alt=\"TI Launchpad\" width=\"300\" height=\"351\" /></a>[/caption]

The <a title=\"Launchpad\" href=\"http://processors.wiki.ti.com/index.php/MSP430_LaunchPad_%28MSP-EXP430G2%29?DCMP=launchpad&amp;HQS=Other+OT+launchpadwiki\">TI Launchpad</a> is a small fun developers platform, perhaps most suited for beginners to microcontrollers. It retails for $4.30, comes with two simple MSP430 microcontrollers, a small PCB with two LEDs, pushbuttons, pin headers etc. It can be programmed via USB, either by the TI provided software, or, as I do, with msp-gcc and <a title=\"mspdebug\" href=\"http://mspdebug.sourceforge.net/\">mspdebug</a> in Linux. As I also program sensor nodes with <a title=\"Contiki\" href=\"http://www.sics.se/contiki\">Contiki</a>, I wanted the syntax to be similar, eg \"make upload\". I wrote a small makefile so that the following syntax can be used:

compile and link the files
[bash]make[/bash]

compile and upload to Launchpad
[bash]make upload[/bash]

remove all temporary {object-, elf-, etc} files
[bash]make clean[/bash]

erase the MSP430 in Launchpad
[bash]make erase[/bash]

get size of the elf file
[bash]make size[/bash]

And here\'s the makefile itself. To adapt it to your project, just change the names stated under \'objects\' to your files, with an .o extension. In my file below, basic.c is the \'main\'file and vfd_driver.c is... a driver for a VFD display.

[c ruler=\"true\"]OBJECTS = basic.o vfd_driver.o

CC = msp430-gcc
CFLAGS =-Os -Wall -g -mmcu=msp430x2012

all : $(OBJECTS)
	$(CC) $(CFLAGS) $(OBJECTS) -o upload.elf

%.o : %.c
	$(CC) $(CFLAGS) -c $&amp;lt;

clean:
	rm -fr $(OBJECTS) upload.elf

erase:
	mspdebug rf2500 &quot;erase&quot;

upload:
	make
	mspdebug rf2500 &quot;prog upload.elf&quot;

size:
	msp430-size upload.elf[/c]