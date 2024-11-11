import { useState, useEffect } from 'react';
import scheduleService from '@/services/scheduleService';
import serviceCatalogService from '@/services/serviceCatalogService';
import addressService from '@/services/addressService';
import projectService from '@/services/projectService';
import { useSelector } from 'react-redux';
import axios from 'axios';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const formatTime = (time) => {
  if (!time) return null;
  const date = new Date(time);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

const useScheduleForm = (initialData, id) => {
  const user = useSelector((state) => state.user);
  const [serviceData, setServiceData] = useState(null);
  const [addressData, setAddressData] = useState(null);

  const [formData, setFormData] = useState({
    schedule_creator: user?.user?.id,
    category_id: null,
    service_id: null,
    project_id: null,
    schedule_agent_id: null,
    schedule_date: '',
    schedule_start_time: '',
    schedule_end_time: '',
    address_id: null,
    latitude: null,
    longitude: null,
    status: 'Pendente',
  });

  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      const initialStartTime = initialData.schedule_start_time;
      const currentDate = new Date();
      const [hours, minutes, seconds] = initialStartTime.split(':').map(Number);
      const startTime = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        hours,
        minutes,
        seconds,
      );

      setFormData({
        schedule_creator: initialData.schedule_creator || null,
        service_id: initialData.service.id || null,
        project_id: initialData.project || null,
        schedule_agent_id: initialData.schedule_agent.id || null,
        schedule_date: initialData.schedule_date || '',
        schedule_start_time: startTime || '',
        schedule_end_time: initialData.schedule_end_time || '',
        address_id: initialData.address?.id || null,
        latitude: initialData.latitude || null,
        longitude: initialData.longitude || null,
        status: initialData.status || 'Pendente',
      });
    }
  }, [initialData]);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      if (formData.service_id) {
        try {
          const serviceInfo = await serviceCatalogService.getServiceCatalogById(
            formData.service_id,
          );
          setServiceData(serviceInfo);
          setFormData((prev) => ({
            ...prev,
            category_id: serviceInfo.category.id,
          }));
        } catch (error) {
          console.error(`Erro ao buscar serviço com id ${formData.service_id}:`, error);
        }
      }
    };

    fetchServiceDetails();
  }, [formData.service_id]);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (formData.project_id) {
        try {
          const projectInfo = await projectService.getProjectById(formData.project_id);

          if (projectInfo?.addresses?.length > 0 && !formData.address_id) {
            setFormData((prev) => ({
              ...prev,
              address_id: projectInfo.addresses[0]?.id,
            }));
          }
        } catch (error) {
          console.error(`Erro ao buscar projeto com id ${formData.project_id}:`, error);
        }
      }
    };

    fetchProjectDetails();
  }, [formData.project_id]);

  useEffect(() => {
    const fetchAddressDetails = async () => {
      if (formData.address_id) {
        try {
          const addressInfo = await addressService.getAddressById(formData.address_id);
          setAddressData(addressInfo);
        } catch (error) {
          console.error(`Erro ao buscar endereço com id ${formData.address_id}:`, error);
        }
      }
    };

    fetchAddressDetails();
  }, [formData.address_id]);

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (addressData) {
        const addressString = `${addressData.street}, ${addressData.number}, ${addressData.neighborhood}, ${addressData.city}, ${addressData.state}, ${addressData.country}`;

        try {
          const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
            params: {
              address: addressString,
              key: GOOGLE_MAPS_API_KEY,
            },
          });

          if (response.data.status === 'OK') {
            const location = response.data.results[0].geometry.location;
            setFormData((prev) => ({
              ...prev,
              latitude: location.lat,
              longitude: location.lng,
            }));

            console.log('location: ', location);
          } else {
            console.error('Erro ao obter coordenadas:', response.data.status);
          }
        } catch (error) {
          console.error('Erro ao buscar coordenadas:', error);
        }
      }
    };

    fetchCoordinates();
  }, [addressData]);

  useEffect(() => {
    if (formData.schedule_start_time && serviceData) {
      const hoursToAddString = serviceData.deadline?.hours || '00:00:00';
      const [hours, minutes, seconds] = hoursToAddString.split(':').map(Number);

      const totalHoursToAdd = (hours || 0) + (minutes || 0) / 60 + (seconds || 0) / 3600;

      const startTime = new Date(formData.schedule_start_time);
      const updatedStartTime = new Date(startTime.getTime() + totalHoursToAdd * 3600000);

      setFormData((prev) => ({ ...prev, schedule_end_time: updatedStartTime.toISOString() }));
    }
  }, [formData.schedule_start_time, serviceData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const dataToSend = {
      schedule_creator: formData.schedule_creator,
      service_id: formData.service_id,
      project_id: formData.project_id,
      schedule_agent_id: formData.schedule_agent_id,
      schedule_date: formData.schedule_date,
      schedule_start_time: formatTime(formData.schedule_start_time),
      schedule_end_time: formatTime(formData.schedule_end_time),
      address_id: formData.address_id,
      latitude: formData.latitude,
      longitude: formData.longitude,
      status: formData.status,
      project: formData.project_id,
    };

    try {
      if (id) {
        await scheduleService.updateSchedule(id, dataToSend);
      } else {
        await scheduleService.createSchedule(dataToSend);
      }
      setFormErrors({});
      setSuccess(true);
    } catch (err) {
      setSuccess(false);
      setFormErrors(err.response?.data || {});
      console.error(err.response?.data || err);
    }
  };

  return {
    formData,
    handleChange,
    handleSave,
    formErrors,
    success,
  };
};

export default useScheduleForm;
