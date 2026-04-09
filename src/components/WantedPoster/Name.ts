import type { Position } from './types'
import Text from './Text'

class Name extends Text {
  #fontSizeScale = 1.6

  setPosition(position: Position) {
    this.x = position.x
    this.y = position.y
    this.width = position.width
    this.height = position.height
    this.fontSize = this.height * this.#fontSizeScale
  }

  beforeRenderText() {
    const family = "'Scheherazade New', serif"
    const x = this.x + this.width / 2
    const maxWidth = this.width * 0.94
    const maxHeight = this.height * 0.88

    const rawText = this.text.replace(/\s+/g, '')
    const isMobile = window.innerWidth <= 768

    let fontSize = this.fontSize

    // Short names look too large, especially on mobile.
    // Scale them down progressively.
    if (isMobile) {
      if (rawText.length <= 5) {
        fontSize *= 0.62
      } else if (rawText.length <= 8) {
        fontSize *= 0.72
      } else if (rawText.length <= 12) {
        fontSize *= 0.82
      }
    } else {
      if (rawText.length <= 5) {
        fontSize *= 0.72
      } else if (rawText.length <= 8) {
        fontSize *= 0.82
      }
    }

    for (let i = 0; i < 12; i++) {
      this.ctx.font = `700 ${Math.max(1, Math.floor(fontSize))}px ${family}`

      const textWidth = this.ctx.measureText(this.formattedText).width
      const textHeight = this.getTextActualHeight(this.formattedText)

      if (textWidth <= maxWidth && textHeight <= maxHeight) {
        break
      }

      const widthScale = maxWidth / Math.max(textWidth, 1)
      const heightScale = maxHeight / Math.max(textHeight, 1)
      const scale = Math.min(widthScale, heightScale) * 0.98

      fontSize = Math.max(1, fontSize * scale)
    }

    this.ctx.font = `700 ${Math.max(1, Math.floor(fontSize))}px ${family}`
    const finalHeight = this.getTextActualHeight(this.formattedText)
    const y = this.y + (this.height - finalHeight) / 2

    return {
      x,
      y,
      maxWidth
    }
  }
}

export default Name
