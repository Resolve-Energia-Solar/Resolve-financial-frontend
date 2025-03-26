'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import BlankCard from '../../../../components/shared/BlankCard';
import { useSelector } from 'react-redux';
import {
  IconBrandFacebook,
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandTwitter,
  IconSearch,
} from '@tabler/icons-react';
import employeeService from '@/services/employeeService';
import { capitalizeWords } from '@/utils/capitalizeWords';

const SocialIcons = [
  { name: 'Facebook', icon: <IconBrandFacebook size="18" color="#1877F2" /> },
  { name: 'Instagram', icon: <IconBrandInstagram size="18" color="#D7336D" /> },
  { name: 'Github', icon: <IconBrandGithub size="18" color="#006097" /> },
  { name: 'Twitter', icon: <IconBrandTwitter size="18" color="#1C9CEA" /> },
];

const FriendsCard = ({ user }) => {
  const currentUser = user;
  const [employees, setEmployees] = useState([]);
  const [employeesCount, setEmployeesCount] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchEmployees();
  }, [currentUser, page]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        if (hasMore && !loading) {
          setPage((prevPage) => prevPage + 1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading]);

  const fetchEmployees = async () => {
    if (currentUser && currentUser.employee?.department?.id) {
      try {
        setLoading(true);
        const data = await employeeService.index({
          filters: {
            department: currentUser.employee?.department?.id,
            expand: 'user,department,role',
            fields:
              'user.complete_name,user.profile_picture,user.username,role.name,department.name',
          },
          page: page,
          limit: 10,
        });
        setEmployeesCount(data.count);
        setEmployees((prevEmployees) => [...prevEmployees, ...data.results]);
        setHasMore(data.next !== null);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
  };

  const filteredEmployees = employees.filter((profile) =>
    profile.user.complete_name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Grid container spacing={3}>
      <Grid item sm={12} lg={12}>
        <Stack direction="row" alignItems="center" mt={2}>
          <Box>
            <Typography variant="h3">
              Colegas &nbsp;
              <Chip label={employeesCount} color="secondary" size="small" />
            </Typography>
          </Box>
          <Box ml="auto">
            <TextField
              id="outlined-search"
              placeholder="Pesquisar Colegas"
              size="small"
              type="search"
              variant="outlined"
              inputProps={{ 'aria-label': 'Search Friends' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconSearch size="14" />
                  </InputAdornment>
                ),
              }}
              fullWidth
              onChange={(e) => setSearch(e.target.value)}
            />
          </Box>
        </Stack>
      </Grid>
      {filteredEmployees.map((profile) => (
        <Grid item sm={12} lg={4} key={profile.id}>
          <Link
            href={`/apps/user-profile/${profile.user.username}`}
            style={{ textDecoration: 'none' }}
          >
            <BlankCard
              className="hoverCard"
              sx={{
                height: '300px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <CardContent>
                <Stack direction="column" gap={2} alignItems="center">
                  <Avatar
                    alt={profile.user.complete_name}
                    src={profile.user.profile_picture || '/images/default-avatar.png'}
                    sx={{ width: '80px', height: '80px' }}
                  />
                  <Box textAlign="center">
                    <Typography variant="h5">
                      {capitalizeWords(profile.user.complete_name)}
                    </Typography>
                    <Typography variant="caption">
                      {profile.user.employee_data?.role || 'Cargo'}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
              <Divider />
              <Box p={2} py={1} textAlign="center" sx={{ backgroundColor: 'grey.100' }}>
                {SocialIcons.map((sicon) => (
                  <IconButton key={sicon.name}>{sicon.icon}</IconButton>
                ))}
              </Box>
            </BlankCard>
          </Link>
        </Grid>
      ))}
      {loading &&
        Array.from(new Array(6)).map((_, index) => (
          <Grid item sm={12} lg={4} key={index}>
            <Skeleton variant="rectangular" width="100%" height={300} />
          </Grid>
        ))}
      {!hasMore && !loading && (
        <Typography variant="body2" color="textSecondary" align="center" sx={{ width: '100%' }}>
          Você chegou ao fim!
        </Typography>
      )}
    </Grid>
  );
};

export default FriendsCard;
