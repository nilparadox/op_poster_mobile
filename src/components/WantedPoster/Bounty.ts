import type { BountyInfo } from './types'
import Text from './Text'
import { loadImage } from './utils'

class Bounty extends Text {
  #isNumber = true
  #numberFormat = new Intl.NumberFormat()
  #bellySignImage: HTMLImageElement | null = null
  #bellyImageScale = 1
  #bellyMarginRight = 0

  fontScale = 1
  verticalOffset = 0

  async loadBellyImage(url: string) {
    try {
      this.#bellySignImage = await loadImage(url)
    } catch (error) {
      console.error(error)
      throw new Error('Failed to init bounty.')
    }
  }

  setBountyInfo(bountyInfo: BountyInfo, bellyImageScale: number) {
    const { x, y, width, height, bellyMarginRight, fontSize } = bountyInfo
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.fontSize = fontSize
    this.#bellyMarginRight = bellyMarginRight
    this.#bellyImageScale = bellyImageScale
  }

  formatText(text: string, spacing: number = 0): string {
    const price = Number.parseFloat(text)
    if (Number.isNaN(price)) {
      this.#isNumber = false
      return this.formatSpacing(text, spacing)
    }

    this.#isNumber = true
    const formattedPrice = this.#numberFormat.format(price) + '-'
    return this.formatSpacing(formattedPrice, spacing)
  }

  beforeRenderText() {
    if (!this.#bellySignImage) {
      return
    }

    const scaledBellySignWidth =
      this.#bellySignImage.width * this.#bellyImageScale
    const scaledBellySignHeight =
      this.#bellySignImage.height * this.#bellyImageScale

    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'top'

    const centerX = this.x + this.width / 2
    const bellySignAreaWidth = this.#isNumber
      ? scaledBellySignWidth + this.#bellyMarginRight
      : 0

    const maxWidth = (this.width - bellySignAreaWidth) * 0.96
    const maxHeight = this.height * 0.82

    let fontSize = this.fontSize * this.fontScale
    let textWidth = 0
    let textHeight = 0

    for (let i = 0; i < 12; i++) {
      this.ctx.font = `${this.fontWeight} ${Math.max(
        1,
        fontSize
      )}px ${this.fontFamily}, serif`

      textWidth = this.ctx.measureText(this.formattedText).width
      textHeight = this.getTextActualHeight(this.formattedText)

      if (textWidth <= maxWidth && textHeight <= maxHeight) {
        break
      }

      const widthScale = maxWidth / Math.max(textWidth, 1)
      const heightScale = maxHeight / Math.max(textHeight, 1)
      const scale = Math.min(widthScale, heightScale) * 0.98

      fontSize = Math.max(1, fontSize * scale)
    }

    this.ctx.font = `${this.fontWeight} ${Math.max(
      1,
      fontSize
    )}px ${this.fontFamily}, serif`

    textWidth = Math.min(this.ctx.measureText(this.formattedText).width, maxWidth)
    textHeight = this.getTextActualHeight(this.formattedText)

    const x = centerX + bellySignAreaWidth / 2
    const y =
      this.y +
      (this.height - textHeight) / 2 +
      this.verticalOffset * this.#bellyImageScale

    if (this.#isNumber) {
      const bellySignX = centerX - bellySignAreaWidth / 2 - textWidth / 2

      this.ctx.globalCompositeOperation = 'darken'
      this.ctx.drawImage(
        this.#bellySignImage,
        bellySignX,
        this.y,
        scaledBellySignWidth,
        scaledBellySignHeight
      )
    }

    return {
      x,
      y,
      maxWidth
    }
  }
}

export default Bounty
