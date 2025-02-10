'use client';
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useDropzone } from 'react-dropzone';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import p5 from 'p5';
import Description from './description';

let p5Canvas, textForest0;


// p5.jsのスケッチコンポーネント
const Sketch = () => {
  //パラメータの初期値をセット
  //TODO：useStateでパラメータを更新できるようにしたいが、SSRエラーになる
  const parameters = {
    textBaseSize: 30,
    textColor: "random",
    frameRate: 0.3,
  };

  //ファイルアップロードの処理
  ////テキストの取得
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = (e) => {
      //エクリチュールの声の素材にアップロードしたテキストを指定
      textForest0 = e.target.result;
      }
      reader.readAsText(file)
    })
  }, [])
  ////Dropzoneの設定
  const { 
    acceptedFiles, 
    getRootProps, 
    getInputProps, 
    isFocused,
    isDragAccept,
    isDragReject 
  } = useDropzone({
    accept: {
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    onDrop
  });
  ////ファイルアップロードのスタイル
  const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#aaaaaa',
    outline: 'none',
    transition: 'border .24s ease-in-out'
  };
  
  const focusedStyle = {
    borderColor: '#2196f3'
  };
  
  const acceptStyle = {
    borderColor: '#00e676'
  };
  
  const rejectStyle = {
    borderColor: '#ff1744'
  };
  
  const style = useMemo(() => ({
    ...baseStyle,
    ...(isFocused ? focusedStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [isFocused, isDragAccept, isDragReject]);

  //初回レンダーを避ける
  const isFirstRender = useRef(true);

  //ファイルアップロード前か後かのState
  const [isUploaded, setIsUploaded] = useState(false);

  // p5.jsの描画処理
  const voicesOfEcriture = (p) => {  
    let word, roop, tSize, textForest;

    p.setup = () => {
      // セットアップ処理
      p.createCanvas(p.windowWidth-16, p.windowHeight);
      // noLoop();
      roop = 120;
      p.frameRate(parameters.frameRate);
    };
  
    p.draw = () => {
      let textForestBox = [];
      let y = [];
    
      let index1, index2;
      p.background(0);
      textForest = textForest0.split("。");
      textForest = p.shuffle(textForest);
    
      for (let i = 0; i < textForest.length; i++) {
        textForestBox[i] = textForest[i].split(" ");
        textForestBox[i] = p.shuffle(textForestBox[i]);
      }
    
      textForestBox = p.shuffle(textForestBox);

      for (let i = 1; i < roop * 2; i++) {
        y[i] = (p.height / roop) * 2 * i;
      }
      y = p.shuffle(y);
      index1 = p.floor(p.random(textForestBox.length));
      index2 = p.floor(p.random(textForestBox[index1].length));
    
      for (let i = 0; i < roop; i++) {
        tSize = p.random(parameters.textBaseSize / 2, parameters.textBaseSize * 1.5);
        index1 = p.floor(p.random(textForestBox.length));
        index2 = p.floor(p.random(textForestBox[index1].length));
        word = textForestBox[index1][index2];
        p.textSize(tSize);
        switch(parameters.textColor){
          case "random":
            p.fill(p.random(255), p.random(255), p.random(255));
            break;
          case "white":
            p.fill(255);
            break;
          case "red":
            p.fill(255, 0, 0);
            break;
          case "green":
            p.fill(0, 255, 0);
            break;
          case "blue":
            p.fill(0, 0, 255);
            break;
          case "yellow":
            p.fill(255, 255, 0);
            break;
          case "cyan":
            p.fill(0, 255, 255);
            break;
          case "magenta":
            p.fill(255, 0, 255);
            break;
          default:
            p.fill(p.random(255), p.random(255), p.random(255));
            break
        }
        p.text(word, p.random(-300, p.width - 300), y[i]);
      }
    };

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if(acceptedFiles[0]){
      setIsUploaded(true);
      p5Canvas = new p5(voicesOfEcriture); // p5.jsのキャンバスを生成
    }
  }, [acceptedFiles]);

  return (
    !isUploaded ?
    <>
      <Description />
      <section className="container">
        <div {...getRootProps({style})}>
          <input {...getInputProps()}
          // onChange = { e => handleFileText(e)}
          />
          <p>ドラッグ＆ドロップかクリックして、あなたの読書メモのテキストファイル(.txt)を１つアップロードしてください。</p>
        </div>
      </section>
    </> : 
    <Stack 
      spacing={0.5} 
      direction="column"  sx={{
      justifyContent: "center",
      alignItems: "flex-start",
      }}
      useFlexGap
    >
      <Button 
        variant="outlined"
        sx={{ 
          marginBottom: '15px',
          marginTop: '7px',
         }}
        onClick = {() => {  
          p5Canvas.remove();
          setIsUploaded(false);
        }}>
        ファイルを変更する
      </Button>
    </Stack>
  );
};

export default Sketch;