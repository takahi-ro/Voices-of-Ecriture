import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

export const metadata = {
  title: "エクリチュールの声",
  description: "「エクリチュールの声」という過去にp5.jsで作った作品を、誰でも体験可能なWebアプリにしました。また、LLM(大規模言語モデル)のアンチテーゼというメッセージを、本アプリには込めています",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body 
      // className={inter.className}
      >
        {children}
      </body>
    </html>
  );
}
