import type { Tweet } from './types'
import { fetchTweet } from './fetch-tweet'

/**
 * Returns a tweet from the Twitter syndication API.
 */
export async function getTweet(
  tweetId: string,
  fetchOptions?: RequestInit
): Promise<Tweet | undefined> {
  const { data, tombstone, notFound } = await fetchTweet(tweetId, fetchOptions)

  if (notFound) {
    console.error(
      `The tweet ${tweetId} does not exist or has been deleted by the account owner.`
    )
  } else if (tombstone) {
    console.error(
      `The tweet ${tweetId} has been made private by the account owner.`
    )
  }

  return data
}
