import { useState, useEffect } from 'react';
import scheduleService from '@/services/scheduleService';
import serviceCatalogService from '@/services/serviceCatalogService';
import addressService from '@/services/addressService';
import userService from '@/services/userService';
import { useSelector } from 'react-redux';
import axios from 'axios';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const useScheduleForm = (initialData, id) => {
  const user = useSelector((state) => state.user);
  const [serviceData, setServiceData] = useState(null);
  const [addressData, setAddressData] = useState(null);

  const [formData, setFormData] = useState({
    schedule_creator: user?.user?.id,
    category_id: null,
    service_id: null,
    customer_id: null,
    project_id: null,
    schedule_agent_id: null,
    products_ids: [],
    schedule_date: '',
    schedule_start_time: '', // Horário no formato HH:mm:ss vindo do <select>
    schedule_end_time: '',
    address_id: null,
    latitude: null,
    longitude: null,
    status: 'Pendente',
    observation: '',
    going_to_location_at: null,
    execution_started_at: null,
    execution_finished_at: null,
  });

  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        schedule_creator: initialData.schedule_creator || null,
        service_id: initialData.service?.id || null,
        customer_id: initialData?.customer?.id || null,
        project_id: initialData.project?.id || null,
        schedule_agent_id: initialData.schedule_agent?.id || null,
        products_ids: initialData.products_ids || [],
        schedule_date: initialData.schedule_date || '',
        schedule_start_time: initialData.schedule_start_time || '', // Formato esperado já é HH:mm:ss
        schedule_end_time: initialData.schedule_end_time || '',
        address_id: initialData?.address?.id || null,
        latitude: initialData.latitude || null,
        longitude: initialData.longitude || null,
        status: initialData.status || 'Pendente',
        observation: initialData.observation || '',
        going_to_location_at: initialData.going_to_location_at || null,
        execution_started_at: initialData.execution_started_at || null,
        execution_finished_at: initialData.execution_finished_at || null,
      });
      setAddressData(initialData.address || null);
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
    const fetchCustomerDetails = async () => {
      if (formData.customer_id) {
        try {
          const customerInfo = await userService.getUserById(formData.customer_id);
          console.log('CustomerInfo: ', customerInfo);

          if (customerInfo?.addresses?.length > 0 && !formData.address_id) {
            setFormData((prev) => ({
              ...prev,
              address_id: customerInfo.addresses[0]?.id,
            }));
          }
        } catch (error) {
          console.error(`Erro ao buscar cliente com id ${formData.customer_id}:`, error);
        }
      }
    };

    fetchCustomerDetails();
  }, [formData.customer_id]);

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

      const [startHours, startMinutes, startSeconds] = formData.schedule_start_time.split(':').map(Number);

      const startDate = new Date();
      startDate.setHours(startHours, startMinutes, startSeconds || 0);

      const updatedStartTime = new Date(startDate.getTime() + totalHoursToAdd * 3600000);

      if (!isNaN(updatedStartTime.getTime())) {
        setFormData((prev) => ({
          ...prev,
          schedule_end_time: `${updatedStartTime.getHours().toString().padStart(2, '0')}:${updatedStartTime.getMinutes()
            .toString()
            .padStart(2, '0')}:${updatedStartTime.getSeconds().toString().padStart(2, '0')}`,
        }));
      } else {
        console.error('Erro ao calcular a data final: resultado inválido');
      }
    }
  }, [formData.schedule_start_time, serviceData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (
      field === 'service_id' ||
      field === 'schedule_start_time' ||
      field === 'schedule_date' ||
      field === 'address_id'
    ) {
      setFormData((prev) => ({ ...prev, schedule_agent_id: null }));
    }
  };

  const handleSave = async () => {
    const dataToSend = {
      schedule_creator: formData.schedule_creator,
      service_id: formData.service_id,
      customer_id: formData.customer_id,
      products_ids: formData.products_ids,
      schedule_date: formData.schedule_date,
      schedule_start_time: formData.schedule_start_time, // Já no formato HH:mm:ss
      schedule_end_time: formData.schedule_end_time,
      address_id: formData.address_id,
      latitude: formData.latitude,
      longitude: formData.longitude,
      status: formData.status,
      observation: formData.observation,
      going_to_location_at: formData.going_to_location_at,
      execution_started_at: formData.execution_started_at,
      execution_finished_at: formData.execution_finished_at,
    };

    if (formData.project_id) {
      dataToSend.project_id = formData.project_id;
    }

    if (formData.schedule_agent_id !== null) {
      dataToSend.schedule_agent_id = formData.schedule_agent_id;
    }

    console.log('Data to send: ', dataToSend);

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
