---
layout: post
title: Contiki debugging in Cooja
---

A while ago I co-held a Contiki bootcamp at work. My part consisted mainly of showing the network simulator Cooja, the Mobility and some debugging features. This post will go through those topics in the same order. This will be a long post... :)

To get started, you might want and/or need the following:
<a href=\"http://www.bithappens.se/random/contiki-debugging/ContikiBootcamp-Handout.pdf\">the talk in handout-format</a>, a <a href=\"http://www.bithappens.se/random/contiki-debugging/ContikiBootcamp-Slides.pdf\">few slides</a>, and the source code: <a href=\"http://www.bithappens.se/random/contiki-debugging/Makefile\">Makefile</a>, <a href=\"http://www.bithappens.se/random/contiki-debugging/silent.c\">a silent node</a> and a <a href=\"http://www.bithappens.se/random/contiki-debugging/broadcaster.c\">periodic broadcasting node</a>, and finally a working <a href=\"http://www.contiki-os.org\">Contiki copy</a> (check out the Instant Contiki virtual machine with all tools set up from the beginning).

In short this is what I\'ll discuss:



	*Serial Shell

	*MSPSim

	*Cooja

	*the Mobility plugin




All set? Let\'s get going!
<!--more-->

## Contiki Serial Shell

The Contiki Serial Shell is a UNIX-­style shell that allows for text‐based interaction, including features such as piping data, run in background etc. Having shell running on a mote allows for simple interaction and testing. The drawback is that it uses precious ROM/RAM space; hence it is not used in Contiki per default but must be added in the following way.
In your `project sourcefile`

[c ruler=\"true\"]  #include &quot;shell.h&quot;
  #include &quot;serial-shell.h&quot;
  ...
  serial_shell_init();
  shell_sky_init();
  shell_text_init();
  shell_file_init();
  shell_time_init();
  shell_ps_init();
  shell_coffee_init(); ```

In your `Makefile`

[c ruler=\"true\"]APPS=serial-shell```

Note: If you get an error like `no rule for make all` when compiling, try moving that line up or down in the Makefile.

Each `shell_X_init()` adds a set of features to shell, hence if you run out of space on the mote try removing these. They (above are examples, there are more) are located in `contiki-2.x/apps/shell/` in files like `shell-file.c`. For what features they come with, check the source file.
Basic shell commands and usage, using shell_coffee (the Coffee file system), shell-time and shell-sky as examples:

• List available commands
`?`
• List running processes
`ps`
• Read sensors and convert to human readable format
`sense | senseconv`
• Same, write to file
`sense | senseconv | write logfile.txt`
• Periodically (every 2 seconds), forever (0), read sensors and append to `logfile.txt`, in background.`
repeat 0 2 {Sense | senseconv | append logfile.txt} &amp;`

This is how you create your own shell commands: first you need a process that is the actual command, then declare a SHELL_COMMAND and finally register that command with the serial shell.

[c ruler=\"true\"]PROCESS(utoggle_process, &quot;Toggle lines&quot;);
SHELL_COMMAND(utog_command, &quot;ut&quot;, &quot;ut: toggle lines&quot;, &amp;utoggle_process);
/* --------------------------------- */
PROCESS_THREAD(utoggle_process, ev, data) {
PROCESS_BEGIN();
  // ...
PROCESS_END();
}
...

shell_register_command(&amp;utog_command);```


## MSPSim

MSPSim is a sensor board and MSP430 instruction simulator written in Java. Main author is Joakim Eriksson at SICS. It is cycle accurate and can simulate the Tmote Sky sensor mote (including MSP430 mcu, LEDs, CC2420 radio transceiver, M25P80 flash etc) and has recently gotten support for the MSP430x mcu that has 20-­bit address space. MSPSim can run with GUI or CLI. Start the GUI by compiling with following syntax

`make my-project-file.mspsim TARGET=sky`

There, the buttons can be pressed (on the picture) and LEDs will reflect on their corresponding state. The mcu can be monitored and controlled from the control box and CLI. Another available platform is ESB, use `TARGET=esb` instead.



## COOJA

COOJA is a network simulator that can create motes either from pre-­‐compiled code (allows TinyOS-­motes) or from source code (will be compiled for eg Sky motes or directly as x86-­‐motes). COOJA is very extendable and provides many ways for doing so. Anyone can extend it and use their own radio propagation model, simulated mote (just as it per default uses MSPSim for Sky motes), add visualizers, plugins etc.

Start COOJA GUI by navigating to the following folder and running
`cd contiki-2.x/tools/cooja/
ant run`

If you are running a large simulation you can instead run
`ant run_bigmem`

Create a new simulation in menu `File/New Simulation`.
Choose a radio propagation model (UDGM being probably the most simplistic as it only depends on distance and transmission power), random startup time (if you have several nodes they will start within this interval) and a seed for the random number generator.