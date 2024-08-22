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
import { useAuth } from '../components/Auth';

export default function ChatBubble({ text, createdAt, image, caption ,senderId}) {
  const {userData} = useAuth()
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const handleImageClick = () => {
    setIsImageModalOpen(true);
  };
  const isSent = senderId===userData.id ? true : false;
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
          >

            {image || caption ? <><Typography
              level="body-sm"
              sx={{
                color:"black",
                textAlign: "left",
                marginRight: "40px"

              }}
            >
              <img src={image} alt="error" className='image' onClick={handleImageClick} />
              {isImageModalOpen && (
                <div className="image-modal">
                  <button className="close-button" onClick={() => setIsImageModalOpen(false)}><ImCross /></button>
                  <img src={image} alt="error" className="image-modal-content" />
                </div>
              )}
            </Typography>
              <Typography sx={{ color: !isSent ? "black" : "white", textAlign: "left", fontSize: "16px" }}>{caption}</Typography>
            </>
              : <Typography
                level="body-sm"
                sx={{
                  color: isSent
                    ? 'var(--joy-palette-common-white)'
                    : 'var(--joy-palette-text-primary)',
                  textAlign: "left",
                  marginRight: "40px"

                }}
              >
                {text}
              </Typography>}
            <Typography sx={{textAlign: "right", fontSize: "10px" , color: !isSent ? "black" : "white" }}>{createdAt}</Typography>
          </Sheet>
        </Stack>
      </Box>
    </>
  )
}

