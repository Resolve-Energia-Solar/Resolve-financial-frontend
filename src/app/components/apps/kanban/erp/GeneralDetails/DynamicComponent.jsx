import RequestEnergyCompany from './RequestEnergyCompany';
import FielService from './FieldService';
import Financier from './Financier';
import Contract from './Contract';
import Project from './Project';
import { Chip } from '@mui/material';

const components = {
  FielService,
  Project,
  Financier,
  Contract,
  RequestEnergyCompany
};

export default function DynamicComponent({ componentName, data }) {
  const SelectedComponent = components[componentName] || (() => <Chip label="Componente não encontrado" color='error'/>);
  return <SelectedComponent data={data}/>;
}
