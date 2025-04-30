'use client';
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useDropzone } from 'react-dropzone';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import p5 from 'p5';
import Description from './description';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

let p5Canvas, textForest0;

// p5.jsのスケッチコンポーネント
const Sketch = () => {
  //設定変更のダイアログのコード
  const [open, setOpen] = React.useState(false);
  const [textColor, setTextColor] = React.useState('random');
  const [textBaseSize, setTextBaseSize] = React.useState(30);
  const [frameRate, setFrameRate] = React.useState(0.3);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleTextColorChange = (event) => {
    setTextColor(
      // @ts-expect-error autofill of arbitrary value is not handled.
      event.target.value,
    );
  };

  const handleTextBaseSizeChange = (event) => {
    setTextBaseSize(event.target.value);
  }

  const handleFrameRateChange = (event) => {
    setFrameRate(
      // @ts-expect-error autofill of arbitrary value is not handled.
      event.target.value,
    );
  }

  const updateCanvas = () => {
    const newParameters = {
      textBaseSize,
      textColor, 
      frameRate,
    };
    p5Canvas.remove();   
    p5Canvas = new p5((p) => voicesOfEcriture(p, newParameters)); // p5.jsのキャンバスを生成
    setOpen(false);
  }
  //ファイル変更のダイアログのコード
  const [alertOpen, setAlertOpen] = React.useState(false);

  const handleAlertOpen = () => {
    setAlertOpen(true);
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleAlertCloseAndRemove = () => {
    p5Canvas.remove();
    setTextColor('random');
    setTextBaseSize(30);
    setFrameRate(0.3);
    setAlertOpen(false);
    setIsUploaded(false);
  };

  //パラメータの初期値をセット
  const parameters = {
    textBaseSize,
    textColor,
    frameRate,
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
  const voicesOfEcriture = (p, params = parameters) => {  
    let word, roop, tSize, textForest;

    p.setup = () => {
      // セットアップ処理
      p.createCanvas(p.windowWidth-16, p.windowHeight);
      // noLoop();
      roop = 120;
      p.frameRate(params.frameRate);
    };
  
    p.draw = () => {
      let textForestBox = [];
      let y = [];
    
      let index1, index2;
      p.background(0);
      textForest = textForest0.split("。");
      textForest = p.shuffle(textForest);
    
      for (let i = 0; i < textForest.length; i++) {
        textForestBox[i] = textForest[i].split(/[\n\s]+/);
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
        tSize = p.random(params.textBaseSize / 2, params.textBaseSize * 1.5);
        index1 = p.floor(p.random(textForestBox.length));
        index2 = p.floor(p.random(textForestBox[index1].length));
        word = textForestBox[index1][index2];

        p.textSize(tSize);
        if(params.textColor === "random"){
          p.fill(p.random(255), p.random(255), p.random(255));
        }else{
          p.fill(params.textColor);
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
    <>
    <Stack 
      spacing={2} 
      direction="row"  sx={{
      justifyContent: "left",
      alignItems: "flex-start",
      }}
      useFlexGap
    >
      <Button 
        variant="contained"
        sx={{ 
          marginBottom: '15px',
          marginTop: '7px',
        }}
        onClick={handleClickOpen}>
        設定を変更する
      </Button>
      <Button 
        variant="outlined"
        sx={{ 
          marginBottom: '15px',
          marginTop: '7px',
          }}
        onClick = {handleAlertOpen}>
        ファイルを変更する
      </Button>
    </Stack>
    <Dialog
    open={alertOpen}
    onClose={handleAlertClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title">
      {"本当にファイルを変更しますか？"}
    </DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        テキストファイルをアップロードし直すと、設定は初期値に戻ります。現在の設定は保存されません。<br />
        TOPページに戻って、別のテキストファイルに変更しますか？
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button variant= "contained" onClick={handleAlertClose}>キャンセル</Button>
      <Button variant="outlined" onClick={handleAlertCloseAndRemove} autoFocus>
        変更する
      </Button>
    </DialogActions>
  </Dialog>
    
    <Dialog
        fullWidth={false}
        maxWidth={"md"}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>設定の変更</DialogTitle>
        <DialogContent>
          <DialogContentText>
            描画の設定を変更できます。変更後の設定内容を反映する場合は、Updateボタンを押してください。
          </DialogContentText>
          <Box
            noValidate
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              m: 'auto',
              width: 'fit-content',
            }}
          >
            <Stack 
              spacing={2} 
              direction="row"  sx={{
              justifyContent: "left",
              alignItems: "flex-start",
              }}
              useFlexGap
            >
              <FormControl sx={{ mt: 4, minWidth: 220 }}>
                <InputLabel htmlFor="text-color">文字の色</InputLabel>
                <Select
              
                  autoFocus
                  value={textColor}
                  onChange={handleTextColorChange}
                  label="文字の色"
                  inputProps={{
                    name: 'text-color',
                    id: 'text-color',
                  }}
                >
                  <MenuItem value="random">ランダム</MenuItem>
                  <MenuItem value="white">白</MenuItem>
                  <MenuItem value="red">赤</MenuItem>
                  <MenuItem value="green">緑</MenuItem>
                  <MenuItem value="blue">青</MenuItem>
                  <MenuItem value="yellow">黄</MenuItem>
                  <MenuItem value="cyan">シアン</MenuItem>
                  <MenuItem value="magenta">マゼンタ</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ mt: 4, minWidth: 220 }}>
              <InputLabel htmlFor="textBaseSize">文字の大きさの基準値</InputLabel>
              <Select
                autoFocus
                value={textBaseSize}
                onChange={handleTextBaseSizeChange}
                label="文字の大きさの基準値"
                inputProps={{
                  name: 'textBaseSize',
                  id: 'textBaseSize',
                }}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={30}>30</MenuItem>
                <MenuItem value={40}>40</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={60}>60</MenuItem>
                <MenuItem value={70}>70</MenuItem>
                <MenuItem value={80}>80</MenuItem>
                <MenuItem value={90}>90</MenuItem>
                <MenuItem value={100}>100</MenuItem>

              </Select>
            </FormControl>

            <FormControl sx={{ mt: 4, minWidth: 220 }}>
              <InputLabel htmlFor="frameRate">フレームレート</InputLabel>
              <Select
                autoFocus
                value={frameRate}
                onChange={handleFrameRateChange}
                label="フレームレート"
                inputProps={{
                  name: 'frameRate',
                  id: 'frameRate',
                }}
              >
                <MenuItem value={0.1}>1</MenuItem>
                <MenuItem value={0.2}>2</MenuItem>
                <MenuItem value={0.3}>3</MenuItem>
                <MenuItem value={0.4}>4</MenuItem>
                <MenuItem value={0.5}>5</MenuItem>
                <MenuItem value={0.6}>6</MenuItem>
                <MenuItem value={0.7}>7</MenuItem>
                <MenuItem value={0.8}>8</MenuItem>
                <MenuItem value={0.9}>9</MenuItem>
                <MenuItem value={1.0}>10</MenuItem>
              </Select>
            </FormControl>
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>キャンセル</Button>
          <Button variant="contained"onClick={updateCanvas}>更新</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Sketch;