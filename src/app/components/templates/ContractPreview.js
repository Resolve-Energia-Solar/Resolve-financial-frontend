import Image from 'next/image';

const Contract = ({
  id_customer,
  id_first_document,
  id_second_document,
  id_customer_address,
  id_customer_house,
  id_customer_zip,
  id_customer_city,
  id_customer_locality,
  id_customer_state,
  quantity_material_3,
  id_material_3,
  id_material_1,
  id_material_2,
  watt_pico,
  project_value_format,
  id_payment_method,
  id_payment_detail,
  observation_payment,
  dia,
  mes,
  ano,
}) => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <style jsx>{`
        .title { font-size: 18pt; font-weight: bold; text-align: center; margin-bottom: 20px; }
        .subtitle { font-size: 15pt; color: #666666; margin-top: 20px; margin-bottom: 10px; }
        .text { font-size: 12pt; line-height: 1.6; text-align: justify; }
        table { width: 100%; margin-top: 20px; }
        td { padding: 10px; vertical-align: top; }
        .signature-table { margin-top: 40px; }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <p>RESOLVE ENERGIA SOLAR LTDA</p>
          <p>CNPJ: 32.012.032/0001-01</p>
          <p>Telefone: 91 98572-4544</p>
          <p>E-mail: resolvesoollar@gmail.com</p>
        </div>
        <Image
          src="https://res.cloudinary.com/dyykoh8t4/image/upload/v1710548053/Resolve/image1_ugrpkk.png"
          alt="Logo Resolve Energia"
          width={214.5}
          height={72}
        />
      </div>

      <h1 className="title">INSTRUMENTO PARTICULAR DE CONTRATO DE PROJETO E INSTALAÇÃO FOTOVOLTAICO</h1>

      <p className="text">
        {id_customer}, portador(a) do CPF n° {id_first_document}, e da Carteira de Identidade n° {id_second_document}, residente e domiciliado(a) na {id_customer_address}, {id_customer_house}, CEP: {id_customer_zip}, bairro: {id_customer_city}, cidade: {id_customer_locality}/{id_customer_state}, neste ato denominado(a) CONTRATANTE e do outro lado;
      </p>

      <p className="text">
        RESOLVE ENERGIA SOLAR LTDA, empresa cadastrada no CNPJ 32.012.032/0001-01, com sede legal na Avenida Duque de Caxias, n° 1253, Bairro: Marco, CEP: 66093-029, Cidade: Belém/PA, neste ato, representado pelo seu DIRETOR ADMINISTRATIVO Benedito João Viegas de Matos, portador do CPF n° 925.437.152-15 e RG n° 5081093, residente e domiciliado à cidade de Belém/PA, neste ato denominada CONTRATADA RESOLVE ENERGIA SOLAR, têm ajustado entre si o que segue:
      </p>

      <h2 className="subtitle">Do objeto do contrato</h2>
      <p className="text">
        1. O(A) CONTRATANTE confia à CONTRATADA RESOLVE ENERGIA SOLAR e aceita, a execução de todas as atividades necessárias para a realização, teste e conexão do projeto fotovoltaico que compreende:
      </p>
      <ul className="text">
        <li>Fornecimento e instalação de materiais elétricos (quadro de string DC, quadro de paralelo AC);</li>
        <li>Fornecimento e instalação de estrutura metálica para suporte de módulos fotovoltaicos;</li>
        <li>Fornecimento e instalação de componentes elétricos;</li>
        <li>Conexão elétrica entre módulos, quadros DC, inversor e quadro baixa tensão;</li>
        <li>Teste de funcionalidade e entrega de conformidade da usina;</li>
        <li>Avaliação do projeto de ajuste, caso necessário;</li>
        <li>Homologação do sistema junto a Concessionária de Energia Elétrica (Equatorial);</li>
        <li>Fornecimento de {quantity_material_3} módulos solares {id_material_3};</li>
        {id_material_1 && <li>1 {id_material_1}</li>}
        {id_material_2 && <li>1 {id_material_2}</li>}
      </ul>

      <h2 className="subtitle">Exclusões do contrato</h2>
      <p className="text">
        2. São excluídos do presente contrato:
      </p>
      <ul className="text">
        <li>Obras civis: estrutura de edifícios, fundações, terraplenagem, armação, drenagem, ampliação ou restauração no imóvel;</li>
        <li>Fornecimento de telha, exceto quando no momento da instalação alguma telha for danificada;</li>
        <li>Obras de transmissão de energia em linha aérea: cabeamento até a rede da concessionária;</li>
        <li>Estrutura mecânica de reforço do telhado (onde previsto);</li>
        <li>Cálculo estrutural do telhado (quando não previsto no artigo 2.1).</li>
      </ul>

      <h2 className="subtitle">Valores e forma de pagamento</h2>
      <p className="text">
        O valor que deverá ser pago pelo(a) CONTRATANTE à CONTRATADA RESOLVE ENERGIA SOLAR corresponde ao total de R$ {project_value_format}.
      </p>
      <ul className="text">
        <li>6.1. Pagamento de 100% do valor do projeto no valor de R$ {project_value_format}</li>
        <li>6.2. {id_payment_method}, {id_payment_detail}, {observation_payment}</li>
      </ul>

      <h2 className="subtitle">Obrigações da contratada</h2>
      <p className="text">
        A CONTRATADA RESOLVE ENERGIA SOLAR compromete-se a fornecer os equipamentos e executar a instalação dos itens mencionados na Cláusula 1 deste contrato.
      </p>

      <h2 className="subtitle">Prazos</h2>
      <p className="text">
        O cumprimento deste contrato iniciar-se-á na data de sua assinatura e as várias fases das obras deverão ser completadas no prazo máximo de 100 (cem) dias.
      </p>

      <h2 className="subtitle">Garantias</h2>
      <p className="text">
        A CONTRATADA RESOLVE ENERGIA SOLAR garante que os equipamentos atendem às Especificações Técnicas. O prazo de garantia será de 1 (um) ano para mão de obra.
      </p>

      <div className="signature-table">
        <table>
          <tbody>
            <tr>
              <td>
                <p>_______________________________</p>
                <p>{id_customer}</p>
              </td>
              <td>
                <p>_______________________________</p>
                <p>RESOLVE ENERGIA SOLAR</p>
                <p>Benedito João Viegas de Matos</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p style={{ marginTop: '40px', textAlign: 'center' }}>Belém, {dia} de {mes} de {ano}</p>
    </div>
  );
};

export default Contract;
