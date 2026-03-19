# tweet-to-md

> Converts a Tweet to Markdown for LLMs.

[![NPM](https://img.shields.io/npm/v/tweet-to-md.svg)](https://www.npmjs.com/package/tweet-to-md) [![Build Status](https://github.com/transitive-bullshit/tweet-to-md/actions/workflows/main.yml/badge.svg)](https://github.com/transitive-bullshit/tweet-to-md/actions/workflows/main.yml) [![Prettier Code Formatting](https://img.shields.io/badge/code_style-prettier-brightgreen.svg)](https://prettier.io)

## Features

- ✅ supports all tweet types
- ✅ embed tweets as context for LLMs
- ✅ zero dependencies
- ✅ works without an API key
- ✅ free

## Install

```bash
npm install tweet-to-md
```

## Usage

```ts
import { getTweet, tweetToMarkdown } from 'tweet-to-md'

// fetch the tweet by id and then convert it to markdown
const tweet = await getTweet('1324595039742222337')
if (tweet) {
  const markdown = tweetToMarkdown(tweet)
  console.log(markdown)
}
```

### Notes

- fetching tweets uses twitter's public syndication api, so it's free and no API key is needed
- it outputs Github-Flavored Markdown ([GFM](https://github.github.com/gfm/)) which is well-supported by LLMs
- tweet fetching and rendering is loosely based on [vercel/react-tweet](https://github.com/vercel/react-tweet)

### Examples

| Tweet Type      | Example Tweet                                                                   | Markdown Output                              | Supported | Notes                         |
| --------------- | ------------------------------------------------------------------------------- | -------------------------------------------- | --------- | ----------------------------- |
| Text            | [1324595039742222337](https://x.com/elonmusk/status/1324595039742222337)        | [example](./examples/1324595039742222337.md) | ✅        |                               |
| Image           | [1466447129178783744](https://x.com/CatWorkers/status/1466447129178783744)      | [example](./examples/1466447129178783744.md) | ✅        |                               |
| Multiple Images | [1464100253297168403](https://x.com/nice_two/status/1464100253297168403)        | [example](./examples/1464100253297168403.md) | ✅        |                               |
| Image Card      | [1489025536714321920](https://x.com/xkcd/status/1489025536714321920)            | [example](./examples/1489025536714321920.md) | ✅        |                               |
| Quote Tweet     | [1507146276416098307](https://x.com/jack/status/1507146276416098307)            | [example](./examples/1507146276416098307.md) | ✅        |                               |
| GIF             | [1932187590955823235](https://x.com/kirawontmiss/status/1932187590955823235)    | [example](./examples/1932187590955823235.md) | ✅        |                               |
| Video           | [1990435817844887586](https://x.com/HackerResidency/status/1990435817844887586) | [example](./examples/1990435817844887586.md) | ☑️️        | poster image only, no video   |
| Poll            | [1502069843721347073](https://x.com/waitbutwhy/status/1502069843721347073)      | [example](./examples/1502069843721347073.md) | ☑️️        | poll choices not displayed    |
| Article         | [2034257912973963374](https://x.com/stripe/status/2034257912973963374)          | [example](./examples/2034257912973963374.md) | ☑️️        | article content not displayed |

## License

MIT © [Travis Fischer](https://x.com/transitive_bs)

Support my OSS work by [following me on X](https://x.com/transitive_bs)
