import { useState, useEffect } from 'react'
import scheduleService from '@/services/scheduleService'
import serviceCatalogService from '@/services/serviceCatalogService'
import addressService from '@/services/addressService'
import userService from '@/services/userService'
import { useSelector } from 'react-redux'
import axios from 'axios'

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

const useScheduleForm = (initialData, id) => {
  const user = useSelector(state => state.user)
  const [serviceData, setServiceData] = useState(null)
  const [addressData, setAddressData] = useState(null)

  const [formData, setFormData] = useState({
    schedule_creator: user?.user?.id,
    category_id: null,
    service_id: null,
    customer_id: null,
    project_id: null,
    schedule_agent_id: null,
    products: [],
    schedule_date: '',
    schedule_start_time: '',
    schedule_end_date: '',
    schedule_end_time: '',
    address_id: null,
    latitude: null,
    longitude: null,
    status: 'Pendente',
    observation: '',
    going_to_location_at: null,
    execution_started_at: null,
    execution_finished_at: null,
    service_opinion: null,
    final_service_opinion_id: null,
  })

  const [formErrors, setFormErrors] = useState({})
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData({
        schedule_creator: initialData.schedule_creator || null,
        service_id: initialData.service?.id || null,
        customer_id: initialData?.customer?.id || null,
        project_id: initialData.project?.id || null,
        schedule_agent_id: initialData.schedule_agent?.id || null,
        products: initialData.products || [],
        schedule_date: initialData.schedule_date || '',
        schedule_start_time: initialData.schedule_start_time || '',
        schedule_end_date: initialData.schedule_end_date || '',
        schedule_end_time: initialData.schedule_end_time || '',
        address_id: initialData?.address?.id || null,
        latitude: initialData.latitude || null,
        longitude: initialData.longitude || null,
        status: initialData.status || 'Pendente',
        observation: initialData.observation || '',
        going_to_location_at: initialData.going_to_location_at || null,
        execution_started_at: initialData.execution_started_at || null,
        execution_finished_at: initialData.execution_finished_at || null,
        service_opinion: initialData.service_opinion || null,
        final_service_opinion_id:
          initialData.final_service_opinion?.id || initialData.service_opinion?.id || null,
      })
      setAddressData(initialData.address || null)
    }
  }, [initialData])

  useEffect(() => {
    const fetchServiceDetails = async () => {
      if (formData.service_id) {
        try {
          const serviceInfo = await serviceCatalogService.getServiceCatalogById(formData.service_id)
          setServiceData(serviceInfo)
          setFormData(prev => ({
            ...prev,
            category_id: serviceInfo.category.id,
          }))
        } catch (error) {
          console.error(`Erro ao buscar serviço com id ${formData.service_id}:`, error)
        }
      }
    }

    fetchServiceDetails()
  }, [formData.service_id])

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      if (formData.customer_id) {
        try {
          const customerInfo = await userService.getUserById(formData.customer_id)

          if (customerInfo?.addresses?.length > 0 && !formData.address_id) {
            setFormData(prev => ({
              ...prev,
              address_id: customerInfo.addresses[0]?.id,
            }))
          }
        } catch (error) {
          console.error(`Erro ao buscar cliente com id ${formData.customer_id}:`, error)
        }
      }
    }

    fetchCustomerDetails()
  }, [formData.customer_id])

  useEffect(() => {
    const fetchAddressDetails = async () => {
      if (formData.address_id) {
        try {
          const addressInfo = await addressService.getAddressById(formData.address_id)
          setAddressData(addressInfo)
        } catch (error) {
          console.error(`Erro ao buscar endereço com id ${formData.address_id}:`, error)
        }
      }
    }

    fetchAddressDetails()
  }, [formData.address_id])

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (addressData) {
        const addressString = `${addressData.street}, ${addressData.number}, ${addressData.neighborhood}, ${addressData.city}, ${addressData.state}, ${addressData.country}`

        try {
          const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
            params: {
              address: addressString,
              key: GOOGLE_MAPS_API_KEY,
            },
          })

          if (response.data.status === 'OK') {
            const location = response.data.results[0].geometry.location
            setFormData(prev => ({
              ...prev,
              latitude: location.lat,
              longitude: location.lng,
            }))
          } else {
            console.error('Erro ao obter coordenadas:', response.data.status)
          }
        } catch (error) {
          console.error('Erro ao buscar coordenadas:', error)
        }
      }
    }

    fetchCoordinates()
  }, [addressData])

  useEffect(() => {
    if (formData.schedule_date && formData.schedule_start_time && serviceData?.deadline?.hours) {
      try {
        let normalizedTime

        // Normaliza o formato de horário
        if (typeof formData.schedule_start_time === 'string') {
          // Se já for string no formato `hh:mm` ou `hh:mm:ss`, mantém
          normalizedTime = formData.schedule_start_time.includes(':')
            ? formData.schedule_start_time
            : `${formData.schedule_start_time}:00`
        } else if (formData.schedule_start_time instanceof Date) {
          // Converte Date para string no formato `hh:mm:ss`
          normalizedTime = `${formData.schedule_start_time
            .getHours()
            .toString()
            .padStart(2, '0')}:${formData.schedule_start_time
            .getMinutes()
            .toString()
            .padStart(2, '0')}:${formData.schedule_start_time
            .getSeconds()
            .toString()
            .padStart(2, '0')}`
        } else {
          throw new Error('Formato inválido de schedule_start_time')
        }

        // Divide o horário em partes
        const [startHours, startMinutes, startSeconds] = normalizedTime.split(':').map(Number)

        // Verifica se os valores extraídos são válidos
        if (isNaN(startHours) || isNaN(startMinutes)) {
          throw new Error('Horário inicial inválido')
        }

        // Extrai a data do agendamento
        const [year, month, day] = formData.schedule_date.split('-').map(Number)

        // Verifica se a data extraída é válida
        if (isNaN(year) || isNaN(month) || isNaN(day)) {
          throw new Error('Data de agendamento inválida')
        }

        const startDate = new Date(
          year,
          month - 1,
          day,
          startHours,
          startMinutes,
          startSeconds || 0,
        )

        // Verifica se o objeto Date é válido
        if (isNaN(startDate.getTime())) {
          throw new Error('Data inicial inválida')
        }

        // Converte o prazo em milissegundos
        const [durationHours, durationMinutes, durationSeconds] = serviceData.deadline.hours
          .split(':')
          .map(Number)

        // Verifica se os valores do prazo são válidos
        if (isNaN(durationHours) || isNaN(durationMinutes)) {
          throw new Error('Prazo inválido')
        }

        const totalMilliseconds =
          (durationHours || 0) * 3600000 +
          (durationMinutes || 0) * 60000 +
          (durationSeconds || 0) * 1000

        // Calcula a data e horário finais
        const updatedDate = new Date(startDate.getTime() + totalMilliseconds)

        // Verifica se a data final é válida
        if (isNaN(updatedDate.getTime())) {
          throw new Error('Data final inválida')
        }

        // Atualiza o estado com as datas calculadas
        setFormData(prev => ({
          ...prev,
          schedule_end_date: updatedDate.toISOString().split('T')[0],
          schedule_end_time: `${updatedDate.getHours().toString().padStart(2, '0')}:${updatedDate
            .getMinutes()
            .toString()
            .padStart(2, '0')}:${updatedDate.getSeconds().toString().padStart(2, '0')}`,
        }))
      } catch (error) {
        console.error('Erro ao calcular a data de agendamento:', error.message)
      }
    }
  }, [formData.schedule_date, formData.schedule_start_time, serviceData])

  useEffect(() => {
    if (initialData) {
      return
    }
    setFormData(prev => ({ ...prev, schedule_start_time: '' }))
  }, [formData.schedule_date])

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (
      field === 'service_id' ||
      field === 'schedule_start_time' ||
      field === 'schedule_date' ||
      field === 'address_id'
    ) {
      setFormData(prev => ({ ...prev, schedule_agent_id: null }))
    }
  }

  const handleSave = async () => {
    const normalizedProductsIds = Array.isArray(formData.products) ? formData.products : [formData.products];
  
    const dataToSend = {
      schedule_creator: formData.schedule_creator,
      service_id: formData.service_id,
      customer_id: formData.customer_id,
      project_id: formData.project_id,
      products: normalizedProductsIds, 
      schedule_date: formData.schedule_date,
      schedule_start_time: formData.schedule_start_time,
      schedule_end_date: formData.schedule_end_date,
      schedule_end_time: formData.schedule_end_time,
      address_id: formData.address_id,
      latitude: formData.latitude,
      longitude: formData.longitude,
      status: formData.status,
      observation: formData.observation,
      going_to_location_at: formData.going_to_location_at,
      execution_started_at: formData.execution_started_at,
      execution_finished_at: formData.execution_finished_at,
    }
  
    console.log('Dados a serem enviados:', dataToSend)
  
    try {
      if (id) {
        await scheduleService.updateSchedule(id, dataToSend)
      } else {
        await scheduleService.createSchedule(dataToSend)
      }
      setFormErrors({})
      setSuccess(true)
    } catch (err) {
      setSuccess(false)
      setFormErrors(err.response?.data || {})
      console.error(err.response?.data || err)
    }
  }
  

  return {
    formData,
    handleChange,
    handleSave,
    formErrors,
    success,
  }
}

export default useScheduleForm
