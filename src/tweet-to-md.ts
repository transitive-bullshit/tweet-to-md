/* eslint-disable unicorn/no-immediate-mutation */
import type { Tweet } from './types'
import { getTweet } from './get-tweet'
import {
  enrichTweet,
  formatDate,
  formatNumber,
  getMediaUrl,
  prefixLines
} from './utils'

export type TweetToMarkdownOptions = {
  includeStats?: boolean
}

export async function tweetToMarkdown(
  tweetOrTweetId: string | Tweet,
  opts?: TweetToMarkdownOptions
): Promise<string> {
  if (typeof tweetOrTweetId !== 'string') {
    return tweetToMarkdownImpl(tweetOrTweetId)
  }

  const tweet = await getTweet(tweetOrTweetId)
  if (!tweet) {
    return `Tweet not found: ${tweetOrTweetId}`
  }

  return tweetToMarkdownImpl(tweet, opts)
}

async function tweetToMarkdownImpl(
  tweet: Tweet,
  opts: TweetToMarkdownOptions = {}
): Promise<string> {
  const { includeStats = true } = opts
  const enrichedTweet = enrichTweet(tweet)
  const parts: string[] = []

  parts.push(
    `#### [Tweet by ${enrichedTweet.user.name} @${enrichedTweet.user.screen_name}](${enrichedTweet.url})\n`
  )
  if (enrichedTweet.in_reply_to_screen_name) {
    parts.push(
      `[Replying to @${enrichedTweet.in_reply_to_screen_name}](${enrichedTweet.in_reply_to_url})\n`
    )
  }

  for (const entity of enrichedTweet.entities) {
    switch (entity.type) {
      case 'hashtag':
      case 'mention':
      case 'url':
      case 'symbol':
        parts.push(`[${entity.text}](${entity.href})`)
        break

      case 'media':
        // Media text is currently never displayed, some tweets however might have indices
        break

      default:
        parts.push(entity.text)
        break
    }
  }

  if (tweet.mediaDetails?.length) {
    parts.push('\n')

    for (const media of tweet.mediaDetails) {
      if (media.type === 'photo') {
        const mediaUrl = getMediaUrl(media, 'small')

        parts.push(
          `[![${media.ext_alt_text || media.display_url || 'Image'}](${mediaUrl})](${enrichedTweet.url})`
        )
      } else if (media.type === 'animated_gif') {
        const mediaUrl = getMediaUrl(media, 'small')

        parts.push(
          `[![${media.display_url || 'Animated GIF'}](${mediaUrl})](${enrichedTweet.url})`
        )
      } else if (media.type === 'video') {
        const mediaUrl = getMediaUrl(media, 'small')

        parts.push(
          `[![${media.display_url || 'Video'}](${mediaUrl})](${enrichedTweet.url})`
        )
      }
    }
  }

  if (tweet.quoted_tweet) {
    const quotedTweet = await tweetToMarkdown(tweet.quoted_tweet.id_str, opts)
    if (quotedTweet) {
      parts.push(prefixLines(quotedTweet, '> '))
    }
  }

  const createdAt = new Date(tweet.created_at)
  const formattedCreatedAtDate = formatDate(createdAt)
  const favoriteCount = formatNumber(tweet.favorite_count)
  const replyCount = formatNumber(tweet.conversation_count)

  const statsLine = [formattedCreatedAtDate]
  if (includeStats) {
    statsLine.push(`${favoriteCount} Likes`)
    statsLine.push(`${replyCount} Replies`)
  }

  parts.push(`\n[${statsLine.join(' · ')}](${enrichedTweet.url})`)

  return `${parts.filter(Boolean).join('\n')}`
}
