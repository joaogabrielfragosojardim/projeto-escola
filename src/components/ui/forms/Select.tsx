import type { Props as ReactSelectProps } from 'react-select';
import SelectTypeScript, { components } from 'react-select';

interface ISelectProps extends ReactSelectProps {
  options: { value: string; label: string }[];
  styles: any;
}

const NoOptionsMessage = (props: any) => {
  return (
    <components.NoOptionsMessage {...props}>
      <span>Sem Resultados</span>
    </components.NoOptionsMessage>
  );
};

export const Select = (props: ISelectProps) => {
  return (
    <SelectTypeScript
      {...props}
      placeholder={props.placeholder}
      components={{ NoOptionsMessage }}
      styles={{ ...props.styles, noOptionsMessage: (base) => ({ ...base }) }}
      isSearchable
      // @ts-ignore
      options={props.options}
    />
  );
};
