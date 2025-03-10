import { Box, TableSortLabel as TableSortLabelMUI, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
const TableSortLabel = ({ label, orderBy, orderDirection, headCell, onRequestSort }) => {
  const createSortHandler = (property) => (event) => {
    onRequestSort(property);
  };
  return (
    <TableSortLabelMUI
      active={orderBy === headCell}
      direction={orderBy === headCell ? orderDirection : 'asc'}
      onClick={createSortHandler(headCell)}
    >
      <Typography variant="subtitle1" fontWeight="500">
        {label}
      </Typography>
      {orderBy === headCell ? (
        <Box component="span" sx={visuallyHidden}>
          {orderDirection === 'desc' ? 'sorted descending' : 'sorted ascending'}
        </Box>
      ) : null}
    </TableSortLabelMUI>
  );
};

export default TableSortLabel;
