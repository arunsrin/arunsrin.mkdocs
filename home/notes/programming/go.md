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

# References

- Learning Go, by Jon Bodner

## Queued

- [official code review comments](https://github.com/golang/go/wiki/CodeReviewComments)
- [Effective Go](https://golang.org/doc/effective_go)

