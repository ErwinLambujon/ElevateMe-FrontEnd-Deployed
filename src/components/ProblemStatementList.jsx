import React from 'react';
import ProblemStatement from './ProblemStatement';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const ProblemStatementList = (props) => {
  return (
    <>
      <Box
        display={'flex'}
        flexDirection={'column'}
        gap={'12px'}
        marginBottom={'24px'}
      >
        {props.list.map((statement, index) => (
          <ProblemStatement key={index}>{statement}</ProblemStatement>
        ))}
      </Box>
      {/* Move this button to the right */}
      <Button
        variant='contained'
        sx={{
          float: 'right',
          paddingTop: '8px',
          paddingBottom: '8px',
          paddingLeft: '30px',
          paddingRight: '30px',
          borderRadius: '32px',
          fontWeight: 'normal',
        }}
      >
        Add
      </Button>
    </>
  );
};

export default ProblemStatementList;
