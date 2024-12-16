import React from 'react';
import Box from '@mui/material/Box';
import CircleIcon from '@mui/icons-material/Circle';
import useTheme from '@mui/material/styles/useTheme';

const ProblemStatement = (props) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: '8px',
        alignItems: 'center',
      }}
    >
      <CircleIcon sx={{ fill: theme.palette.primary.main }} />
      <Box
        sx={{
          width: '100%',
          backgroundColor: 'gray.main',
          padding: '16px',
          borderRadius: '20px',
        }}
      >
        {props.children}
      </Box>
    </Box>
  );
};

export default ProblemStatement;
