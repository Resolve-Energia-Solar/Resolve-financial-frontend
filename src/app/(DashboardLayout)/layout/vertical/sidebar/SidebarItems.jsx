import Menuitems from './MenuItems';
import { usePathname } from "next/navigation";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useDispatch, useSelector } from 'react-redux';
import NavItem from './NavItem';
import NavCollapse from './NavCollapse';
import NavGroup from './NavGroup/NavGroup';
import { toggleMobileSidebar } from '@/store/customizer/CustomizerSlice';

const SidebarItems = () => {
  const pathname = usePathname();
  const pathDirect = pathname;
  const pathWithoutLastPart = pathname.slice(0, pathname.lastIndexOf('/'));
  const customizer = useSelector((state) => state.customizer);
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const hideMenu = lgUp ? customizer.isCollapse && !customizer.isSidebarHover : '';
  const dispatch = useDispatch();
  const userPermissions = useSelector((state) => state.user.permissions);

  const hasPermission = (permissions) => {
    if (!permissions) return true; 
    return permissions.some(permission => userPermissions?.includes(permission));

  };

  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav">
        {Menuitems.map((item) => {
          if (!hasPermission(item.permissions)) {
            return null; 
          }

          if (item.subheader) {
            return (
              <NavGroup 
                item={item} 
                hideMenu={hideMenu} 
                key={item.subheader} 
                sx={{
                  backgroundColor: 'info.main',
                  borderRadius: '4px',
                }}
              />
            );

          } else if (item.children) {
            return (
              <NavCollapse
                menu={item}
                pathDirect={pathDirect}
                hideMenu={hideMenu}
                pathWithoutLastPart={pathWithoutLastPart}
                level={1}
                key={item.id}
                sx={{
                  backgroundColor: 'info.main',
                  padding: '10px 20px',
                }}
                onClick={() => dispatch(toggleMobileSidebar())}
              />
            );

          } else {
            return (
              <NavItem 
                item={item} 
                key={item.id} 
                pathDirect={pathDirect} 
                hideMenu={hideMenu} 
                sx={{
                  padding: '10px 20px',
                }}
                onClick={() => dispatch(toggleMobileSidebar())}
              />
            );
          }
        })}
      </List>
    </Box>
  );
};

export default SidebarItems;
