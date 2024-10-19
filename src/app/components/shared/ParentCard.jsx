'use client'
import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { Card, CardHeader, CardContent, Divider, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';

const ParentCard = ({ title, children, footer, codeModel, onEdit }) => {
  const customizer = useSelector((state) => state.customizer);

  const theme = useTheme();
  const borderColor = theme.palette.divider;

  return (
    <Card
      sx={{ padding: 0, border: !customizer.isCardShadow ? `1px solid ${borderColor}` : 'none' }}
      elevation={customizer.isCardShadow ? 9 : 0}
      variant={!customizer.isCardShadow ? 'outlined' : undefined}
    >
      <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
        <CardHeader title={title} action={codeModel}/>
        <Box sx={{display: 'flex', alignItems: 'center', pr: 2}}>
          {onEdit && (
            <EditIcon
              sx={{ cursor: 'pointer' }}
              onClick={onEdit}
            />
          )}
        </Box>
      </Box>
      <Divider />

      <CardContent>{children}</CardContent>
      {footer ? (
        <>
          <Divider />
          <Box p={3}>{footer}</Box>
        </>
      ) : (
        ''
      )}
    </Card>
  );
};

ParentCard.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  footer: PropTypes.node,
};

export default ParentCard;
