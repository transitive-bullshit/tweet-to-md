import { mkdir, writeFile } from 'node:fs/promises'

import { expect, test } from 'vitest'

import { getTweet } from './get-tweet'
import { tweetToMarkdown } from './tweet-to-md'

const tweetIdFixtures = [
  '1324595039742222337', // text
  '1466447129178783744', // image
  '1464100253297168403', // multiple images
  '1489025536714321920', // image card
  '1502069843721347073', // poll
  '1507146276416098307', // quote tweet (both text)
  '1932187590955823235', // gif
  '1990435817844887586', // video
  '2034257912973963374' // article
]

const writeExamples = false

for (const id of tweetIdFixtures) {
  test(
    `tweetToMarkdown success ${id}`,
    {
      timeout: 60_000
    },
    async () => {
      const tweet = await getTweet(id)
      expect(tweet).toBeDefined()
      if (!tweet) return

      // don't include stats in the stable markdown (likes and reply counts can change over time)
      const stableMarkdown = tweetToMarkdown(tweet, {
        includeStats: false
      })
      const markdown = tweetToMarkdown(tweet)

      if (writeExamples) {
        console.log(`${id}.md\n${markdown}`)
        await mkdir('examples', { recursive: true })
        await writeFile(`examples/${id}.md`, markdown)
      }

      expect(markdown.trim()).toBeTruthy()
      expect(stableMarkdown.trim()).toBeTruthy()
      expect(markdown.trim().length).toBeGreaterThanOrEqual(
        stableMarkdown.trim().length
      )
      expect(stableMarkdown.trim()).toMatchSnapshot()
    }
  )
}
