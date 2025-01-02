import RequestEnergyCompany from './RequestEnergyCompany';
import FielService from './FieldService';
import Financier from './Financier';
import Contract from './Contract';
import Project from './Project';

const components = {
    FielService,
    Project,
    Financier,
    Contract
};

export default function DynamicComponent({ componentName }) {
  const SelectedComponent = components[componentName] || (() => <div>Not Found</div>);
  return <SelectedComponent />;
}
