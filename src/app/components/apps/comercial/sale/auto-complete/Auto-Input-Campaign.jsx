'use client';
import { Fragment, useCallback, useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import campaignService from '@/services/campaignService'; 
import { debounce } from 'lodash';

export default function AutoCompleteCampaign({ onChange, value, error, helperText }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  useEffect(() => {
    const fetchDefaultCampaign = async () => {
      if (value) {
        try {
          const campaign = await campaignService.getCampaignById(value);
          if (campaign) {
            setSelectedCampaign({ id: campaign.id, name: campaign.name });
          }
        } catch (error) {
          console.error('Erro ao buscar campanha:', error);
        }
      }
    };

    fetchDefaultCampaign();
  }, [value]);

  const handleChange = (event, newValue) => {
    setSelectedCampaign(newValue);
    if (newValue) {
      onChange(newValue.id);
    } else {
      onChange(null);
    }
  };

  const fetchCampaignsByName = useCallback(
    debounce(async (name) => {
      if (!name) return;
      setLoading(true);
      try {
        const campaigns = await campaignService.getCampaigns();
        const filteredCampaigns = campaigns.results.filter(campaign =>
          campaign.name.toLowerCase().includes(name.toLowerCase())
        );
        const formattedCampaigns = filteredCampaigns.map(campaign => ({
          id: campaign.id,
          name: campaign.name,
        }));
        setOptions(formattedCampaigns);
      } catch (error) {
        console.error('Erro ao buscar campanhas:', error);
      }
      setLoading(false);
    }, 300), 
    []
  );

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOptions([]);
  };

  return (
    <div>
      <Autocomplete
        sx={{ width: '100%' }}
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        isOptionEqualToValue={(option, value) => option.name === value.name}
        getOptionLabel={(option) => option.name}
        options={options}
        loading={loading}
        value={selectedCampaign}
        onInputChange={(event, newInputValue) => {
          fetchCampaignsByName(newInputValue);
        }}
        onChange={handleChange}
        renderInput={(params) => (
          <CustomTextField
            error={error}
            helperText={helperText}
            {...params}
            size="small"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </Fragment>
              ),
            }}
          />
        )}
      />
    </div>
  );
}
