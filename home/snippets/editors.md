
My heart lies with GNU Emacs. It is probably my most used tool at work
because I take a crapload of notes. The pages on this site are written
in Emacs in markdown (because *mkdocs* supports it well). Some other
notes are in *org* format. And the bulk of my work-related notes
(dating back to 2007) are in one big fat plain text file that is, as of
December 2017, *26252* lines long.

I'm pretty comfortable with Vim as well. I use it for quick and dirty
editing for my projects. For longer sessions I invariably swtich to
Emacs.

Dotfiles for both editors are at
[my github](https://github.com/arunsrin/dotfiles). On a new machine I
clone this repo, copy the dotfiles over and:

- If emacs, just start it. It downloads all the packages and I'm good to go.
- If vim, I clone `vundle` first, then start vim and do a `:PluginInstall`.

Yay!

# Org-mode Keybindings

## Basic keybindings

-   `C-c C-n` and `C-c C-p` to cycle between headings.
-   `TAB` on a heading to expand/collapse.
-   `M-up` and `M-down` to reorder sections.
-   `M-left` and `M-right` to change the level of a heading.
-   `M-RET` inside a list to create a new bullet.
    -   `TAB` in a new bullet to indent it.
    -   `S-left` and `S-right` to change the bullet-style.

## Checkboxes

-   [ ] `M-S-RET` gives a checkbox.
-   [X] `C-c C-c` checks it.
    -   [X] `TAB` for subdivisions.
    -   [X] When all subtasks are checked, so is the main one.
-   [X] A trailing [] in the line preceding a list of checkboxes contains a summary (2/3 in this case).

## Publishing/Exporting

-   `C-c C-e` for everything. 
    -   `h o` exports to html.
    -   `#` brings up common templates.

# Org-mode code blocks

-   Awk, C, R, Asymptote, Calc, Clojure, CSS, Ditaa, Dot, Emacs Lisp,
    Forth, Fortran, Gnuplot, Haskell, IO, J, Java, Javascript, LaTeX,
    Ledger, Lilypond, Lisp, Makefile, Maxima, Matlab, Mscgen, Ocaml,
    Octave, Org, Perl, Pico Lisp, PlantUML, Python, Ruby, Sass, Scala,
    Scheme, Screen, sh, Shen, Sql, Sqlite, ebnf2ps.

# Set font in gvim permanently

-   Change it for the current session and verify what it is set as with this:

`:set guifont?`

-   Copy the string and add it to .vimrc like so:

`set guifont=Hack:h9:cANSI`

# Vim tips

-   delete trailing whitespace:

`:%s: *$::`

-   pull onto search line:

`/ CtrlR CtrlW`

-   open file name under cursor:

`gf`

-   increment/decrement number under cursor:

`CtrlA/CtrlX`
