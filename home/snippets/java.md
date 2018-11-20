
Most of these notes are from the book *Java Projects* by *Peter Verhas*.

## JShell

- `/list -start` - shows modules imported at startup.
- `/edit <number>` - edit that line in a new window.
- `/set editor "vi"` - use vi instead of the default graphical edit pad.
- `/save abc.java` - save current buffer to file.
- `/load abc.java` - load from file into shell.
- `/-1` - execute last snippet.
- `/1` - execute first snippet.
- `/drop N` - drop Nth snippet.
- `/vars` - show only variables that were defined in snippets.
- `/types` - show only classes that were defined in snippets.

## Javap

- `javap TestDecompile.class` - decompile .class file to human
  readable format. Does not show content of methods though.

- `javap -c TestDecompile.class` - show jvm bytecode in human readable
  -form, including methods.

## Jar files

These are zip files that have a `META-INF` folder with a `Manifest.mf`
file inside.

To create a jar file:

``` sh
jar -cf hello.jar HelloWorld.class
```

And to run:

``` sh
java -cp hello.jar HelloWorld
```

To see contents of a jar:

``` sh
jar -tf hello.jar
```

## Runtime/debugging

- `jps` - Shows all runnning java processes.

- `jvisualvm` - If you have it, it shows the java processes on the
  system with details on threads, profiler etc.

- `-Xagentlib:jdwp=transport=dt_socket,server=y,suspend=y,address=7896`
  Use these args to start a process in debugging mode.
    - `agentlib=jdwp` - Load the `jdwp` agent, for debugging.

    - `transport=dt_socket` - for connecting a debugging client over
      the network.
    
    - `server=y` - this one is the server half of the debugging.

    - `suspend=y` - don't start executing until a client debugger
      attaches.

    - `address=7896` - port we listen on.

## Things to find out later

- See how to create a call graph in eclipse.