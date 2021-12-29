# Python notes

## Modern Python

Some tools that I should use more often to make my life easier.

- `black` - Auto-formats your files, like `go fmt`. Just run and forget.


## Python3 on centos (using scl):

``` sh
scl enable python33 bash
```

## Design patterns

### Observer:

-   Like a presence subscription. multiple obvservers get notified when
    a core object changes.
-   Also see @property to create setters/getters for attributes. That
    way when an attribute changes, we can make a call to update() and
    let the observers know.

### Strategy:

-   Different implementations hidden beneath a single
    abstraction. e.g. user calls sort() but does not care which
    algorithm is used.
-   Create different classes and implement `__call__`, so that when an
    object is created, that function is called automatically.

### Template:

-   Differing steps in separate classes, one controller.

## Unicode, and Encode vs Decode

-   `bytes.decode`: interpret a stream of bytes (from a file or the
    network) as unicode, with a passed charset like UTF-8 or latin-1.
-   `str.encode`: take a unicode string and convert it to bytes, to write
    to file or send over a network.
-   **deep breath** both byte strings and unicode have a method to convert
    to the other. byte.decode('utf-8') takes a byte stream and
    represents it as a UTF-8 string. utf.encode() takes a utf-8 string
    and represents it as a byte stream (to send out over a network, for
    example).
-   `encode()` accepts an arg that allows you to represent as ascii, but
    replace out-of-range characters with ???? or something else.
-   Python2: str: stream of bytes, unicode: unicode.
-   Python3: str: unicode, bytes: stream of bytes.
-   Python2 implicitly tries to change bytes to unicode and vice versa
    to be 'helpful'. Python3 doesn't.
-   A recommendation: bytes on the outside -> decode to utf-8 -> use
    unicode inside -> encode to bytes -> send out.
-   `IOBuffer` and `FileBuffer` are like dummy network/file interfaces
    (useful for tests?)
-   ISO-8859-1 aka Latin-1 is a single byte extension to ascii that
    supports a few extra symbols.

## Coverage usage

Run this:

``` sh
coverage run scriptname args
```

Results are stored in `.coverage`. If the script has different args,
backup `.coverage`, run again and then combine them:

``` sh
coverage combine .coverage.old .coverage
```

For a quick summary (`-m` specifies the missing lines):

``` sh
coverage report -m
```

For a report (`-d` specifies the dest folder):

``` sh
coverage html -d coverage_html
```

## Decorator example

``` py
def my_decorator(func):
    def wrapper(*args, **kwargs):
        # do pre-processing
        ret = func(*args, **kwargs)
        # do post-processing
        return ret
    return wrapper
```

i.e., return a function (wrapper) that calls func with its args, but
do your pre/post stuff within wrapper.

## Django notes

-   Change your models (in models.py).
-   Run `python manage.py makemigrations` to create migrations for those changes
-   Run `python manage.py migrate` to apply those changes to the database.

## Magic number

The python interpreter's magic number is found in:

``` py
importlib.util.MAGIC_NUMBER
```

.pyc file format:

`magic number | mtime | size | marshaled code object`

## Dunder methods

-   String/bytes representation

`__repr__, __str__, __format__, __bytes__`

-   Conversion to number

`__abs__, __bool__, __complex__, __int__, __float__, __hash__, __index__`

-   Emulating collections

`__len__, __getitem__, __setitem__, __delitem__, __contains__`

-   Iteration

`__iter__, __reversed__, __next__`

-   Emulating callables

`__call__`

-   Context management

`__enter__, __exit__`

-   Instance creation and destruction

`__new__, __init__, __del__`

-   Attribute management

`__getattr__, __getattribute__, __setattr__, __delattr__, __dir__`

-   Attribute descriptors

`__get__, __set__, __delete__`

-   Class services

`__prepare__, __instancecheck__, __subclasscheck__`

## Pickling

-   The last byte of a pickled file is a '.' Anything that follows it is ignored.
-   This would be a way to embed a jpeg or something to the end of a pickle file..??

## Staticmethod vs Classmethod

-   staticmethod: can be called directly from the class, without instantiating an object.
-   classmethod: exactly the same.
-   BUT: when a staticmethod is called from an object, the 'self'
    parameter is never passed, the way it is for classmethods and normal
    methods.

## Import files with hyphens

``` py
test_cmd = importlib.import_module('test-cmd', None)
```