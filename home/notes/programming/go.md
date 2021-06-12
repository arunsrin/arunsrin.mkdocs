# Go

Notes from the book *Learning Go*, by Jon Bodner.

# Setup, Environment

## Difference between `go get` and `go install`:

See [here](https://stackoverflow.com/questions/24878737/what-is-the-difference-between-go-get-and-go-install#24878851).
Basically `go get` downloads the source to $GOPATH/src along with the
dependencies, and the latter compiles.

`go install` is recommended. Ignore `go get`.

## Hey
[hey](https://github.com/rakyll) for load testing http services. Install with:

`go install github.com/rakyll/hey@latest`

## Vi

Install vim-go: it comes with a massive set of tools.

## goimports
[goimports](https://pkg.go.dev/golang.org/x/tools/cmd/goimports) for some neat stuff that gofmt doesn't do. Install with:

`go install golang.org/x/tools/cmd/goimports@latest`

And run with:

`goimports -l -w .`

Vi: Just save it.

## Linting with golint

Install: `go install golang.org/x/lint/golint@latest`

Run: `golint ./...`

Vi: `:GoLint`

## SA with govet

Run: `go vet ./...`

Vi: `:GoVet`

This does not catch subtle bugs around shadow variables. So consider installing `shadow` as well:

Install: `go install golang.org/x/tools/go/analysis/passes/shadow/cmd/shadow@latest`

Run: `shadow ./...`

## Combine golint, govet with golangci-lint

This tool runs 10 different linters by default and support dozens others.

Install: [see official docs](https://golangci-lint.run/usage/install/)

Run: `golangci-lint run`

## vim-go notes

- Code completion is with `Ctrl-x Ctrl-o`
- `:Tagbar` is bound to `F8`
- `:GoDef` is bound to `gd`
  - :`GoDefStack` shows you how deep you've jumped, `GoDefPop` or `Ctrl-T` just
  pops to the last hop

## Sample makefile

```
.DEFAULT_GOAL := build

fmt:
        go fmt ./...
.PHONY:fmt

lint: fmt
        golint ./...
.PHONY:lint

vet: fmt
        go vet ./...
        shadow ./...
.PHONY:vet

build: vet
        go build hello.go
.PHONY:build
```

# Basic Types

## Type Conversions

Very strict here unlike JS / python.  One can't just treat non-empty strings
like "asd" as true for example.  No other type can be converted to a bool, even
explicitly.  The way to do that is to use comparison operators (==, !=, >=,
<=).

e.g. `x == 0` will return `true` or `false`.

## var versus :=

Most verbose way:

`var x int = 10`

Since the default type of an integer is `int`, we can omit that:

`var x = 10`

And since the default value is 0, we can also do this:

`var x int`

Multiple variables can be declared like this:

`var x, y int = 10, 20`

Even if types differ:

`var x, y = 10, "hello"`

For even more in one go, do this:

``` go
var (
	x int
	y = 20
	z int = 30
	d, e = 50, "hello"
	f, g string
)
```

Inside a function, you can use `:=` when you want go to infer the type.

`var x = 10`

becomes

`x := 10`

Or

`x, y := 10, "Hello"`

And so on.. The main difference here is that you can reassign to existing
variables too.

Recommendations / Idioms: 

- Don't declare variables at the package level, especially if they change
later. Keep only immutable variables there, and the rest inside functions.
- Don't use `:=` with type conversions, just use `var` there.
- If initialization to 0 is expected, use `var x int` instead of `x := 0`.

## const

Only works at compile time, so can only be assigned to:

- Numeric literals
- `true` and `false`
- Strings
- Runes (A rune is a single unicode character I think)
- Other built-ins: complex, real, imag, len, cap
- Expressions that consist of operators and the preceding values

So there's no way of specifying that a value calculated at runtime is
immutable. Nor are there immutable arrays, slices, maps or structs.

!!!tip
    Keep a const untyped so you have more flexbility.

`const x = 10`

let's you later do this:

```go
var y int = x
var z float64 = x
var d byte = x
```

As you'd expect, doing something like `const x int64 = 0` can only let you
assign that const to another int64.

## Unused variables

Not applicable to const's since these are detected and stubbed out from the
final binary. For normal vars though, its a compilation error to declare a var
and not use it.

# Composite Types

## Arrays

Rigid, don't use directly.

`var x [3]int` // Default 0's

`var x = [3]int{10, 20, 30}`

Sparse arrays: 0's are filled for the positions not specified:

`var x = [12]int{1,5:4,6,10:100,15}` // this creates {1,0,0,0,0,4,6,0,0,0,100,15}

`var x = [...]int{10,20,30}` // tell go to fill in the size

`var x [2][3]int` // multi-dimensional. Poor matrix support, avoid.

Find the size with `len(arr)`. 

Limitations:

- The size is part of the type, so an `[3]int` is not the same type as a
`[4]int`. So you CANNOT use a variable to specify the size of an array, because
types must be resolved at compile time. Big limitation of arrays.
- One CANNOT use a type conversion to convert arrays of different sizes to
identical types. Because of this, you can't write a function that works with
arrays of unspecified sizes, nor can you assign arrays of different sizes to
the same variable.

Really just don't use this. Arrays are backing stores for slices and this is
what you'd want to use.

## Slices

Length is /not/ part of the type. You don't specify the size when declaring:

`var x = []int{10, 20, 30}` //Note that in an array you'd do [...] instead

Similarly:

`var x = []int{1, 5:4, 6, 10:100, 15}`

`var x [][]int`

Empty slice:

`var x []int` // Since no value is assigned, x is assigned `nil`

!!!note
    Slices aren't comparable with each other with `==`, `!=` etc. Only with `nil`.
    Use `reflect.DeepEqual` if you want to compare two slices.

Use `append` to grow a slice:

``` go
var x []int
x = append(x, 10)
x = append(x, 11, 12)
```

To flatten one slice and append its values to another, use `...`:

```go
y := []int{20, 30, 40}
x = append(x, y...)
```

!!!note
    Observe that we assign the value returned by `append`. This is because Go
    is call-by-value. Every time you pass a parameter to a function, Go makes a
    copy. So append works on the copy and returns it back to the caller. So we
    re-assign the new value to that variable.
    
### capacity

The Go runtime will increase the size of a slice when the number of elements
exceeds the default allocation, e.g. by doubling it or increasing by 25%, based
on the number of elements that are already there.

The built-in function `cap` returns the current capacity of the slice, and
`make` is used to create a new slice.

### make

Like malloc. Will create a slice of fixed capacity and length, and initialize
to 0.

`x := make([]int, 5)`

!!!warning
    You can NOT use `append` to populate contents after a `make` like this.
    Reason: `make` will zero fill the slice and append will add the new values
    to the end. `append` *always* increases the length of a slice.

To specify initial capacity as well:

`x := make([]int, 6, 10)`

`x := make([]int, 0, 10)` // 0 length but 10 capacity

Runtime panic if you initialize a slice with a variable for the capacity and it
turns out to be lesser than length. Or compile time if you do it with literals.

### idiomatic way of declaring slices

- `var data []int` // if you expect it to stay nil. Has 0 length
- `var x = []int{}` // empty slice literal i.e. non-nil
- `data := []int{2, 4, 6, 8}` // if you feel the values aren't going to change
- Use `make` when you have a good idea of the size.
- When unsure, use a zero length slice with a specified capacity so that
`append` works easily.

### slicing

Similar to python. But does NOT copy the data. You get two variables that share
the same data. This gets really messy when you `append` to a sliced slice :(
The sub-slice shares the capacity of the main slice, so unused capacity in the
original slice is used when you do the append.

!!!warning
    Never use `append` with subslices. If you have to, use it with a *full
    slice expression*, which includes a third arg that specifies the last
    position in the parent slice's capacity that's available of the subslice.
    E.g.
    
    `y := x[2:4:4]` //Subslice y does not share anything beyond the 4th
    position with the parent.

### copy

Safe way of creating an independent slice.

```go
x := []int{1,2,3,4}
y := make([]int, 4}
num := copy(y, x) // Returns number of elements copied. Y is the target slice.
fmt.Println(y, num) // Prints [1 2 3 4] 4
```

## Strings, runes, bytes

UTF-8, unless specified.

`len()` gives you the raw byte length not the grapheme length.

`byte` is the underlying structure, `rune` is the UTF code point, and `string` is what the user sees.


## Maps

Make a map where key is a string, value is an int:

```go
	m0 := map[string]int{}
	m0["asd"] = 1
```

Set values up front:

```go
	m1 := map[string]int{
		"hello": 1,
		"world": 2,
	}
```

for the above, extract and test like this:

```go
	v, ok := m1["hello"]
	fmt.Println(v, ok)
    // Returns, 1 true
	v, ok := m1["does-not-exist"]
	fmt.Println(v, ok)
    // Returns, 0 false
```

i.e. Value stored in the map is `1` and there is indeed a value present for that map (stored in the `ok` variable)


`delete(m1, "hello")` deletes that key/value.

## Sets

Don't exist natively but you can make a map with bool values to
get a similar data structure.

```go
	myset := map[int]bool{}
	vals := []int{1, 3, 5, 7, 1, 10, 11, 3}

	for _, v := range vals {
		myset[v] = true
	}
```

Use third-party libraries for Union, Intersection, etc.

## Structs

```go
	type person struct {
		name  string
		empid int
	}
	var e1 person
	e1.name = "arun"
	e1.empid = 12345
    // or
	e2 := person{"sid", 5678}
```

### Anonymous struct

```go
	pet := struct {
		name string
		age  int
	}{name: "shadow", age: 10}
```

!!!note
    Type conversions between 2 structs are ONLY possible if order and
    names and types all match.

# Blocks

Anything outside a function is in the *package* block.

Anything you call with an import from another file is in the
*file* block.

And things within functions are in their blocks.

There is also a *universe* block that contains all the built-in
types and functions like `true` and `int` and `make`.

!!!warning
    Variables with the same name in an inner scope are
    *shadowed*. So any change you make are not retained once Go
    moves back to the outer scope.

```go
	x := 10
	if x > 5 {
		fmt.Println(x)  // 10, from outer scope
		x := 5          // new shadow variable
		fmt.Println(x)  // 5
	}
	fmt.Println(x) // You'd want it to be 5, but it's 10
```

The use of `:=` makes it easy to miss this, which reuses
variables only in the current block.

Consider installing `shadow` which catches this kind of thing:

```sh
code/learninggo/ch04 via  v1.16.3 ❯ shadow blocks.go
/home/arunsrin/code/learninggo/ch04/blocks.go:9:3: declaration of "x" shadows declaration at line 6
code/learninggo/ch04 via  v1.16.3 ❯
```

## if

Fairly obvious. Also, let's you define a variable inside the if
condition that you can then use in the rest of the block.

## for

Simple, C-style:

```go
	for i := 0; i < 5; i++ {
		fmt.Println(i)
	}
```
- Must use `:=` to initiatlize, `var` will not work.
- No parens

Condition-only style:

```go
	for i > 0 {
		fmt.Println(i)
		i--
	}
```

Infinite style:

```go
	for {
		fmt.Println("loop forever")
	}
```

- Use with `break` and `continue`

for-range style:

```go
	x := []int{100, 200, 300}
	for i, v := range x {
		fmt.Println(i, v)
	}
```

- `i` gives the iteration, and `v` the value
- When looping through a map, `i` gives the key instead
- Use `_` if you don't plan to use that variable in the loop
- Iteration over maps is random, no fixed order is guaranteed
- If you loop over a string, each element will be a `rune`, not a `byte`
    - The `i` value will jump by that many bytes to indicate that a
  non-ascii UTF symbol was detected
- `for` copies `i` and `v` and gives it to you. So modifying it
will not modify the upstream value you're iterating through.

## switch

Example:

```go
	words := []string{"a", "cow", "gopher", "smile", "octopus",
		"anthropologist"}
	for _, word := range words {
		switch size := len(word); size {
		case 1, 2, 3, 4:
			fmt.Println(word, " is a short word")
		case 5:
			wordLen := len(word)
			fmt.Println(word, " is the right length: ", wordLen)
		case 6, 7, 8, 9:
		default:
			fmt.Println(word, " is a long word")
		}
	}
```

- No `break` needed
- Each switch case is a scope, introduce new variables there and
they will be accessible only in that case
- In an empty case, *nothing happens*. There is no fall-through
to the next case
    - Rather, use commas to combine multiple cases that have the
    same logic
- `break` in a switch case will only break out of that case. Use
labels to actually break out of the outer loop

## Blank switch

In the previous example, `size` compared with each `case`
statement, and, if equal, that case is executed. In a blank
switch, you could run any condition in the case, not just
equality

# Functions

- No named or optional functional parameters.

## Variadic functions

Exception is when it's at the end:

`func blah(base int, rest ...int)`

- Use it in the function as a normal slice
- It can be skipped or called with any number of args

```go
func main() {
	blah(1, 2)
	blah(1)
	lotsOfArgs := []int{2, 3, 4}
	blah(1, lotsOfArgs...) //Note trailing ... for slice
}

func blah(base int, rest ...int) {
	fmt.Println("Received this many rest args", len(rest))
}
```

## Mutliple return values

Example 

`func div(num int, denom int) (int, error) {...}`

Fairly common pattern to return the actual response followed by
an `error` type

!!!note
    Has to be assigned to each variable on the calling side, you
    can't just treat it as a tuple and assign to a single
    variable like in python

## Named return values

Example 

`func div(num int, denom int) (result int, err error) {...}`

Advantage is that you are pre-declaring that those variables are
present in the function and initialized to default values.

On the calling side, feel free to use any other name.

## Blank returns

Example

`return`

!!!warning
    Don't use!

It returns the last value of a named return variable.. not
idiomatic and prone to cause confusion.

## Passing functions

Here's a simple example:

```go
func main() {
	var opMap = map[string]func(int, int) int{
		"+": add,
		"-": sub,
	}
	opFunc := opMap["+"]
	res := opFunc(5, 10)
	fmt.Println(res)
}

func add(i int, j int) int { return i + j }
func sub(i int, j int) int { return i - j }
```

!!!warning
    The example above is pretty poor. You would have quite a bit
    more error correction in the real world

## Function Type Declarations

`type opFuncType func(int, int) int`

More to come later but it's essentially like above.

That would make the map in the above example much simpler:

`var opMap = map[string]opFuncType {...}`

## Anonymous functions

```go
	i := 10
	func(j int) {
		fmt.Println("inside anon function", j)
	}(i)
```

Useful while launching goroutines or with `defer`

## Closures

Functions inside functions. They can use and modify variables
from the outer function.

```go
	type Person struct {
		name string
		age  int
	}
	people := []Person{
		{"asha", 7},
		{"sid", 5},
	}

	fmt.Println(people)
	sort.Slice(people, func(i int, j int) bool {
		return people[i].age < people[j].age
	})
	fmt.Println(people)
```

Here, `sort.Slice()` gets a function with 2 parameters `i` and
`j` but it has access to `people` as well.

You can even return a function from another function:

```go
func main() {
	f1 := makeMult(10)
	fmt.Println(f1(20))
}

func makeMult(base int) func(int) int {
	return func(factor int) int {
		return base * factor
	}
}
```

!!!note
    All of above are *Higher-order functions*, i.e. those that
    take a function as a parameter, or as a return value

## defer

Here is a simple `cat` implementation. It uses `defer` to close
file handles. `defer` is used to run something at the end of a
function, whether it ran successfully or not.

```go
package main

import (
	"io"
	"log"
	"os"
)

func main() {
	// simple `cat` implementation
	if len(os.Args) < 2 {
		log.Fatal("No file specified")
	}
	f, err := os.Open(os.Args[1])
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()

	data := make([]byte, 2048)
	for {
		count, err := f.Read(data)
		os.Stdout.Write(data[:count])
		if err != nil {
			if err != io.EOF {
				log.Fatal(err)
			}
			break
		}
	}
}
```

Note that if that function that you defer returns some values,
there is no way to actually read and use them.

Another good pattern is to write your own cleanup function and
then pass it to defer. E.g. if interacting with a DB, you may
want to either commit or rollback everything at the end.

Another pattern is to return a closure function alongside the
usual content and error. That way the caller can call it
themselves in their defer.

Example:

```go
func getFile(n string) (f os.File*, func(), error) {...}
```

So that the caller can do this:

```go
    f, cleanup, err := getFile("/etc/passwd")
    // check for err
    defer cleanup()
    // do the rest
```

## call by value

Anything you pass as a parameter is copied. Making modifications
to it will NOT stick, if you pass a struct or int or string.

If you pass a map or slice, you can modify the content but not
the size.

# Pointers


# Standard Library

Useful stuff from the standard library

`strconv.Atoi`: convert `"5"` to `5`

From `math/rand`: `rand.Intn(10)` returns a random number between 0 and 10. Seed is fixed though so look deeper

`os.Args` like python's `sys.argv`

# Third Party

Useful stuff from the ecosystem. Search in this page for details.

- `go install github.com/rakyll/hey@latest`
- `go install golang.org/x/tools/cmd/goimports@latest`
- `go install golang.org/x/lint/golint@latest`
- `go install golang.org/x/tools/go/analysis/passes/shadow/cmd/shadow@latest`

# References

- Learning Go, by Jon Bodner

## Queued

- [official code review comments](https://github.com/golang/go/wiki/CodeReviewComments)
- [Effective Go](https://golang.org/doc/effective_go)

- [Inside the Map implementation, video](https://www.youtube.com/watch?v=Tl7mi9QmLns)

