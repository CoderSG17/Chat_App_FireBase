import * as React from 'react';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import IconButton from '@mui/joy/IconButton';
import Stack from '@mui/joy/Stack';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import CelebrationOutlinedIcon from '@mui/icons-material/CelebrationOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import { useState } from 'react';
import { ImCross } from "react-icons/im";
import { useAuth } from '../Context/Auth';
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import TextOptions from '../components/TextOptions';

export default function ChatBubble({ elem , createdAt,idx}) {
  const { text, img, caption, senderId, audioUrl , videoUrl , textStyles} = elem;

  const { userData } = useAuth()
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [showOptions,setShowOptions]= useState(false)
  const handleImageClick = () => {
    setIsImageModalOpen(true);
  };
  const isSent = senderId === userData.id ? true : false;

  return (
    <>
      <Box sx={{
        maxHeight: '60%', minWidth: 'auto'
      }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: 0.25 }}
        >
          <Sheet
            color={isSent ? 'primary' : 'neutral'}
            variant={isSent ? 'solid' : 'soft'}
            sx={{
              p: 1.25,
              borderRadius: 'lg',
              borderTopRightRadius: isSent ? 0 : 'lg',
              borderTopLeftRadius: isSent ? 'lg' : 0,
              backgroundColor: isSent
                ? 'var(--joy-palette-primary-solidBg)'
                : 'background.body',
            }}
            className="hover_ctn"
          >
  <MdOutlineKeyboardArrowDown style={{position:"absolute" ,  right:"0" , top:"0"}} className='hover_icon' onClick={()=>setShowOptions(!showOptions)}></MdOutlineKeyboardArrowDown>
          
          {
            showOptions?<TextOptions setShowOptions={setShowOptions} showOptions={showOptions} txt={text} senderId ={senderId} idx={idx} elem={elem}></TextOptions>:""
          }
            {img || caption || audioUrl || videoUrl ? (
              <>
                {img && (
                  <Typography
                    level="body-sm"
                    sx={{
                      color: "black",
                      textAlign: "left",
                      marginRight: "40px"
                    }}
                  >
                    <img src={img} alt="error" className="image" onClick={handleImageClick} />
                    {isImageModalOpen && (
                      <div className="image-modal">
                        <button className="close-button" onClick={() => setIsImageModalOpen(false)}><ImCross /></button>
                        <img src={img} alt="error" className="image-modal-content" />
                      </div>
                    )}
                  </Typography>
                )}
                {caption && (
                  <Typography sx={{ color: !isSent ? "black" : "white", textAlign: "left", fontSize: "16px" }}>
                    {caption}
                  </Typography>
                )}
                {audioUrl && (
                  <audio src={audioUrl} controls />
                )}
                {videoUrl && (
                  <video src={videoUrl} controls style={{ maxWidth: "100%", maxHeight: "300px" }} />
                )}
              </>
            ) : (
              <Typography
                level="body-sm"
                sx={{
                  color: isSent ? 'var(--joy-palette-common-white)' : 'var(--joy-palette-text-primary)',
                  textAlign: "left",
                  marginRight: "40px",
                  whiteSpace: 'pre-wrap',
                  fontWeight:textStyles?.isBold ?"bold":"",
                  textDecoration:textStyles?.isStrikeThrough ? "line-through" : "",
                  fontStyle:textStyles?.isItalic?"italic":""
                }}
              >
                {text}
              </Typography>
            )}

            <Typography sx={{ textAlign: "right", fontSize: "10px", color: !isSent ? "black" : "white" }}>{createdAt}</Typography>
          </Sheet>
        </Stack>
      </Box>
    </>
  )
}

