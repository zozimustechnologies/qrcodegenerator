# QR Code Generator

A simple, lightweight web-based QR code generator built by [Zozimus Technologies](https://github.com/zozimustechnologies). Enter any text or URL and instantly generate a scannable QR code image.

## Screenshot

<div align="center">

![QR Code Generator](extension/screenshots/screenshot-1280x800.png)

</div>

## Demo

<div align="center">

![QR Code Generator Demo](extension/screenshots/demo.gif)

</div>

## Screenshots

| Size | Preview |
|------|---------|
| 440×280 | ![Small](extension/screenshots/screenshot-440x280.png) |
| 1280×800 | ![Large](extension/screenshots/screenshot-1280x800.png) |
| 1400×560 | ![Marquee](extension/screenshots/screenshot-1400x560.png) |

## Features

- **Instant QR Code Generation** - Type any text or URL and click "Generate QR code" to create a QR code on the fly.
- **Clean, Minimal UI** - A centered card layout with a modern blue theme for a distraction-free experience.
- **No Installation Required** - Pure HTML, CSS, and JavaScript. Just open `index.html` in your browser.
- **Responsive Design** - Works on desktops, tablets, and mobile devices.
- **View Source Code** - Quick-access button to jump to the GitHub repository.
- **Donate Button** - Support the developer directly via Wise.

## Getting Started

1. **Open the website**

 [The QRCode Generator](https://the-qrcode-generator.netlify.app/)
2. **Generate a QR code**

   - Enter a URL or any text in the input field.
   - Click **Generate QR code**.
   - The QR code image will appear below the input.

## Project Structure

| File / Folder | Description |
|------|-------------|
| `index.html` | Main HTML page with the input form and layout |
| `style.css` | Styling with blue theme, card layout, and buttons |
| `backend.js` | JavaScript logic to call the QR code API and display the result |
| `images/` | Favicon, icon, and screenshot assets |
| `extension/` | Chrome/Edge side panel extension (manifest, icons, screenshots, demo) |

## Technologies Used

- **HTML5**
- **CSS3** (Google Fonts - Noto Sans, Material Symbols)
- **JavaScript** (Vanilla)
- **[QR Server API](https://goqr.me/api/)**

## License

<p>Copyright &copy 2026 Zozimus Technologies</p>
