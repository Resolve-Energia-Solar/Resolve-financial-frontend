"use client";

import { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  TextField,
  MenuItem,
  Button,
  IconButton,
  Typography,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GenericAsyncAutocompleteInput from "./GenericAsyncAutocompleteInput";
import CustomFormLabel from "../forms/theme-elements/CustomFormLabel";

// Componente para intervalos (range)
const RangeInput = ({ label, value, onChange, inputType = "text" }) => {
  const handleStartChange = (e) => {
    onChange({ ...value, start: e.target.value });
  };

  const handleEndChange = (e) => {
    onChange({ ...value, end: e.target.value });
  };

  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      <TextField
        label={`${label} (Início)`}
        type={inputType}
        value={value?.start || ""}
        onChange={handleStartChange}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label={`${label} (Fim)`}
        type={inputType}
        value={value?.end || ""}
        onChange={handleEndChange}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
    </Box>
  );
};

// Componente específico para intervalos numéricos (lado a lado)
const NumberRangeInput = ({ label, value, onChange }) => {
  const handleMinChange = (e) => {
    onChange({ ...value, min: e.target.value });
  };

  const handleMaxChange = (e) => {
    onChange({ ...value, max: e.target.value });
  };

  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      <TextField
        label={`${label} Mínimo`}
        type="number"
        value={value?.min || ""}
        onChange={handleMinChange}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label={`${label} Máximo`}
        type="number"
        value={value?.max || ""}
        onChange={handleMaxChange}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
    </Box>
  );
};

