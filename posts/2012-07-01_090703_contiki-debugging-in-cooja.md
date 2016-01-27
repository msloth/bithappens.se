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

• List available commands ?
• List running processes ps
• Read sensors and convert to human readable format sense | senseconv
• Same, write to file
sense | senseconv | write logfile.txt
• Periodically (every 2 seconds), forever (0), read sensors and append to logfile.txt, in background.
repeat 0 2 {Sense | senseconv | append logfile.txt} &amp;

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