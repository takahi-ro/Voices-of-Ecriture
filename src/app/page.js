import { SketchWrapper } from '../../components/sketchWrapper';

export default function Home() {  
  return (
    <div>
      <h1>エクリチュールの声（<a target="_blank" href = "https://github.com/takahi-ro/Voices-of-Ecriture/blob/main/README.md">Github</a>）</h1>
      <p>「<a target="_blank" href = "https://neort.io/art/ce3k81sn70rlpj69c980">エクリチュールの声</a>」という過去にp5.jsで作った作品を、誰でも体験可能なWebアプリにしました。また、LLM（大規模言語モデル）のアンチテーゼというメッセージを、本アプリには込めています。</p>
      <SketchWrapper />
    </div>
  );
}
