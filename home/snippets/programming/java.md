# Java

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

## Maven

- Expected directory structure: Java files are in `src/main/java` as
  well as `src/test/java`. Resource files are under
  `src/main/resources` and `src/test/resources`.

- `mvn archetype:generate`: Generates a skeleton of a project based on
  your inputs (package name, versioning, project name, etc).

- Edit `pom.xml` and set the jdk version there.. the default may be
  old. Java 9 onwaards doesn't generate the `.class` format. You
  should have this added to the default .xml file:

```xml
<build>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-compiler-plugin</artifactId>
        <version>3.8.0</version>
        <configuration>
            <source>1.11</source>
            <target>1.11</target>
            <release>11</release>
        </configuration>
      </plugin>
    </plugins>
  </build>
```

- `mvn package` - compile, test, bundle.

## Things to find out later

- See how to create a call graph in eclipse.

- `final` keyword?

    - *Answer*: when used with a variable, it (a) blocks reassignment,
      and (b) limits existence to that block. e.g. a `final String tmp = orig`
      inside a for loop cannot be reassigned with a different
      value. The value does not exist outside the block it is defined
      in. Good practice to declare this often as it means a variable
      is guaranteed not to change in value.