export type IPRInfringmentAttempt = {
  fullMatchingImages: Array<MatchingImage>
  pageTitle: string
  partialMatchingImages: Array<MatchingImage>
  score: number
  url: string
}

export type MatchingImage = {
  score: number
  url: string
}
