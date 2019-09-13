# arunsrin.mkdocs

Static site for all my snippets, notes, etc. Powered by the excellent [mkdocs](http://www.mkdocs.org/).

Currently hosted [here](https://www.arunsr.in).

# Installation / Usage

``` sh
git clone git@github.com:arunsrin/arunsrin.mkdocs.git
cd arunsrin.mkdocs
virtualenv .venv --python=python3
source .venv/bin/activate
pip install -r requirements.txt
mkdocs serve # test
mkdocs build # publishes to ../../public/
```
