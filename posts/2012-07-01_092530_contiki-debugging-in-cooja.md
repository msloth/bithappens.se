---
layout: post
title: Contiki debugging in Cooja
---

A while ago I co-held a Contiki bootcamp at work. My part consisted mainly of showing the network simulator Cooja, the Mobility and some debugging features. This post will go through those topics in the same order. This will be a long post... :)

To get started, you might want and/or need the following:
<a href=\"http://www.bithappens.se/random/contiki-debugging/ContikiBootcamp-Handout.pdf\">the talk in handout-format</a>, a <a href=\"http://www.bithappens.se/random/contiki-debugging/ContikiBootcamp-Slides.pdf\">few slides</a>, and the source code: <a href=\"http://www.bithappens.se/random/contiki-debugging/Makefile\">Makefile</a>, <a href=\"http://www.bithappens.se/random/contiki-debugging/silent.c\">a silent node</a> and a <a href=\"http://www.bithappens.se/random/contiki-debugging/broadcaster.c\">periodic broadcasting node</a>, and finally a working <a href=\"http://www.contiki-os.org\">Contiki copy</a> (check out the Instant Contiki virtual machine with all tools set up from the beginning).

In short this is what I\'ll discuss:
<ul>
	<li>Serial Shell</li>
	<li>MSPSim</li>
	<li>Cooja</li>
	<li>the Mobility plugin</li>
</ul>
All set? Let\'s get going!
<!--more-->
<h2>Contiki Serial Shell</h2>
The Contiki Serial Shell is a UNIX-­style shell that allows for text‐based interaction, including features such as piping data, run in background etc. Having shell running on a mote allows for simple interaction and testing. The drawback is that it uses precious ROM/RAM space; hence it is not used in Contiki per default but must be added in the following way.
In your <code>project sourcefile</code>

