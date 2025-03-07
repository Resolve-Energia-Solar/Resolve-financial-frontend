import React, { useState, useEffect } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import apiClient from "@/services/apiClient";

const GenericAsyncAutocompleteInput = ({
  label,
  value,
  onChange,
  endpoint,
  queryParam = "search",
  extraParams = {},
  mapResponse,
  debounceTime = 300,
  ...props
}) => {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const handler = setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          [queryParam]: inputValue, // Pode ser vazio
          ...extraParams,
        });
        const page = 1;
        const limit = 10;
        const response = await apiClient.get(
          `${endpoint}?${params.toString()}`,
          { params: { page, limit } }
        );
        const data = response.data;
        const fetchedOptions = mapResponse ? mapResponse(data) : data.results || [];
        if (active) {
          setOptions(fetchedOptions);
        }
      } catch (error) {
        console.error("Error fetching options:", error);
      } finally {
        if (active) setLoading(false);
      }
    }, debounceTime);
    return () => {
      active = false;
      clearTimeout(handler);
    };
  }, [inputValue, endpoint, queryParam, extraParams, mapResponse, debounceTime]);
  
  return (
    <Autocomplete
      freeSolo
      options={options}
      getOptionLabel={(option) => option.label || ""}
      loading={loading}
      onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
      onChange={(event, newValue) => onChange(newValue)}
      value={value}
      loadingText="Carregando..."
      noOptionsText="Nenhum resultado encontrado, tente digitar algo ou mudar a pesquisa."
      {...props}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
          fullWidth
          margin="normal"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default GenericAsyncAutocompleteInput;
