# Apple Daily Crawler with Node.js

This program is going to fetch the JSON from Apple Daily HK website and store it into the `./data/` folder. The JSON data is included all the articles posted on that date.

## Setup

Download and install the latest Node.js version, then run the following command.

```bash
$ npm install
```

## Usage

You can run this program in the terminal by running the command. You can fetch these type of article.

| ID  | Category      |
| --- | ------------- |
| 0   | local         |
| 1   | international |
| 2   | entertainment |
| 3   | lifestyle     |
| 4   | china         |
| 5   | sports        |
| 6   | finance       |

## Example

Fetching local type articles from 2021-06-23 to 2000-1-1.

```bash
$ node index.js "2021-06-23" 0
```

Fetching lifestyle type articles from 2021-05-01 to 2000-1-1.

```bash
$ node index.js "2021-05-01" 3
```