const GenericFilterDrawer = ({ filters, initialValues, onApply, open, onClose }) => {
  const [filterValues, setFilterValues] = useState({});

  // Função para retornar os valores padrão (reset)
  const getDefaultValues = () => {
    const defaultValues = {};
    filters.forEach((filterConfig) => {
      if (filterConfig.type === "async-multiselect") {
        defaultValues[filterConfig.key] = [];
      } else if (filterConfig.type === "number-range") {
        defaultValues[filterConfig.key] = { min: "", max: "" };
      } else if (filterConfig.type === "range") {
        defaultValues[filterConfig.key] = { start: "", end: "" };
      } else if (filterConfig.type === "multiselect") {
        defaultValues[filterConfig.key] = [];
      } else {
        defaultValues[filterConfig.key] = "";
      }
    });
    return defaultValues;
  };

  useEffect(() => {
    if (open) {
      setFilterValues((prev) => {
        if (Object.keys(prev).length > 0) return prev;
        const defaultValues = {};
        filters.forEach((filterConfig) => {
          if (filterConfig.type === "number-range") {
            if (
              initialValues &&
              initialValues[filterConfig.subkeys.min] !== undefined &&
              initialValues[filterConfig.subkeys.max] !== undefined
            ) {
              defaultValues[filterConfig.key] = {
                min: initialValues[filterConfig.subkeys.min],
                max: initialValues[filterConfig.subkeys.max],
              };
            } else {
              defaultValues[filterConfig.key] = { min: "", max: "" };
            }
          } else if (filterConfig.type === "range") {
            if (initialValues && initialValues[filterConfig.key]) {
              if (typeof initialValues[filterConfig.key] === "object") {
                defaultValues[filterConfig.key] = initialValues[filterConfig.key];
              } else if (typeof initialValues[filterConfig.key] === "string") {
                const [start, end] = initialValues[filterConfig.key].split(",");
                defaultValues[filterConfig.key] = { start: start || "", end: end || "" };
              }
            } else {
              defaultValues[filterConfig.key] = { start: "", end: "" };
            }
          } else if (filterConfig.type === "multiselect" || filterConfig.type === "async-multiselect") {
            if (initialValues && initialValues[filterConfig.key] !== undefined) {
              defaultValues[filterConfig.key] = Array.isArray(initialValues[filterConfig.key])
                ? initialValues[filterConfig.key]
                : initialValues[filterConfig.key] === ""
                  ? []
                  : initialValues[filterConfig.key].split(",");
            } else {
              defaultValues[filterConfig.key] = [];
            }
          } else {
            defaultValues[filterConfig.key] = initialValues && initialValues[filterConfig.key]
              ? initialValues[filterConfig.key]
              : "";
          }
        });
        return defaultValues;
      });
    }
  }, [initialValues, filters, open]);

  const handleChange = (key, value) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    const defaults = getDefaultValues();
    setFilterValues(defaults);
    onApply(defaults);
    onClose();
  };

  const handleApply = () => {
    const transformedFilters = {};
    filters.forEach((filterConfig) => {
      if (filterConfig.type === "number-range") {
        const val = filterValues[filterConfig.key] || {};
        transformedFilters[filterConfig.subkeys.min] = val.min;
        transformedFilters[filterConfig.subkeys.max] = val.max;
      } else if (filterConfig.type === "async-multiselect") {
        const selected = filterValues[filterConfig.key];
        transformedFilters[filterConfig.key] = Array.isArray(selected)
          ? selected.map(item => item.value).join(",")
          : "";
      } else if (filterConfig.type === "range") {
        const val = filterValues[filterConfig.key] || { start: "", end: "" };
        transformedFilters[filterConfig.key] = (val.start || val.end) ? `${val.start},${val.end}` : "";
      } else if (filterConfig.type === "multiselect") {
        const val = filterValues[filterConfig.key];
        transformedFilters[filterConfig.key] = Array.isArray(val) ? val.join(",") : val;
      } else if (filterConfig.type === "async-autocomplete") {
        const selected = filterValues[filterConfig.key];
        transformedFilters[filterConfig.key] = selected && selected.value ? selected.value : "";
      } else {
        transformedFilters[filterConfig.key] = filterValues[filterConfig.key];
      }
    });
    onApply(transformedFilters);
    onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 600, height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Área de conteúdo scrollável */}
        <Box sx={{ flex: 1, overflowY: "auto", pr: 2, pl: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6">Filtros</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Grid container spacing={2}>
            {filters.map((filterConfig) => {
              if (filterConfig.type === "select") {
                return (
                  <Grid item xs={12} key={filterConfig.key}>
                    <CustomFormLabel>{filterConfig.label}</CustomFormLabel>
                    <TextField
                      value={filterValues[filterConfig.key] || ""}
                      onChange={(e) => handleChange(filterConfig.key, e.target.value)}
                      fullWidth
                      margin="normal"
                      select
                    >
                      {filterConfig.options?.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                );
              } else if (filterConfig.type === "multiselect") {
                return (
                  <Grid item xs={12} key={filterConfig.key}>
                    <CustomFormLabel>{filterConfig.label}</CustomFormLabel>
                    <TextField
                      value={filterValues[filterConfig.key] || []}
                      onChange={(e) => handleChange(filterConfig.key, e.target.value)}
                      fullWidth
                      margin="normal"
                      select
                      SelectProps={{ multiple: true }}
                    >
                      {filterConfig.options?.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                );
              } else if (filterConfig.type === "range") {
                const inputType = filterConfig.inputType || "text";
                return (
                  <Grid item xs={12} key={filterConfig.key}>
                    <CustomFormLabel>{filterConfig.label}</CustomFormLabel>
                    <RangeInput
                      label={filterConfig.label}
                      value={filterValues[filterConfig.key] || { start: "", end: "" }}
                      onChange={(value) => handleChange(filterConfig.key, value)}
                      inputType={inputType}
                    />
                  </Grid>
                );
              } else if (filterConfig.type === "async-multiselect") {
                return (
                  <Grid item xs={12} key={filterConfig.key}>
                    <CustomFormLabel>{filterConfig.label}</CustomFormLabel>
                    <GenericAsyncAutocompleteInput
                      label={filterConfig.label}
                      value={filterValues[filterConfig.key] || []}
                      onChange={(newValue) => handleChange(filterConfig.key, newValue)}
                      endpoint={filterConfig.endpoint}
                      queryParam={filterConfig.queryParam}
                      extraParams={filterConfig.extraParams}
                      mapResponse={filterConfig.mapResponse}
                      multiple
                    />
                  </Grid>
                );
              } else if (filterConfig.type === "number-range") {
                return (
                  <Grid item xs={12} key={filterConfig.key}>
                    <CustomFormLabel>{filterConfig.label}</CustomFormLabel>
                    <NumberRangeInput
                      label={filterConfig.label}
                      value={filterValues[filterConfig.key] || { min: "", max: "" }}
                      onChange={(value) => handleChange(filterConfig.key, value)}
                    />
                  </Grid>
                );
              } else if (filterConfig.type === "date") {
                return (
                  <Grid item xs={12} key={filterConfig.key}>
                    <CustomFormLabel>{filterConfig.label}</CustomFormLabel>
                    <TextField
                      label={filterConfig.label}
                      type="date"
                      value={filterValues[filterConfig.key] || ""}
                      onChange={(e) => handleChange(filterConfig.key, e.target.value)}
                      fullWidth
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                );
              } else if (filterConfig.type === "async-autocomplete") {
                return (
                  <Grid item xs={12} key={filterConfig.key}>
                    <CustomFormLabel>{filterConfig.label}</CustomFormLabel>
                    <GenericAsyncAutocompleteInput
                      label={filterConfig.label}
                      value={filterValues[filterConfig.key] || null}
                      onChange={(newValue) => handleChange(filterConfig.key, newValue)}
                      endpoint={filterConfig.endpoint}
                      queryParam={filterConfig.queryParam}
                      extraParams={filterConfig.extraParams}
                      mapResponse={filterConfig.mapResponse}
                    />
                  </Grid>
                );
              } else {
                return (
                  <Grid item xs={12} key={filterConfig.key}>
                    <CustomFormLabel>{filterConfig.label}</CustomFormLabel>
                    <TextField
                      label={filterConfig.label}
                      value={filterValues[filterConfig.key] || ""}
                      onChange={(e) => handleChange(filterConfig.key, e.target.value)}
                      fullWidth
                      margin="normal"
                      type={filterConfig.type === "number" ? "number" : "text"}
                    />
                  </Grid>
                );
              }
            })}
          </Grid>
        </Box>
        {/* Área fixa dos botões */}
        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            backgroundColor: "background.paper",
            p: 2,
            boxShadow: 3,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={resetFilters}
              >
                Limpar Filtros
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleApply}
              >
                Aplicar
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Drawer>
  );
};

export default GenericFilterDrawer;
