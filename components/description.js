import Link from '@mui/material/Link';
import { cyan } from '@mui/material/colors';
// import Stack from '@mui/material/Stack';
// import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
// import Tooltip from '@mui/material/Tooltip';

const Description = () => {
  const linkColor = cyan[800];
  // const infoText = `「${<Link target="_blank" rel="noreferrer" underline="hover" color={linkColor} href = "https://neort.io/art/ce3k81sn70rlpj69c980">エクリチュールの声</Link>}」という過去にp5.jsで作った作品を、誰でも体験可能なWebアプリにしました。また、LLM（大規模言語モデル）のアンチテーゼというメッセージを、本アプリには込めています。`;

  return (
    <>
    <h1>エクリチュールの声、またはLLMのアンチテーゼ</h1>
    <p>「<Link target="_blank" rel="noreferrer" underline="hover" color={linkColor} href = "https://neort.io/art/ce3k81sn70rlpj69c980">エクリチュールの声</Link>」というp5.jsで作った作品を、誰でも体験可能なWebアプリにしました。また、LLM（大規模言語モデル）のアンチテーゼというメッセージを、本アプリには込めています。</p>
    <p><Link target="_blank" rel="noreferrer" underline="hover" color={linkColor} href = "https://github.com/takahi-ro/Voices-of-Ecriture/blob/main/README.md#%E4%BD%BF%E3%81%84%E6%96%B9">👉 使い方はこちら</Link></p>
    </>
  )
};

export default Description;