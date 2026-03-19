/* eslint-disable unicorn/no-immediate-mutation */
import type { Tweet } from './types'
import {
  type EnrichedQuotedTweet,
  type EnrichedTweet,
  enrichTweet,
  formatDate,
  formatNumber,
  getMediaUrl,
  prefixLines
} from './utils'

export type TweetToMarkdownOptions = {
  includeStats?: boolean
}

export function tweetToMarkdown(
  tweet: Tweet,
  opts?: TweetToMarkdownOptions
): string {
  return tweetToMarkdownImpl(enrichTweet(tweet), opts)
}

function tweetToMarkdownImpl(
  tweet: EnrichedTweet | EnrichedQuotedTweet,
  opts: TweetToMarkdownOptions = {}
): string {
  const { includeStats = true } = opts
  const isTweet = (tweet as any).__typename === 'Tweet'
  const enrichedTweet = tweet as unknown as EnrichedTweet
  const parts: string[] = []

  parts.push(
    `#### [Tweet by ${tweet.user.name} @${tweet.user.screen_name}](${tweet.url})\n`
  )

  if (isTweet && enrichedTweet.in_reply_to_screen_name) {
    parts.push(
      `[Replying to @${enrichedTweet.in_reply_to_screen_name}](${enrichedTweet.in_reply_to_url})\n`
    )
  }

  for (const entity of tweet.entities) {
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
          `[![${media.ext_alt_text || media.display_url || 'Image'}](${mediaUrl})](${tweet.url})`
        )
      } else if (media.type === 'animated_gif') {
        const mediaUrl = getMediaUrl(media, 'small')

        parts.push(
          `[![${media.display_url || 'Animated GIF'}](${mediaUrl})](${tweet.url})`
        )
      } else if (media.type === 'video') {
        const mediaUrl = getMediaUrl(media, 'small')

        parts.push(
          `[![${media.display_url || 'Video'}](${mediaUrl})](${tweet.url})`
        )
      }
    }
  }

  if (isTweet && enrichedTweet.quoted_tweet) {
    const quotedTweet = tweetToMarkdownImpl(enrichedTweet.quoted_tweet, opts)
    if (quotedTweet) {
      parts.push('\n' + prefixLines(quotedTweet, '> '))
    }
  }

  const createdAt = new Date(tweet.created_at)
  const formattedCreatedAtDate = formatDate(createdAt)
  const favoriteCount = formatNumber(tweet.favorite_count)
  const replyCountNumber = isTweet
    ? enrichedTweet.conversation_count
    : (tweet as EnrichedQuotedTweet).reply_count
  const replyCount =
    replyCountNumber !== undefined ? formatNumber(replyCountNumber) : undefined

  if (includeStats) {
    const stats = [
      `${formattedCreatedAtDate}`,
      favoriteCount !== undefined ? `${favoriteCount} Likes` : undefined,
      replyCount !== undefined ? `${replyCount} Replies` : undefined
    ]
      .filter(Boolean)
      .join(' · ')

    parts.push(`\n[${stats}](${tweet.url})`)
  }

  return `${parts.filter(Boolean).join('\n')}`
}
