import React from 'react';
import { TableBody, TableRow, TableCell, Skeleton } from '@mui/material';

const TableSkeleton = ({ rows = 5, columns = 8 }) => {
  return (
    <TableBody>
      {Array.from(new Array(rows)).map((_, index) => (
        <TableRow key={index}>
          {Array.from(new Array(columns)).map((_, cellIndex) => (
            <TableCell key={cellIndex}>
              <Skeleton
                variant={cellIndex === 0 ? 'rectangular' : 'text'}
                width="100%"
                height={40}
                sx={{
                  borderRadius: 1,
                }}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
};

export default TableSkeleton;