[c ruler=\"true\"]  #include &quot;shell.h&quot;
  #include &quot;serial-shell.h&quot;
  ...
  serial_shell_init();
  shell_sky_init();
  shell_text_init();
  shell_file_init();
  shell_time_init();
  shell_ps_init();
  shell_coffee_init(); [/c]

In your <code>Makefile</code>

[c ruler=\"true\"]APPS=serial-shell[/c]

Note: If you get an error like <code>no rule for make all</code> when compiling, try moving that line up or down in the Makefile.

Each <code>shell_X_init()</code> adds a set of features to shell, hence if you run out of space on the mote try removing these. They (above are examples, there are more) are located in <code>contiki-2.x/apps/shell/</code> in files like <code>shell-file.c</code>. For what features they come with, check the source file.
Basic shell commands and usage, using shell_coffee (the Coffee file system), shell-time and shell-sky as examples:

• List available commands
<code>?</code>
• List running processes
<code>ps</code>
• Read sensors and convert to human readable format
<code>sense | senseconv</code>
• Same, write to file
<code>sense | senseconv | write logfile.txt</code>
• Periodically (every 2 seconds), forever (0), read sensors and append to <code>logfile.txt</code>, in background.<code>
repeat 0 2 {Sense | senseconv | append logfile.txt} &amp;</code>

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

shell_register_command(&amp;utog_command);[/c]
<h2>MSPSim</h2>
MSPSim is a sensor board and MSP430 instruction simulator written in Java. Main author is Joakim Eriksson at SICS. It is cycle accurate and can simulate the Tmote Sky sensor mote (including MSP430 mcu, LEDs, CC2420 radio transceiver, M25P80 flash etc) and has recently gotten support for the MSP430x mcu that has 20-­bit address space. MSPSim can run with GUI or CLI. Start the GUI by compiling with following syntax

[bash]make my-project-file.mspsim TARGET=sky[/bash]

There, the buttons can be pressed (on the picture) and LEDs will reflect on their corresponding state. The mcu can be monitored and controlled from the control box and CLI. Another available platform is ESB, use <code>TARGET=esb</code> instead.
<h2>COOJA</h2>
COOJA is a network simulator that can create motes either from pre-­‐compiled code (allows TinyOS-­motes) or from source code (will be compiled for eg Sky motes or directly as x86-­‐motes). COOJA is very extendable and provides many ways for doing so. Anyone can extend it and use their own radio propagation model, simulated mote (just as it per default uses MSPSim for Sky motes), add visualizers, plugins etc.

Start COOJA GUI by navigating to the following folder and running

[bash]cd contiki-2.x/tools/cooja/
ant run[/bash]

If you are running a large simulation you can instead run

[bash]ant run_bigmem[/bash]

Create a new simulation in menu <code>File/New Simulation</code>.
Choose a radio propagation model (UDGM being probably the most simplistic as it only depends on distance and transmission power), random startup time (if you have several nodes they will start within this interval) and a seed for the random number generator.

<strong>Add</strong> a Tmote Sky mote: <code>Mote Types/Create/Sky mote type</code>
<strong>Name</strong> the type of mote you are creating (eg ‘Data sink’, ‘Sensor node’).
<strong>Browse</strong> to find your source file (or precompiled binary), <strong>Compile</strong> and press <strong>Create</strong>. Enter how many you would like to have, press <strong>Create</strong>. Note that it/they now show as circles in Simulation Visualizer. For this, create one mote with <code>silent.c.</code>

Explore the <strong>Control Panel;</strong> use the slider to set simulation speed: full, real time or with delay. Now set it to <strong>Real time</strong> (one click on the slider when at the left).

In <strong>Simulation Visualizer</strong>, press ‘Set visualizer skins’ and choose eg Mote IDs, LEDs, and 10m background grid. You can zoom in and out by holding <Ctrl> and clicking + dragging (on Mac). To view all nodes again, right click and choose ‘Reset viewpoint’.

Explore the <strong>Timeline</strong>. This is a very useful tool. Timeline can show when the radio is on/listening (grey) or off, transmissions (blue is transmission, green is receiving, red is interference or collision (not received but “sensed”)), LEDs and watchpoints and breakpoints. Right click to zoom in/out.

The <strong>log listener</strong> will contain all UART output from the motes. You can filter on ID or contents. Right click and choose ‘<strong>Mote specific coloring</strong>’.

Start the simulation by pressing <strong>Start</strong> on the Control Panel. The mote should start periodic toggling of LEDs. Right click on it (in Simulation Visualizer) and choose ‘<strong>Show serial port on Sky</strong>’. This is where you access the Shell. Try typing ‘?’ to see available commands. Try the commands mentioned above under Shell.
Use Timeline to zoom in to millisecond level to see how the power saving MAC protocol turns the radio on and off.

<h3>Radio traffic and some debugging</h3>
Now we will create a small network with a subset of transmitters among receivers.

Either start a new simulation (Ctrl + S) or add more motes to the already existing one. Create a total of <strong>3</strong> nodes with <code><a href=\"http://www.bithappens.se/random/contiki-debugging/broadcaster.c\" title=\"broadcaster.c source code\">broadcaster.c</a></code> and <strong>7</strong> with <code><a href=\"http://www.bithappens.se/random/contiki-debugging/silent.c\" title=\"silent.c source code\">silent.c</a></code>.
Make sure you have zoomed out Timeline, chosen ‘Mote specific coloring’ on Log listener and set time to ‘Real time’ in Control Panel. Start the simulation and observe in Timeline how three motes are transmitting broadcasts. Zoom in to see how it looks on a smaller time scale.

On any mote of your chosing, open the serial port and issue the command ‘ut’. This shows a COOJA feature useful in visualizing networks: by outputting a certain string, lines will be drawn in the Visualizer. Issue ‘ut’ again to remove them. For drawing a line between a node and one with ID 9, the software on the mote should do this:
[c ruler=\"true\"]printf(&quot;#L 9 1\\n&quot;);[/c]

To remove the line again:
[c ruler=\"true\"]printf(&quot;#L 9 0\\n&quot;);[/c]

Right click in Timeline, choose ‘<strong>Print statistics to the console</strong>’. Switch to the console; now you can see for how long time the radio has been on/transmitting/receiving, red/green/blue LED on/off etc. Using LEDs is a good debugging aid in time critical applications such as debugging code in a interrupt service routine as printf’s will both take too long time and also have a delay as it is printed out over UART.

<h3>More debugging tools</h3>
In Simulation Visualizer, right click, ‘<strong>Open mote plugin</strong>’ contains some useful tools.

