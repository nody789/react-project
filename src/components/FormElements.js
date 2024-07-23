import { Combobox } from 'react-widgets';
const FormErrorMsg = ({ errors, name }) => {
  return (
    errors[name] && (
      <div className='invalid-feedback'>{errors?.[name]?.message}</div>
    )
  );
};
export const Input = ({
  register,
  errors,
  id,
  type,
  labelText,
  rules,
  placeholder = '',
  onChange,
}) => {
  return (
    <>
      <label htmlFor={id} className='form-label'>
        {labelText}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={`form-control ${errors[id] ? 'is-invalid' : ''}`}
        {...register(id, rules)}
        onChange={onChange}
      />
      <FormErrorMsg errors={errors} name={id} />
    </>
  );
};

export const Textarea = ({
  id, labelText, register, type, errors, rules, rows
}) => {
  return (
    <>
    <label htmlFor={id} className='form-label'>
          {labelText}
        </label>
        <textarea
          id={id}
          type={type}
          rows={rows}
          className={`form-control  ${errors[id] && 'is-invalid'}`}
          {...register(id, rules)}
        />
        {errors[id] && (
          <div className='invalid-feedback'>{errors[id]?.message}</div>
        )}
    </>
  );
};

export const CheckboxRadio = ({
  register,
  errors,
  type,
  name,
  id,
  value,
  rules,
  labelText,
  hasErrorMsg,
}) => {
  return (
    // <div className='form-check p-0'>
    //   <input
    //     className={`btn-check${errors[name] ? 'is-invalid' : ''}`}
    //     type={type}
    //     id={id}
    //     value={value}
    //     {...register(name, rules)}
    //   />
    //   <label className='btn btn-light  rounded-circle' htmlFor={id}>
    //     {labelText}
    //   </label>

    //   {hasErrorMsg && <FormErrorMsg errors={errors} name={name} />}
    // </div>
   
      <div className='form-check p-0 flex-fill me-2'>
        <input
          className={`btn-check${errors[name] ? ' is-invalid' : ''}`}
          type={type}
          id={id}
          value={value}
          {...register(name, rules)}
        />
        <label className='btn btn-light btn-heckboxRadio w-100  ' htmlFor={id}>
          {labelText}
        </label>
        {hasErrorMsg && <FormErrorMsg errors={errors} name={name} />}
      </div>
     
  );
};

export const Selectbox = ({
  Controller,
  control,
  data,
  labelText,
  id,
  placeholder,
  rules,
}) => {
  return (
    <>
      <label className='w-100 form-label' htmlFor={`${id}_input`}>
        {labelText}
      </label>
      <Controller
        name={id}
        control={control}
        rules={rules}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <div>
            <Combobox
              id={id}
              name={id}
              placeholder={placeholder}
              data={data}
              value={value}
              onChange={onChange}
              messages={{ emptyFilter: '目前無此分類' }}
              onBlur={onBlur}
              inputProps={{
                className: `form-control ${error?.message ? 'is-invalid' : ''}`,
              }}
            />
            {<div className='invalid-feedback d-block'>{error?.message}</div>}
          </div>
        )}
      />
    </>
  );
};

export const Select = ({
  register,
  errors,
  labelText,
  id,
  rules,
  disabled,
  children,
}) => {
  return (
    <>
      <label htmlFor={id} className='form-label'>
        {labelText}
      </label>
      <select
        id={id}
        className={`form-select ${errors[id] ? 'is-invalid' : ''}`}
        {...register(id, rules)}
        disabled={disabled}
      >
        {children}
      </select>
      <FormErrorMsg errors={errors} name={id} />
    </>
  );
};
