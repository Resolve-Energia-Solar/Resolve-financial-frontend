// import { ClientCard } from '../ClientCard';
// import ClientCardChips from '../ClientCard/ClientCardChips';

// export default function DetailsVisualizationClientCard({ clientTitle, clientSubtitle, adressTitle, addressSubtitle, loading }) {
//     return (
//         <ClientCard.Root>
//             <ClientCard.Client
//                 title="Cliente"
//                 subtitle={project?.sale?.customer?.complete_name}
//                 loading={loading}
//             />

//             <ClientCard.Address
//                 title="Endereço"
//                 subtitle={
//                     project?.address
//                         ? `${project.address.street}, ${project.address.number}`
//                         : 'Não informado'
//                 }
//                 loading={loading}
//             />

//             <ClientCardChips
//                 chipsTitle="Parecer final"
//                 status={selectedInspectionId?.final_service_opinion?.name}
//                 loading={loading}
//             />

//         </ClientCard.Root>
//     );
// }