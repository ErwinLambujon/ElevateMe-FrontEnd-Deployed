import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import useTheme from '@mui/material/styles/useTheme';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import CheckCircle from '@mui/icons-material/CheckCircle';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';

const VennDiagramList = (props) => {
  const theme = useTheme();
  const buttons = [];
  for (let i = 0; i < 5; i++) {
    buttons.push(
      <Button
        key={i}
        variant='contained'
        sx={{
          fontWeight: 'normal',
          borderRadius: '32px',
        }}
      >
        Show
      </Button>
    );
  }
  return (
    <>
      <Box
        sx={{
          padding: '1rem',
        }}
      >
        <h1 style={{ color: theme.palette.primary.main }}>{props.type}</h1>
      </Box>
      <Box
        sx={{
          padding: '64px',
          borderRadius: '64px',
          backgroundColor: 'gray.main',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        {/* Left (checkboxes) */}
        <Box>
          <FormGroup>
            {/* NOTE(hans): Use array.map later */}
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked
                  icon={
                    <CheckCircleOutlined
                      sx={{ fill: theme.palette.primary.main }}
                    />
                  }
                  checkedIcon={<CheckCircle />}
                />
              }
              label='Inefficient waste collection'
            />
            <FormControlLabel
              control={
                <Checkbox
                  icon={
                    <CheckCircleOutlined
                      sx={{ fill: theme.palette.primary.main }}
                    />
                  }
                  checkedIcon={<CheckCircle />}
                />
              }
              label='Limited availability of recycled products'
            />
            <FormControlLabel
              control={
                <Checkbox
                  icon={
                    <CheckCircleOutlined
                      sx={{ fill: theme.palette.primary.main }}
                    />
                  }
                  checkedIcon={<CheckCircle />}
                />
              }
              label='Limited access to recycling'
            />
            <FormControlLabel
              control={
                <Checkbox
                  icon={
                    <CheckCircleOutlined
                      sx={{ fill: theme.palette.primary.main }}
                    />
                  }
                  checkedIcon={<CheckCircle />}
                />
              }
              label='Accumulation of waste'
            />
            <FormControlLabel
              control={
                <Checkbox
                  icon={
                    <CheckCircleOutlined
                      sx={{ fill: theme.palette.primary.main }}
                    />
                  }
                  checkedIcon={<CheckCircle />}
                />
              }
              label='Resource depletion'
            />
          </FormGroup>
        </Box>
        {/* Right (buttons) */}
        <Box flexDirection={'column'} display={'flex'} gap={'10px'}>
          {buttons}
        </Box>
      </Box>
    </>
  );
};

export default VennDiagramList;
