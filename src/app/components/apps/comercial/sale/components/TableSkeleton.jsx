import { TableRow, TableCell, Skeleton } from '@mui/material';

const TableSkeleton = ({ rows = 1, columns = 6, columnConfigs }) => {
  // Se não for passado um array de configurações, criamos uma configuração padrão para cada coluna.
  // Por padrão, usamos o variant "text" com largura 100px e altura 24px.
  const defaultConfigs = Array.from({ length: columns }).map(() => ({
    width: 100,
    height: 24,
    variant: 'text',
  }));

  // Se o usuário fornecer columnConfigs, usamos esse valor; caso contrário, usamos defaultConfigs.
  const configs = columnConfigs || defaultConfigs;

  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {configs.map((col, colIndex) => (
            <TableCell key={colIndex} align="center">
              {col.variant === 'circular' ? (
                <Skeleton variant="circular" width={col.size || 24} height={col.size || 24} />
              ) : (
                <Skeleton variant="text" width={col.width} height={col.height} />
              )}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

export default TableSkeleton;
