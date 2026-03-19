#!/usr/bin/env node
import { program } from 'commander'

import { getTweet } from './get-tweet'
import { tweetToMarkdown } from './tweet-to-md'

program
  .name('tweet-to-md')
  .description('Converts a Tweet to Markdown')
  .argument('<tweetId>', 'Tweet ID')
  .action(async (tweetId: string) => {
    const tweet = await getTweet(tweetId)
    if (!tweet) {
      console.error(`Tweet ${tweetId} not found`)
      process.exit(1)
    } else {
      console.log(tweetToMarkdown(tweet))
    }
  })

await program.parseAsync()
