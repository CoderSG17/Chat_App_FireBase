import { IconButton } from '@mui/joy';
import React from 'react'
import { useState } from 'react';
import FormatBoldRoundedIcon from '@mui/icons-material/FormatBoldRounded';
import FormatItalicRoundedIcon from '@mui/icons-material/FormatItalicRounded';
import StrikethroughSRoundedIcon from '@mui/icons-material/StrikethroughSRounded';
import { useTextStyle } from '../Context/StylingContext';


const Styling = () => {
    const { toggleStyle,textStyle } = useTextStyle();


    return (
        <>
            <IconButton size="sm" variant="plain" color={textStyle.isBold ? "primary" : "neutral"} title='Bold' onClick={() => {
                toggleStyle('isBold')
            }}>
                <FormatBoldRoundedIcon />
            </IconButton>
            <IconButton size="sm" variant="plain" color={textStyle.isItalic ? "primary" : "neutral"} title='Italic' onClick={() => {
                toggleStyle('isItalic')
            }}>
                <FormatItalicRoundedIcon />
            </IconButton>
            <IconButton size="sm" variant="plain" color={textStyle.isStrikeThrough ? "primary" : "neutral"} title='StrikeThrough' onClick={() => {
                toggleStyle('isStrikeThrough')


            }}>
                <StrikethroughSRoundedIcon />
            </IconButton>
        </>
    )
}

export default Styling
