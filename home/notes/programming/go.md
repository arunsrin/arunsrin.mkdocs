# Go

## References

- Learning Go, by Jon Bodner

### Queued

- [official code review comments](https://github.com/golang/go/wiki/CodeReviewComments)
- [Effective Go](https://golang.org/doc/effective_go)

## Notes

### Setup, Environment

#### Difference between `go get` and `go install`:
See [here](https://stackoverflow.com/questions/24878737/what-is-the-difference-between-go-get-and-go-install#24878851).
Basically `go get` downloads the source to $GOPATH/src along with the
dependencies, and the latter compiles.

`go install` is recommended. Ignore `go get`.

#### Hey
[hey](https://github.com/rakyll) for load testing http services. Install with:

`go install github.com/rakyll/hey@latest`

#### Vi

Install vim-go: it comes with a massive set of tools.

#### goimports
[goimports](https://pkg.go.dev/golang.org/x/tools/cmd/goimports) for some neat stuff that gofmt doesn't do. Install with:

`go install golang.org/x/tools/cmd/goimports@latest`

And run with:

`goimports -l -w .`

Vi: Just save it.

#### Linting with golint

Install: `go install golang.org/x/lint/golint@latest`

Run: `golint ./...`

Vi: `:GoLint`

#### SA with govet

Run: `go vet ./...`

Vi: `:GoVet`

#### Combine golint, govet with golangci-lint

This tool runs 10 different linters by default and support dozens others.

Install: [see official docs](https://golangci-lint.run/usage/install/)

Run: `golangci-lint run`

#### vim-go notes

- Code completion is with `Ctrl-x Ctrl-o`
- `:Tagbar` is bound to `F8`
- `:GoDef` is bound to `gd`
  - :`GoDefStack` shows you how deep you've jumped, `GoDefPop` or `Ctrl-T` just
  pops to the last hop

#### Sample makefile

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
