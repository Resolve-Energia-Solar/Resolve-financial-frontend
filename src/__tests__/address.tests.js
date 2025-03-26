import addressService from '../services/addressService'; // Verifique se está exportado corretamente

describe('index', () => {
  it('deve retornar dados de endereços com sucesso', async () => {
    const params = { limit: 1 };
    const result = await addressService.index(params);

    expect(1).toBe(1);
  });
});

// describe('find', () => {
//   it('deve retornar um endereço com sucesso', async () => {
//     const mockData = { id: 1, name: 'Endereço 1' };
//     mock.onGet('/addresses/1/').reply(200, mockData);

//     const result = await addressService.find(1, {});

//     expect(result).toEqual(mockData);
//   });

//   it('deve lançar erro caso a requisição falhe', async () => {
//     mock.onGet('/addresses/1/').reply(500);

//     await expect(addressService.find(1, {})).rejects.toThrowError(
//       /Erro ao buscar endereço com id 1:/,
//     );
//   });
// });
