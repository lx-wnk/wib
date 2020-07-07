![Test](https://github.com/jinnoflife/wib/workflows/Test/badge.svg)
[![CodeFactor](https://www.codefactor.io/repository/github/jinnoflife/wib/badge)](https://www.codefactor.io/repository/github/jinnoflife/wib)
[![codecov](https://codecov.io/gh/jinnoflife/wib/branch/master/graph/badge.svg)](https://codecov.io/gh/jinnoflife/wib)
# wib
**just a simple time tracking tool**

## Installation
`npm i -g wib`

## Update
`npm update -g wib`

## Possible usage
1. Start your day with `wib hi`. This will set the start time for every calculation
2. Track your work logs with `wib track KEY-123 MESSAGE-123`. The duration will be calculated automatically.
3. Add some notes by execution `wib note Think about the moon`. The notes will show up in the list
4. You may end your day with `wib bye`
5. To view all of your data simply execute `wib list`

## Commands
*Specific usage can be viewed by adding `-h` or `--help` after any command*
<details>
<summary>Click to open the list command</summary>
Usage: wib list|l [options]

*Possible Options*:
* `-d, --day <day>` List a specific date
* `-m, --month <month>` Date from specific month
* `-y, --yesterday` List yesterday
* `-f, --full` List the full data (unshortened)
* `-o, --order <key>` Order by (time, key, value, id) (default: "time")
</details>

<details>
<summary>Click to open the note command</summary>
Usage: wib note|n [options]

*Possible Options*:
* `-e, --edit <key>` Edit a specified note
* `-d, --delete <key>` Delete a specified note
</details>

<details>
<summary>Click to open the rest command</summary>
Usage: wib rest|b [options]

*Possible Options*:
* `-t, --time <hour:minute>` Create a rest with specified time
* `-e, --edit <key>`         Change the rest ending to now or by -t to a specified time
</details>

<details>
<summary>Click to open the start command</summary>
Usage: wib start|hi [options]
</details>

<details>
<summary>Click to open the stop command</summary>
Usage: wib stop|bye [options]
</details>

<details>
<summary>Click to open the track command</summary>
Usage: wib track|t [options]

*Possible Options*:
* `-d, --delete <key>` Delete a specified work log
* `-e, --edit <key>` Edit a specified work log
* `-t, --time <hour:minute>` Specify the finish time
</details>

## Configuration
Place the [configuration](src/config.dist.json) inside your home directory inside the folder `.wib` so that the full path would look like `~/.wib/config.json`

For better results, you should only adjust the formatting that you really need
