# Go

## Setup, Environment

### Difference between `go get` and `go install`:

See [here](https://stackoverflow.com/questions/24878737/what-is-the-difference-between-go-get-and-go-install#24878851).
Basically `go get` downloads the source to $GOPATH/src along with the
dependencies, and the latter compiles.

`go install` is recommended. Ignore `go get`.

### Hey
[hey](https://github.com/rakyll) for load testing http services. Install with:

`go install github.com/rakyll/hey@latest`

### Vi

Install vim-go: it comes with a massive set of tools.

### goimports
[goimports](https://pkg.go.dev/golang.org/x/tools/cmd/goimports) for some neat stuff that gofmt doesn't do. Install with:

`go install golang.org/x/tools/cmd/goimports@latest`

And run with:

`goimports -l -w .`

Vi: Just save it.

### Linting with golint

Install: `go install golang.org/x/lint/golint@latest`

Run: `golint ./...`

Vi: `:GoLint`

### SA with govet

Run: `go vet ./...`

Vi: `:GoVet`

### Combine golint, govet with golangci-lint

This tool runs 10 different linters by default and support dozens others.

Install: [see official docs](https://golangci-lint.run/usage/install/)

Run: `golangci-lint run`

### vim-go notes

- Code completion is with `Ctrl-x Ctrl-o`
- `:Tagbar` is bound to `F8`
- `:GoDef` is bound to `gd`
  - :`GoDefStack` shows you how deep you've jumped, `GoDefPop` or `Ctrl-T` just
  pops to the last hop

### Sample makefile

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
.PHONY:vet

build: vet
        go build hello.go
.PHONY:build
```

## Basic Types

### Type Conversions

Very strict here unlike JS / python.  One can't just treat non-empty strings
like "asd" as true for example.  No other type can be converted to a bool, even
explicitly.  The way to do that is to use comparison operators (==, !=, >=,
<=).

e.g. `x == 0` will return `true` or `false`.

### var versus :=

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

### const

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

### Unused variables

Not applicable to const's since these are detected and stubbed out from the
final binary. For normal vars though, its a compilation error to declare a var
and not use it.

## Composite Types

### Arrays

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

### Slices

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
    
#### capacity

The Go runtime will increase the size of a slice when the number of elements
exceeds the default allocation, e.g. by doubling it or increasing by 25%, based
on the number of elements that are already there.

The built-in function `cap` returns the current capacity of the slice, and
`make` is used to create a new slice.

#### make

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

#### idiomatic way of declaring slices

- `var data []int` // if you expect it to stay nil. Has 0 length
- `var x = []int{}` // empty slice literal i.e. non-nil
- `data := []int{2, 4, 6, 8}` // if you feel the values aren't going to change
- Use `make` when you have a good idea of the size.
- When unsure, use a zero length slice with a specified capacity so that
`append` works easily.

#### slicing

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

#### copy

Safe way of creating an independent slice.

```go
x := []int{1,2,3,4}
y := make([]int, 4}
num := copy(y, x) // Returns number of elements copied. Y is the target slice.
fmt.Println(y, num) // Prints [1 2 3 4] 4
```



# References

- Learning Go, by Jon Bodner

## Queued

- [official code review comments](https://github.com/golang/go/wiki/CodeReviewComments)
- [Effective Go](https://golang.org/doc/effective_go)

