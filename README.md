![Test](https://github.com/jinnoflife/wib/workflows/Test/badge.svg)
[![CodeFactor](https://www.codefactor.io/repository/github/jinnoflife/wib/badge)](https://www.codefactor.io/repository/github/jinnoflife/wib)
[![codecov](https://codecov.io/gh/jinnoflife/wib/branch/master/graph/badge.svg)](https://codecov.io/gh/jinnoflife/wib)
# (WIP) wib
just a simple time tracking tool

## Commands
### list
Usage: wib list|l [options]
#### Options:
* `-d, --day <day>`      List a specific date
* `-m, --month <month>`  Date from specific month
* `-y, --yesterday`      List yesterday
*  `-f, --full`           List the full data (unshortened)
*  `-o, --order <key>`    Order by (time, key, value, id) (default: "time")

### note
Usage: wib note|n [options]

#### Options:
* `-e, --edit <key>`    Edit a specified note
* `-d, --delete <key>`  Delete a specified note

### rest
Usage: wib rest|b [options]

#### Options:
* `-t, --time <hour:minute>`  -t, --time <hour:minute>

### start
Usage: wib start|hi [options]

### stop
Usage: wib stop|bye [options]

### track
Usage: wib track|t [options]
#### Options:
* `-d, --delete <key>`        Delete a specified worklog
* `-e, --edit <key>`          Edit a specified worklog
* `-t, --time <hour:minute>`  Specify the finish time

## Configuration
Place the [configuration](src/config.dist.json) inside your home directory inside the folder `.wib` so that the full path would look like `~/.wib/config.json`

For better results, you should only adjust the formatting that you really need
