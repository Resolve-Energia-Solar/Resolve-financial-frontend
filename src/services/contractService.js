import apiClient from './apiClient';

const contractService = {
   /**
     * Sends a contract to the server.
     * 
     * @param {Object} payload - The payload containing sale ID and contract data.
     * @param {string} payload.sale_id - The sale ID.
     * @param {Object} payload.contract_data - The detailed contract data.
     * @param {string} payload.contract_data.id_customer - The customer's name.
     * @param {string} payload.contract_data.id_first_document - The customer's primary document (e.g., CPF).
     * @param {string} payload.contract_data.id_second_document - The customer's secondary document (e.g., RG).
     * @param {string} payload.contract_data.id_customer_address - The customer's address.
     * @param {string} payload.contract_data.id_customer_house - The customer's house number.
     * @param {string} payload.contract_data.id_customer_zip - The customer's ZIP code.
     * @param {string} payload.contract_data.id_customer_city - The customer's city and neighborhood.
     * @param {string} payload.contract_data.id_customer_locality - The customer's locality.
     * @param {string} payload.contract_data.id_customer_state - The customer's state abbreviation.
     * @param {string} payload.contract_data.quantity_material_3 - The quantity of material 3.
     * @param {string} payload.contract_data.watt_pico - The watt peak value.
     * @param {string} payload.contract_data.project_value_format - The formatted project value.
     * @param {string} payload.contract_data.dia - The day of the contract.
     * @param {string} payload.contract_data.mes - The month of the contract.
     * @param {string} payload.contract_data.ano - The year of the contract.
     * 
     * @returns {Promise<Object>} The response data from the server.
     */
    sendContract: async (data) => {
        const response = await apiClient.post(`/api/generate-contract/`, data);
        return response.data;
    },

    previewContract: async (data) => {
        const response = await apiClient.post(`/api/generate-contract/?preview=true`, data);
        return response.data;
    }
};

export default contractService;
